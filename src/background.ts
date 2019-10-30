const commands = [
  {
    command: "_prev",
    name: "previous",
    description: "Replay",
    bindings: "shift+q",
  },
  {
    command: "_next",
    name: "next",
    description: "Next",
    bindings: "shift+e+backspace",
  },
  {
    command: "_play",
    name: "play",
    description: "Toggle Play",
    bindings: "shift+w",
  },
  {
    command: "_mute",
    name: "mute",
    description: "Toggle Mute",
    bindings: "shift+z",
  },
  {
    command: "_save",
    name: "save",
    description: "Add video to playlist",
    bindings: "shift+s"
  },
  {
    command: "_focus",
    name: "focus",
    description: "Focus Youtube",
    bindings:  "shift+x"
  }
];

const configureSettings = () => {
  return { keys: commands, theChosenOne: 'Watch later' };
};

const handleShortcut = ( action: string ) => {
  chrome.tabs.query({ url: 'https://www.youtube.com/*'} , function (tabs) {
    if ( !tabs.length ) {
      chrome.tabs.create({ url: 'https://www.youtube.com' });
    }

    for ( let tab of tabs ) {
      if ( action === '_next' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-next-button").click()' });
      } else if ( action === '_prev' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-prev-button").click()' });
      } else if ( action === '_play' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-play-button").click()' });
      } else if ( action === '_mute' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-mute-button").click()'});
      } else if ( action === '_focus') {
        chrome.tabs.update(tab.id, { active: true });
      } else if ( action === '_save' ) {
        chrome.storage.sync.get('theChosenOne', ({ theChosenOne }) => {
          chrome.tabs.executeScript(tab.id, { code: `var theChosenOne = '${theChosenOne}'`}, function () {
            chrome.tabs.executeScript(tab.id, { file: `util/playlists.js` })
          });
        });
      }
    }
  });
};

const reinjectContentScripts = ( scripts ) => {
  const [ mousetrap, content_script, runtime ] = scripts;
  
  chrome.tabs.query({}, function (tabs) {
    for ( let tab of tabs ) {
      if ( !tab.url.startsWith("chrome") ) {
        chrome.tabs.executeScript(tab.id, { file: `${mousetrap}` }, () => {
          chrome.tabs.executeScript(tab.id, { file: `${content_script}` });
        });
      }
    }
  });
};

chrome.runtime.onInstalled.addListener( ({ reason }) => {
  if ( reason === 'install' ) {
    const settings = configureSettings();
    
    chrome.storage.sync.set(settings, () => { });
  }
  
  if ( reason === 'update' ) {
    const contentScripts = chrome.runtime.getManifest().content_scripts[0].js;
    reinjectContentScripts(contentScripts);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener( ( payload ) => {
    if ( payload.action === 'grabKeys' ) {
      chrome.storage.sync.get( null, (settings) => { 
        port.postMessage(settings);
      });
    }

    handleShortcut(payload.action)
  });
});