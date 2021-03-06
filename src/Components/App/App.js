import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
          searchResults: [],
          playlistName: 'My Playlist',
          playlistTracks: [],
          trackURIs: []
        };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search= this.search.bind(this);
    }
  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }this.setState({playlistTracks: this.state.playlistTracks.concat(track)});

    }
  removeTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(rmtrack => rmtrack.id !== track.id)})
    }
  }
  savePlaylist(){
    this.state.playlistTracks.map(track => this.state.trackURIs.push(track.uri));
    Spotify.savePlaylist(this.state.playlistName, this.state.trackURIs)
      }
  search(searchTerm) {
    Spotify.search(searchTerm)
      .then(results => this.setState({ searchResults: results}))

  }


  updatePlaylistName(name){
    this.setState({playlistName: name})
  }


  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
      <SearchBar onSearch={this.search}/>
    <div className="App-playlist">
      <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
      <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
    </div>
  </div>
</div>
    );
  }
}

export default App;
