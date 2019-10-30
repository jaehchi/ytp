(() => {
  // interface KeyAction {
  //   action: string;
  //   shortcut: Array<string>;
  // }

  interface KeyBinding{ 
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
  

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('hello storage,oncahcnage', changes, namespace )
  });
  
  PORT.onMessage.addListener(( payload ) => {
    console.log('payload,', payload)
    if ( payload.keys ) {
      
      shortcut = new Shortcut(payload.keys)
      shortcut.configureKeys();
    }
  });

  PORT.postMessage({ action: 'grabKeys' });
})();

