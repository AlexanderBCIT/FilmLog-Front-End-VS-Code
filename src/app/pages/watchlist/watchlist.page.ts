import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { IonContent, IonHeader, IonToolbar, IonTitle,
         IonList, IonItem, IonLabel, IonButton, IonSpinner,
         IonThumbnail, IonImg,
         ToastController } from '@ionic/angular/standalone';

//my watchlist page shows all the movies a user has added to their watchlist.
//uses movieservice to get the watchlist movies+move to watched+remove from watchlist.

@Component({
  selector: 'app-watchlist',
  templateUrl: 'watchlist.page.html',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar,
            IonTitle, IonList, IonItem, IonLabel, IonButton,
            IonThumbnail, IonImg, IonSpinner]
})
export class WatchlistPage implements OnInit {

  watchlistMovies: Movie[] = [];
  isLoading: boolean = false;

  constructor(
    private movieService: MovieService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadWatchlist();
  }

  ionViewWillEnter() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.isLoading = true;
    this.movieService.getWatchlist().subscribe({
      next: (data: Movie[]) => {
        this.watchlistMovies = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  async moveToWatched(movie: Movie) {
    this.movieService.markAsWatched(movie).subscribe({
      next: async () => {
        await this.showToast('Moved to Watched!');
        this.loadWatchlist();
      },
      error: async () => {
        await this.showToast('Already in Watched list.');
      }
    });
  }

  async removeMovie(title: string) {
    this.movieService.removeFromWatchlist(title).subscribe({
      next: async () => {
        await this.showToast('Removed from Watchlist.');
        this.loadWatchlist();
      },
      error: async () => {
        await this.showToast('Could not remove movie.');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  }
}