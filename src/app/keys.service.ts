import { Injectable } from '@angular/core';

@Injectable()
export class KeysService {
  
  constructor() { }

  getKeys ()  {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get( null, (res) => {
        resolve(res);
      });
    });
  }
}
