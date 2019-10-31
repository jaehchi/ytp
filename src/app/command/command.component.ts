import { Component, OnInit, Input } from '@angular/core';
import { AliasService } from '../alias.service';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  public isEditing = false;
  public bindings = '';
  public aliases = {};
  public buffer = [];
  public aliasRules = [];
  public lastKeyTime = Date.now();
  
  faPenSquare = faPenSquare;
  @Input('command') public command;
  @Input('ytp') public ytp;


  constructor(private _aliases: AliasService) {}
  
  ngOnInit() {
    this.aliases = this._aliases.getAliases();
    this.aliasRules = this._aliases.getAliasRules();
    
  }

  formatKeycode( code: string ) {
    if ( this.aliases[code] ) {
      return this.aliases[code];
    } else if ( code.startsWith('Digit') ) {
      return code.substring(5, 6);
    } else {
      return code.substring(3, 4).toLowerCase();
    }
  }

  sortAliases (commands) {
    // sorting commands
    let newCommands = commands.slice(0);

    const sortAliasWithRules = (a, b) => {
      return this.aliasRules.indexOf(a) - this.aliasRules.indexOf(b);
    };

    return newCommands.map( command => {
      return command.sort(sortAliasWithRules);
    });
  }
  
  _formatBuffers (commands) { 
    let res = `${commands[0].join('+')}`;

    for ( let i = 1; i < commands.length; i++ ) {
      res = `${res} ${commands[i].join('+')}`;
    }

    return res;
  }
  
  onKeyDown(e) {
    e.preventDefault();

    const key = this.formatKeycode(e.code);
    const currentTime = Date.now();
    let buffer;

    if ( currentTime - this.lastKeyTime < 150 && this.buffer[this.buffer.length - 1].length < 3 && !this.buffer[this.buffer.length - 1].includes(key)) {
      buffer = [...this.buffer[this.buffer.length - 1], key];
      this.buffer[this.buffer.length - 1 ] = buffer;
    } else if ( currentTime - this.lastKeyTime < 1000 && this.buffer.length < 2) {
      buffer = [key];
      this.buffer = [ ...this.buffer, buffer];
    } else {
      buffer = [key];
      this.buffer = [ buffer ];
    }
  
    this.bindings =  this._formatBuffers(this.sortAliases(this.buffer));
    this.lastKeyTime = currentTime;
  }

  saveKeyboardShortcut () { // TODO: prevent duplicate bindings for each command;
    if ( !this.bindings.length ) { // prevents saving nothing;
      this.isEditing = !this.isEditing;
      return;
    }

    for ( let i = 0; i < this.ytp.keys.length; i++ ) {
      if ( this.ytp.keys[i].bindings === this.bindings ) {
        console.log( ' duplicate key combo deteched')
        return;
      }
    }

    this.command.bindings = this.bindings;

    chrome.storage.sync.set( { [this.command.name]: this.command }, () => {
      this.bindings = "";
    });

    this.isEditing = !this.isEditing;
  }
}
