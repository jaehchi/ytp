import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  public commands = 'shift+o';
  public buffer = [];
  public lastKeyTime = Date.now();


  constructor() { }

  ngOnInit() {}

  formatKeycode( code: string ) {
    const alias = {
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
      'MetaLeft': 'meta',
      'MetaRight': 'meta',
    }

    if ( alias[code] ) {
      return alias[code];
    } else if ( code.startsWith('Digit') ) {
      return code.substring(5, 6);
    } else {
      return code.substring(3, 4).toLowerCase();
    }
  }
  
  onKeyDown(e) {
    e.preventDefault();
    const key = this.formatKeycode(e.code);
    const currentTime = Date.now();
    let buffer = [];

    if ( currentTime - this.lastKeyTime > 1000 ) {
      buffer = [key];
      this.commands = 'key'
    } else {
      buffer = [...this.buffer, key];
      let string = [...buffer].join('+');
      this.commands = string;
    }

    
    this.buffer = buffer;
    this.commands = [...this.buffer].join('+')
    this.lastKeyTime = currentTime;


  }
}
