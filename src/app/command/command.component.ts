import { Component, OnInit, Input } from '@angular/core';
import { MatDialog}  from '@angular/material/dialog';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

import { KeyBindingDialogComponent } from '../key-binding-dialog/key-binding-dialog.component';

// TODO: clean up css,  show errors when duplicate bindings is used, 
// reject certain keys, enter to saveToKeyboard.. 
@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})

export class CommandComponent implements OnInit {
  faPenSquare = faPenSquare;
  @Input('command') public command;
  @Input('ytp') public ytp;
  public showEditButton = false;


  constructor(private _dialog: MatDialog) {}
  
  ngOnInit() {}
  
  openDialog (): void {
    const config = {
      height: '150px',
      width: '400px',
    };

    let dialogRef = this._dialog.open(KeyBindingDialogComponent, config);
      
    dialogRef.afterClosed().subscribe(result => {
      result ? this.saveKeyboardShortcut(result) : null;
    });
    
  }

  saveKeyboardShortcut ( binding ) { 
    if ( !binding.length ) { 
      // prevents saving nothing;
      return;
    }

    for ( let i = 0; i < this.ytp.keys.length; i++ ) {
      if ( this.ytp.keys[i].bindings === binding ) {
        // prevents having same bindingw for different actions;
        return;
      }
    }

    this.command.bindings = binding;

    chrome.storage.sync.set( { [this.command.name]: this.command }, () => {
      console.log( 'saved' );
    });
  }
}
