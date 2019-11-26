// Youtube needs 3 clicks to add a video to a playlist;
// 1) In order to access the playlists, you must access on the overlay first thru save button.
// 2) Once overlap is visible, filter for a specific playlist ( defaults to 'Watch later' ), add video to playlist.
// 3) Hide overlay.

(() => {
  const _toggleSaveToPlaylist = () => {
    _togglePlaylistOverlay();

    setTimeout(() => {
      const playlists = document.getElementById('playlists').children;
      
      for ( let playlist of playlists ) {
        let playlistName = playlist.children[0].innerText;
        lists.push(playlistName);
        playlistName === theChosenOne ?  playlist.children[0].click() : null;
      }

      _togglePlaylistOverlay();
    }, 500);
  };

  const _togglePlaylistOverlay = () => {
    const topLevelBtns = document.getElementsByClassName('style-scope ytd-menu-renderer force-icon-button style-default size-default');

    for ( const btn of topLevelBtns ) {
      btn.children[0].innerText === 'SAVE' ? btn.click() : null;
    }
  }

  _toggleSaveToPlaylist();
})();

