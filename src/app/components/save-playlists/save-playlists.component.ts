import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-save-playlists',
  templateUrl: './save-playlists.component.html',
})
export class SavePlaylistsComponent implements OnInit {
  playlists: any[] = [];
  selectedPlaylistId: string = '';
  genreNames: string = '';
  message: string = '';

  constructor(private playlistService: PlaylistService, private firestore: Firestore) { }

  ngOnInit(): void {
    this.fetchPlaylists();
  }

  fetchPlaylists() {
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  async savePlaylist() {
    if (this.selectedPlaylistId && this.genreNames.trim()) {
      try {
        const playlistsRef = collection(this.firestore, 'playlists');
        const q = query(playlistsRef, where('playlist_id', '==', this.selectedPlaylistId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          this.message = 'This playlist has already been added!';
          return;
        }

        const genreNamesArray = this.genreNames.split(',').map(genre => genre.trim());

        await addDoc(collection(this.firestore, 'playlists'), {
          genre_names: genreNamesArray,
          playlist_id: this.selectedPlaylistId
        });

        this.message = 'Playlist added successfully!';
        this.genreNames = '';
      } catch (error) {
        console.error('Error adding playlist: ', error);
        this.message = 'Error adding playlist.';
      }
    } else {
      this.message = 'Please select a playlist and provide genre names.';
    }
  }
}
