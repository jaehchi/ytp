import { Component, OnInit, ViewEncapsulation } from '@angular/core';


import { KeysService } from './keys.service';

export interface Playlists {
  value: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit {
  title = 'ytp';
  public ytp_settings;
  public playlists: Playlists[]
  public selectedPlaylist: string;

  constructor(private _keys: KeysService) {}

  async ngOnInit () {
    this.ytp_settings  = await this._keys.getKeys();
    this.playlists = this.ytp_settings.playlists.map( (playlist, index) => { 
      return { value: `${index}-${playlist}`, name: playlist };
    })
    this.selectedPlaylist = this.ytp_settings.theChosenOne;
  }

  savePlaylist (val) {
    console.log('hitting playlists', val)

    chrome.storage.sync.set( { theChosenOne: val });
  }

}
