import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA}  from '@angular/material/dialog';

import { KeysService } from './keys.service';
import { CommandComponent } from './command/command.component';
import { KeyBindingDialogComponent } from './key-binding-dialog/key-binding-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ytp';
  public ytp_settings;
  
  constructor(private _keys: KeysService, private _dialog: MatDialog) {}
  

  async ngOnInit () {
    this.ytp_settings  = await this._keys.getKeys();
  }

  openDialog (): void {
    console.log('hit')
    let dialogRef = this._dialog.open(KeyBindingDialogComponent, {
      height: '200px',
      width: '300px',
    });

  }
}
