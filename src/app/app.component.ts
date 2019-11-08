import { Component, OnInit } from '@angular/core';
import { KeysService } from './keys.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'ytp';
  public ytp_settings;
  constructor(private _keys: KeysService) {}

  async ngOnInit () {
    this.ytp_settings  = await this._keys.getKeys();
  }
}
