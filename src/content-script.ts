(() => {
  interface KeyBinding { 
    name: string;
    command: string;
    description: string;
    binding: string;
  }

  class Shortcut {
    keys: KeyBinding; 

    constructor (keys) {
      this.keys = keys;
    }

    configureKeys () {
      for ( let key in this.keys ) {
        let { command, bindings } = this.keys[key];
        let action = () => { this.triggerKey( command )};
        Mousetrap.bind( bindings, action);
      } 
    }

    triggerKey ( action ) {
      try { 
        PORT.postMessage({ action })
      } catch ( err ) {
        // If an error is caught, the content script is orphaned. To prevent the orphaned script from communicating thru port
        // when hotkeys are pressed, we reset Mousetrap on the orphaned script, unbinding all keys.
        // Mousetrap.reset()
        // better error handling?
      }
    }
  }

  const PORT = chrome.runtime.connect({ name: `${chrome.runtime.id}-yt-pilot::port` });
  let shortcut;

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
      const { bindings, command } = changes[key].newValue; 
      
      Mousetrap.unbind(changes[key].oldValue.bindings);
      Mousetrap.bind( bindings, () => { shortcut.triggerKey(command) });
    }
  });
  
  PORT.onMessage.addListener(( payload ) => {
    if ( payload ) {
      const { previous, play, next, replay, mute, save, focus } = payload;
      shortcut = new Shortcut([ previous, play, next, replay, mute, save, focus ]);
      shortcut.configureKeys();
    }
  });

  PORT.postMessage({ action: 'grabKeys' });
})();

