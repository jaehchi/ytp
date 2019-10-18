console.log('hello from background page :)', localStorage);
const defaultKeys = {
  '_prev_': ['{'],
  '_next_': ['|'],
  '_togglePlay_': ['}'],
  '_toggleMute_': ['"'],
  '_toggleSave_': ['+'],
  '_toggleFocus_': [':'], 
};

const configureSettings = () => {
  const keys = [];

  for ( let action in defaultKeys ) {
    keys.push({
      action,
      shortcut: defaultKeys[action]
    });
  }

  return { keys, theChosenOne: 'Watch later' };
}

const handleShortcut = ( action: string ) => {
  console.log(' hitting shortcut functions')
  chrome.tabs.query({ url: 'https://www.youtube.com/*'} , function (tabs) {
    if ( !tabs.length ) {
      chrome.tabs.create({ url: 'https://www.youtube.com' });
    } 

    for ( let tab of tabs ) {
      if ( action === '_next_' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-next-button").click()' });
      } else if ( action === '_prev_' ) {
        chrome.tabs.executeScript(tab.id, { code: 'window.history.back()'});
      } else if ( action === '_togglePlay_' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-play-button").click()' } );
      } else if ( action === '_toggleMute_' ) {
        chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".ytp-mute-button").click()'});
      } else if ( action === '_toggleFocus_') {
        chrome.tabs.update(tab.id, { active: true });
      } else if ( action === '_toggleSave_' ) {
        let { theChosenOne } = JSON.parse(localStorage.ytp_settings);
        console.log('theChosenOne', theChosenOne)
        chrome.tabs.executeScript(tab.id, { code: `var theChosenOne = '${theChosenOne}'`}, function () {
          chrome.tabs.executeScript(tab.id, { file: `util/playlists.js` })
        });
      }
    }
  });
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
}


chrome.runtime.onInstalled.addListener( ({ reason }) => {
  console.log('onInstalled: reason, ', reason);

  if ( reason === 'install' ) {
    const settings = configureSettings();
    console.log('settings', settings);
    localStorage.ytp_settings = JSON.stringify(settings);
  }
  
  if ( reason === 'update' ) {
    const contentScripts = chrome.runtime.getManifest().content_scripts[0].js;
    reinjectContentScripts(contentScripts);
    console.log('onInstalled: update... contentscripts', contentScripts)
  }
});

chrome.runtime.onConnect.addListener((port) => {

  port.onMessage.addListener( ( payload ) => {
    if ( payload.action === 'grabKeys' ) {
      let settings = localStorage.ytp_settings;
      port.postMessage(JSON.parse(settings))
    }

    handleShortcut(payload.action)
  });
});