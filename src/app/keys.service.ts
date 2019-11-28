import { Injectable } from '@angular/core';

@Injectable()
export class KeysService {
  public os = '';
  constructor() { 
    chrome.runtime.getPlatformInfo( (info) => {
      this.os = info.os;
    });
  }

  getKeys ()  {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get( null, (res) => {
        const { previous, play, next, mute, save, replay, focus, theChosenOne, playlists } = res;
        resolve({ keys: [ previous, next, replay, play, mute, save, focus ], theChosenOne, playlists, os: this.os });
      });
    });
  }
}
