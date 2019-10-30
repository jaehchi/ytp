import { Component, OnInit, Input } from '@angular/core';
import { AliasService } from '../alias.service';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  public bindings = '';
  public buffer = [];
  public isEditing = false;
  public aliases = {};
  public aliasRules = [];
  public lastKeyTime = Date.now();
  
  faPenSquare = faPenSquare;
  @Input('command') public command;


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
      return code.substring(3, 4).toLowerCase();  // want it lowercase for mousetrap. mousetrap will treat uppercase letters as i.e. P => shift + p; 
    }
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

  saveKeyboardShortcut () {
    this.command.bindings = this.bindings;

      chrome.storage.sync.get(null, (settings) => {
        settings.keys.forEach( key => {
          if ( key.name === this.command.name ) {
            key.bindings = this.bindings;          
          }
        });
        chrome.storage.sync.set(settings, () => {})
      });

    this.isEditing = !this.isEditing;
  }

  sortAliases ( commands) {
    // sorting commands
    let newCommands = commands.slice(0);

    const sortAliasWithRules = (a, b) => {
      let _a = this.aliasRules.indexOf(a);
      let _b = this.aliasRules.indexOf(b);

      return _a - _b;
    };

    return newCommands.map( command => {
      return command.sort(sortAliasWithRules);
    });
  }
}
