import { Injectable } from '@angular/core';

@Injectable()
export class KeysService {
  
  constructor() { }

  getKeys ()  {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get( null, (res) => {
        const { previous, play, next, mute, save, focus, theChosenOne } = res;
        resolve({ keys: [ previous, play, next, mute, save, focus ], theChosenOne });
      });
    });
  }
}
