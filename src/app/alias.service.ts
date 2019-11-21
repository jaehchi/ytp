import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AliasService {
  private aliases = {};
  public macSymbols = {};
  private aliasesRules = [];

  constructor() { 
    this.aliases = this._addAliases();
    this.macSymbols = this._addMacSymbols();
    this.aliasesRules = [ 
      ...this._addSpecialAliasToRules(),
      ...this._addFunctionKeysToRules(),
      ...this._addAlphabetToRules(),
      ...this._addSymbolsToRules(),
      ...this._addNumbersToRules()
    ];
  }

  _addSpecialAliasToRules () {
    return [ 
      'ctrl',
      'shift',
      'alt',
      'command',
      'home', 
      'end',
      'pageup',
      'pagedown',
      'backspace',
      'capslock',
      'space',
      'enter',
      'tab',
      'up',
      'down',
      'left',
      'right',
    ];
  }

  _addSymbolsToRules () {
    return [
      '[',
      ']',
      '\\',
      ';',
      "'", 
      ',',
      '.',
      '/',
      '`',
      '-',
      '=' 
    ];
  }

  _addAlphabetToRules () {
    return 'abcdefghijklmnopqrstuvwxyz'.split('');
  }

  _addNumbersToRules () {
    let numbers = [];

    for ( let i = 1; i < 10; i++ ) { numbers.push(`${i}`); }
    numbers.push("0");
    
    return numbers;
  }

  _addFunctionKeysToRules () {
    let fnKeys = [];

    for ( let i = 1; i < 13; i++ ) { fnKeys.push(`F${i}`); }

    return fnKeys;
  }

  _addMacSymbols () {
    return {
      'left': '←', 
      'up': '↑', 
      'right': '→', 
      'down': '↓', 
      'shift': '⇧',
      'ctrl': '⌃',
      'alt': '⌥',
      'command': '⌘',
      'enter': '↵',
      'backspace': '⌫',
      'capslock': '⇪',
      'tab': '⇥'
    };
  }

  _addAliases () {
    return {
      'BracketLeft': '[',
      'BracketRight': ']',
      'Backslash': '\\',
      'Semicolon': ';',
      'Quote': "'",
      'Comma': ',',
      'Period': '.',
      'Slash': '/',
      'Backquote': '`',
      'Minus': '-',
      'Equal': '=',
      'Backspace': 'backspace',
      'Space': 'space',
      'Enter': 'enter',  
      'Tab': 'tab',
      'Home': 'home', 
      'End': 'end',
      'PageUp': 'pageup',
      'PageDown': 'pagedown',
      'CapsLock': 'capslock',
      'ArrowLeft': 'left', 
      'ArrowUp': 'up', 
      'ArrowRight': 'right', 
      'ArrowDown': 'down', 
      'ShiftLeft': 'shift',
      'ShiftRight': 'shift',
      'ControlLeft': 'ctrl',
      'ControlRight': 'ctrl',
      'AltLeft': 'alt',
      'AltRight': 'alt',
      'MetaLeft': 'command',
      'MetaRight': 'command',
    }
  }

  _getMacGlyphs () {
    return this.macSymbols;
  }

  sortBuffersWithAliasRules ( commands: Array<Array<string>> ) {
    // sorting commands
    let newCommands = commands.slice(0);

    const sortAliasWithRules = (a, b) => {
      return this.aliasesRules.indexOf(a) - this.aliasesRules.indexOf(b);
    };

    return newCommands.map( command => {
      return command.sort(sortAliasWithRules);
    });
  }

  formatKeycode ( code: string ) { 
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
}
