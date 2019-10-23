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

  _formatBuffers (commands) {
    let res = `${commands[0].join('+')}`;

    for ( let i = 1; i < commands.length; i++ ) {
      res = `${res} ${commands[i].join('+')}`;
    }

    return res;
  }
  
  onKeyDown(e) {
    e.preventDefault();
    const key = this.formatKeycode(e.code);
    const currentTime = Date.now();
    let buffer;

    if ( currentTime - this.lastKeyTime > 1000 ) {
      buffer = [key];
      this.buffer = [ buffer ];
    } else if ( currentTime - this.lastKeyTime > 500) {
      buffer = [key];
      this.buffer = [ ...this.buffer, buffer];
    } else {
      buffer = [...this.buffer[this.buffer.length - 1], key];
      this.buffer[this.buffer.length - 1 ] = buffer;
    }

  
    this.commands =  this._formatBuffers(this.buffer);
    this.lastKeyTime = currentTime;

  }

}
