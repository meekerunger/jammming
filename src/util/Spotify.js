let accessToken = '';
const clientID ='b033ce30ca724b1383673c4985300b1c';
const redirectURI ="http://maujammming.surge.sh/";
const getAccessTokenURL = 'https://accounts.spotify.com/authorize?client_id='+ clientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURI;


let Spotify = {
  getAccessToken() {
    if (accessToken){
      return (accessToken);
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch){
      let accessToken = accessTokenMatch[1];
      let expirationTime = expiresInMatch[1];
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return (accessToken);

    } else {
        window.location= getAccessTokenURL
    }
  },
  search(term) {

        accessToken = Spotify.getAccessToken();

      if (accessToken) {

        const fetchURL = 'https://api.spotify.com/v1/search?type=track&q=' + term;
        const headerInfo = {headers: {Authorization: 'Bearer ' + accessToken}};

        return fetch(fetchURL, headerInfo)
          .then(
            response =>  {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Search request response failed!');
            }, networkError => console.log(networkError.message)
          ) /* end then */
          .then(
             jsonResponse => {
              if (!jsonResponse.tracks) {
                return [];
              } else {

                return jsonResponse.tracks.items.map(track => {
                  return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                  }
                });
              }
            }
          )
      }
      else {
        console.log('Failure to get access token in search');
      }
    },

  savePlaylist(playlistName, tracks) {
    const accessToken = Spotify.getAccessToken();
    const UIDheaderInfo = {headers: {Authorization: `Bearer ${accessToken}`}};
    let userID = '';
    const getUserIDURL = 'https://api.spotify.com/v1/me';
    const createPlaylistHeaderInfo = {headers: {Authorization: `Bearer ${accessToken}`}, method: 'POST', body: JSON.stringify({'name': playlistName})};


    fetch(getUserIDURL, UIDheaderInfo).then(
      response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('savePlaylist request response failed!');
      }, networkError => console.log(networkError.message)
    )
    .then(
      jsonResponse => {
        if (!jsonResponse.id) {
          return '';
        }else {
          userID = jsonResponse.id;
          const createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists?${JSON.stringify(playlistName)}`;
          fetch(createPlaylistURL, createPlaylistHeaderInfo)
          .then(
            response => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('savePlaylist request response failed!');
            }, networkError => console.log(networkError.message)
          ).then(
            jsonResponsePlaylist => {
              if (!jsonResponsePlaylist.id){
                return '';
              } else {
                const playlistID = jsonResponsePlaylist.id;
                const createPlaylistTracksURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
                const createPlaylistTracksHeaderInfo = {headers: {Authorization: `Bearer ${accessToken}`}, method: 'POST', body: JSON.stringify({'uris': tracks})};

                fetch(createPlaylistTracksURL, createPlaylistTracksHeaderInfo)
                            .then(
                              response => {
                                if (response.ok) {
                                  return response.json();
                                }
                                throw new Error('savePlaylist request response failed!');
                              },
                              jsonResonseSave => {
                                return jsonResponsePlaylist;
                              }
                              )}
              }

          )
            }

        }


    )


    if (!playlistName || !tracks) {
      return(false);
    }
  }
}

export default Spotify;
