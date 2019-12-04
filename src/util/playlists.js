(() => {
  const PORT = chrome.runtime.connect({ name: `${chrome.runtime.id}-yt-pilot::port` });

  const getPlaylists = () => {
    _toggleGuideButton();
    _toggleShowMore();

    const playlists = [...document.getElementById("section-items").children, ...document.getElementById("expandable-items").children ];
    const viable = [];

    for ( let playlist of playlists ) {
      if ( playlist.localName === "ytd-guide-entry-renderer" && playlist.lastElementChild.pathname.includes('playlist') && playlist.lastElementChild.title !== 'Liked videos' ) {
        viable.push( playlist.lastElementChild.title );
      }
    }
    
    PORT.postMessage({ 'action': "getPlaylists", "playlists": viable.sort( (a, b) => { return a.localeCompare(b) }) });
  }

  const _toggleShowMore = () => {
    document.getElementById('expander-item').click();
    return;
  }

  const _toggleGuideButton = () => {
    if ( document.getElementById("contentContainer").getAttribute('opened') === null ) {
      document.getElementById('guide-button').click();
    }
    return;
  }

  getPlaylists();
})();