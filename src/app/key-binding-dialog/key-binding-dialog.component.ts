import { Component, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }  from '@angular/material/dialog';

import { AliasService } from '../alias.service';
import { FormatService } from '../format.service';

@Component({
  selector: 'app-key-binding-dialog',
  templateUrl: './key-binding-dialog.component.html',
  styleUrls: ['./key-binding-dialog.component.scss']
})
export class KeyBindingDialogComponent {
  public bindings = '';
  public showBindings = [];
  public buffer = [];
  public lastKeyTime = Date.now();
  public aliases = {};
  public mac = {};
  public aliasRules = [];
  public os = '';

  constructor( 
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _aliases: AliasService,
    private _format: FormatService,
    public _dialogRef: MatDialogRef<KeyBindingDialogComponent>, 
  ) {}

  ngOnInit() {}

  onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    
    const key = this._aliases.formatKeycode(e.code); // formats key code alias rules  i.e space 1 a etc
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
      this.buffer = [...this.buffer, buffer];
    } else {
      buffer = [key];
      this.buffer = [ buffer ];
    }
  
    let sortedAliases = this._aliases.sortBuffersWithAliasRules( this.buffer );
    this.bindings = this._format.formatBuffers(sortedAliases);
    this.showBindings = this._format.formatForOS(this.bindings, null);

    this.lastKeyTime = currentTime;
  }

  _closeDialog() {
    this._dialogRef.close(this.bindings);
    return;
  }
}
