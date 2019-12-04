const commands = {
  "previous": {
    name: "previous",
    command: "_prev",
    description: "Play previous",
    bindings: "shift+q",
  },
  "next": {
    name: "next",
    command: "_next",
    description: "Play next",
    bindings: "shift+e",
  },
  "play": {
    name: "play",
    command: "_play",
    description: "Toggle play",
    bindings: "shift+w",
  },
  "replay": {
    name: "replay",
    command: "_replay",
    description: "Replay",
    bindings: "shift+r",
  },
  "mute": {
    name: "mute",
    command: "_mute",
    description: "Toggle mute",
    bindings: "shift+z",
  },
  "save": {
    name: "save",
    command: "_save",
    description: "Add video to playlist",
    bindings: "shift+s"
  },
  "focus": {
    name: "focus",
    command: "_focus",
    description: "Toggle focus",
    bindings:  "shift+x"
  }
};


const configureSettings = () => {
  chrome.tabs.query({ url: 'https://www.youtube.com/*'}, (tabs) => {
    for ( let tab of tabs ) { 
      chrome.tabs.executeScript(tab.id, { file: `util/playlists.js` });
    }
  });

  return { 
    ...commands,
    theChosenOne: 'Watch later',
    previouslyFocusedTabId: null,
  };
};

const handleShortcut = ( action: string ) => {
  chrome.tabs.query({ url: 'https://www.youtube.com/*'}, (tabs) => {
    if ( !tabs.length ) {
      chrome.tabs.create({ url: 'https://www.youtube.com' });
    }

    for ( let tab of tabs ) {
      if ( action === '_next' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-next-button").click()'});
      } else if ( action === '_prev' ) {
        chrome.tabs.executeScript(tab.id, { code: 'window.history.back()'});
      } else if ( action === '_play' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-play-button").click()'});
      } else if ( action === '_replay') {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-prev-button").click()'});
      } else if ( action === '_mute' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-mute-button").click()'});
      } else if ( action === '_focus') {
        chrome.tabs.query({ active: true }, (activeTab)=> { 
          handleToggleFocus( activeTab[0].id, tab.id);
        });
      } else if ( action === '_save' ) {
        chrome.storage.sync.get('theChosenOne', ({ theChosenOne }) => {
          chrome.tabs.executeScript(tab.id, { code: `var theChosenOne = '${theChosenOne}'`}, function () {
            chrome.tabs.executeScript(tab.id, { file: `util/saveVideo.js` });
          });
        });
      }
    }
  });
};
const handleToggleFocus = (activeTabId: number, ytTabId: number) => {
  if ( activeTabId === ytTabId ) {
    chrome.storage.sync.get('previouslyFocusedTabId', ({ previouslyFocusedTabId }) => {
      chrome.tabs.update( previouslyFocusedTabId, { active: true });
    });
  } else { 
    chrome.storage.sync.set({ previouslyFocusedTabId: activeTabId });
    chrome.tabs.update( ytTabId, { active: true });
  }
}

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
    console.log(settings, 'configuresettings')
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
    
    chrome.storage.sync.get( null, (settings) => { 
      settings.playlists = payload.playlists;
      chrome.storage.sync.set(settings, () => {});
    });

    handleShortcut(payload.action);
  });
});