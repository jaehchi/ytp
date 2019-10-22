console.log('in the content script,', Mousetrap );

(() => {
  interface KeyAction {
    action: string;
    shortcut: Array<string>;
  }

  class Shortcut {

    keys: KeyAction[] 

    constructor (keys) {
      this.keys = keys;
    }

    configureKeys () {
      this.keys.forEach( key => {
        let action = () => {
          this.triggerKey(key.action);
        }
        
        Mousetrap.bind(key.shortcut, action);
      })
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

  PORT.onMessage.addListener(( payload ) => {
    if ( payload.keys ) {
      
      shortcut = new Shortcut(payload.keys)
      shortcut.configureKeys();
    }
  });

  PORT.postMessage({ action: 'grabKeys' });
})();

