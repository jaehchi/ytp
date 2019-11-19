import { Injectable } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class AliasService {
  public aliases = {
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

  public macGlyphs = {
    'left': '←', 
    'up': '↑', 
    'right': '→', 
    'down': '↓', 
    'shift': '⇧',
    'ctrl': '⌃',
    'alt': '⌥',
    'command': '⌘',
    'enter': '↩',
    'backspace': '⌫',
    'capslock': '⇪',
    'tab': '⇥'
  };

  public aliasesRules = [];

  constructor() { 
    this.aliasesRules = [ 
      ...this.addSpecialAliasToRules(),
      ...this.addFunctionKeysToRules(),
      ...this.addAlphabetToRules(),
      ...this.addSymbolsToRules(),
      ...this.addNumbersToRules()
    ];
  }

  addSpecialAliasToRules () {
    return [ 
      'ctrl',
      'shift',
      'alt',
      'command',
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

  addSymbolsToRules () {
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

  addAlphabetToRules () {
    return 'abcdefghijklmnopqrstuvwxyz'.split('');
  }

  addNumbersToRules () {
    let numbers = [];

    for ( let i = 1; i < 10; i++ ) { numbers.push(`${i}`); }
    numbers.push("0");
    
    return numbers;
  }

  addFunctionKeysToRules () {
    let fnKeys = [];

    for ( let i = 1; i < 13; i++ ) { fnKeys.push(`F${i}`); }

    return fnKeys;
  }
  
  getAliases ()  {
    return this.aliases;
  }

  getAliasRules () {
    return this.aliasesRules;
  }

  getMacGlyphs () {
    return this.macGlyphs;
  }

  sortBuffersWithAliasRules ( commands ) {
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
