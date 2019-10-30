import { Component, OnInit, Input } from '@angular/core';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent implements OnInit {
  public bindings = '';
  public buffer = [];
  public isEditing = false;
  public shortcutLimit = 3;
  public lastKeyTime = Date.now();
  
  faPenSquare = faPenSquare;
  @Input('command') public command;


  constructor() {}
  
  ngOnInit() {}

  formatKeyGlyphs () {
    const macGlyphs = {
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
  }

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

    if ( currentTime - this.lastKeyTime < 125 && this.buffer[this.buffer.length - 1].length < 3 && !this.buffer[this.buffer.length - 1].includes(key)) {
        buffer = [...this.buffer[this.buffer.length - 1], key];
        this.buffer[this.buffer.length - 1 ] = buffer;
    } else if ( currentTime - this.lastKeyTime < 1000 && this.buffer.length < 2) {
      buffer = [key];
      this.buffer = [ ...this.buffer, buffer];
    } else {
      buffer = [key];
      this.buffer = [ buffer ];
    }
  
    this.bindings =  this._formatBuffers(this.buffer);
    this.lastKeyTime = currentTime;
  }

  saveKeyboardShortcut () {
    this.command.bindings = this.bindings;

      chrome.storage.sync.get(null, (settings) => {
        settings.keys.forEach( key => {
          if ( key.name === this.command.name ) {
            key.bindings = this.bindings;          
          }
        });
        chrome.storage.sync.set(settings, () => {})
      });
      this.isEditing = !this.isEditing;
  }

  fetchKeyboardShortcut () {

  }

}
