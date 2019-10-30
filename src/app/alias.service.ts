import { Injectable } from '@angular/core';

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
    'ArrowLeft': 'left', 
    'ArrowUp': 'up', 
    'ArrowRight': 'right', 
    'ArrowDown': 'down', 
    'Tab': 'tab',
    'CapsLock': 'capslock',
    'ShiftLeft': 'shift',
    'ShiftRight': 'shift',
    'ControlLeft': 'ctrl',
    'ControlRight': 'ctrl',
    'AltLeft': 'alt',
    'AltRight': 'alt',
    'MetaLeft': 'cmd',
    'MetaRight': 'cmd',
  }
  public macGlyphs = {
    'ArrowLeft': '←', 
    'ArrowUp': '↑', 
    'ArrowRight': '→', 
    'ArrowDown': '↓', 
    'ShiftLeft': '⇧',
    'ShiftRight': '⇧',
    'ControlLeft': '⌃',
    'ControlRight': '⌃',
    'AltLeft': '⌥',
    'AltRight': '⌥',
    'MetaLeft': '⌘',
    'MetaRight': '⌘',
  }
  public aliasesRules = [ 
    'ctrl',
    'shift',
    'cmd',
    'alt',
    'backspace',
    'space',
    'enter',
    'tab',
    'capslock',
    'left',
    'up',
    'right',
    'down',
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

  constructor() { 
    this.aliasesRules = [...this.aliasesRules, ...this.addAlphabetAndNumbers()]
  }

  addAlphabetAndNumbers () {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let numbers = [];

    for ( let i = 1; i < 10; i++ ) { numbers.push(`${i}`) }
    numbers.push(0);

    return [ ...alphabet, ...numbers ];
  }

  getAliases ()  {
    return this.aliases;
  }

  getAliasRules () {
    return this.aliasesRules;
  }
}
