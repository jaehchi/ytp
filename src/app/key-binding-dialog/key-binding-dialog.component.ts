import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }  from '@angular/material/dialog';

import { AliasService } from '../alias.service';

@Component({
  selector: 'app-key-binding-dialog',
  templateUrl: './key-binding-dialog.component.html',
  styleUrls: ['./key-binding-dialog.component.scss']
})
export class KeyBindingDialogComponent {
  public bindings = '';
  public showBindings = '';
  public buffer = [];
  public lastKeyTime = Date.now();
  public aliases = {};
  public aliasRules = [];
  

  constructor( 
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _aliases: AliasService,
    public _dialogRef: MatDialogRef<KeyBindingDialogComponent>, 
  ) { }

  ngOnInit() {
    this.aliases = this._aliases.getAliases();
    this.aliasRules = this._aliases.getAliasRules();
  }

  onKeyDown(e) {
    e.preventDefault();
    const key = this.formatKeycode(e.code);
    const currentTime = Date.now();
    let buffer;

    if ( this.buffer.length === 0 && key === 'enter' ) {
      this._closeDialog();
      return;
    }

    if ( currentTime - this.lastKeyTime < 150 && this.buffer[this.buffer.length - 1].length < 3 && !this.buffer[this.buffer.length - 1].includes(key) ) {
      buffer = [...this.buffer[this.buffer.length - 1], key];
      this.buffer[this.buffer.length - 1 ] = buffer;
    } else if ( currentTime - this.lastKeyTime < 300 && this.buffer.length < 2 ) {
      buffer = [key];
      this.buffer = [ ...this.buffer, buffer];
    } else if ( currentTime - this.lastKeyTime < 800 && key === 'enter' || this.buffer.length === 2 && key === 'enter' ) {
      this._closeDialog()
    } else {
      buffer = [key];
      this.buffer = [ buffer ];
    } 
  
    this.bindings =  this._formatBuffers(this.sortAliases(this.buffer));
    this.showBindings = this._formatBuffersForShow(this.sortAliases(this.buffer));
    this.lastKeyTime = currentTime;
  }
  
  formatKeycode( code: string ) {
    if ( code === 'Escape' ) {
      return false;
    }

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

  _formatBuffersForShow (commands) {
    let res = `${commands[0].join('+')}`;

    for ( let i = 1; i < commands.length; i++ ) {
      res = `${res} chords to ${commands[i].join('+')}`;
    }

    return res;
  }

  _closeDialog() {
    this._dialogRef.close(this.bindings);
    return;
  }
}
