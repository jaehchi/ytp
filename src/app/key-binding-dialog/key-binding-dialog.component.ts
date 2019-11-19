import { Component, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }  from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

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
  public mac = {};
  public aliasRules = [];
  public os = '';

  constructor( 
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _aliases: AliasService,
    public _dialogRef: MatDialogRef<KeyBindingDialogComponent>, 
  ) { 
    chrome.runtime.getPlatformInfo( (info) => {
      this.os = info.os;
    });

    console.log(this)
  }

  ngOnInit() {
    this.aliases = this._aliases.getAliases();
    this.aliasRules = this._aliases.getAliasRules();
    this.mac = this._aliases.getMacGlyphs();
  }

  onKeyDown(e) {
    console.log(this)
    e.preventDefault();

    const key = this.formatKeycode(e.code);
    const currentTime = Date.now();
    const isEnterForSave = this.buffer && key === 'enter' && (this.buffer.length === 0 || this.buffer.length === 2);
    let buffer;

    if ( isEnterForSave ) {
      this._closeDialog();
      return;
    }

    if ( currentTime - this.lastKeyTime < 125 && this.buffer[this.buffer.length - 1].length < 3 && !this.buffer[this.buffer.length - 1].includes(key) ) {
      buffer = [...this.buffer[this.buffer.length - 1], key];
      this.buffer[this.buffer.length - 1 ] = buffer;
    } else if ( currentTime - this.lastKeyTime < 700 && this.buffer.length < 2 ) {
      if ( key === 'enter' )  {
        this._closeDialog();
        return;
      } 
      buffer = [key];
      this.buffer = [ ...this.buffer, buffer];
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
    } else if ( code.startsWith('Key') ) {
      return code.substring(3, 4).toLowerCase();
    } else {
      return code;
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
    let formatted;

    if ( this.os === 'mac' ) {
      formatted = commands.map( command => {
        return command.map( key => {
          if ( this.mac[key] ) {
            return this.mac[key];
          }

          return key.toUpperCase();
        });
      });
    } else {
      formatted = commands;
    }

    let res = `${formatted[0].join('+')}`;

    for ( let i = 1; i < formatted.length; i++ ) {
      res = `${res} ${formatted[i].join('+')}`;
    }

    return res;
  }

  _closeDialog() {
    this._dialogRef.close(this.bindings);
    return;
  }
}
