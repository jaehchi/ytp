import { Injectable } from '@angular/core';

import { AliasService } from './alias.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  public os = '';

  constructor(  private _aliases: AliasService ) {
    chrome.runtime.getPlatformInfo( (info) => { this.os = info.os; });
  }

  formatBuffers (commands: Array<Array<string>>) { 
    return commands.map( command => {
      return command.join('+');
    }).join(' ');
  }

  formatForOS (commands: string, os: string | null) { // stirng ==> 
    let op = os || this.os;

    return commands.split(' ').map( command => {
      return command.split('+').map( key => {
        if ( op === 'mac' && this._aliases.macSymbols[key] ) {
          return this._aliases.macSymbols[key];
        }

        return key.charAt(0).toUpperCase() + key.slice(1);
      });
    }); 
  }
}
