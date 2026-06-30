import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { IonContent, IonHeader, IonToolbar, IonTitle,
         IonSearchbar, IonButton, IonCard, IonCardHeader,
         IonCardTitle, IonCardSubtitle, IonCardContent,
         IonImg, ToastController,
         LoadingController } from '@ionic/angular/standalone';

//my searchpage uses movieservice to handle all my http calls

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader,
            IonToolbar, IonTitle, IonSearchbar, IonButton,
            IonCard, IonCardHeader, IonCardTitle,
            IonCardSubtitle, IonCardContent, IonImg]
})
export class SearchPage {

  searchQuery: string = '';
  searchResults: Movie[] = [];
  selectedMovie: Movie | null = null;
  movieAdded: boolean = false;
  movieWatched: boolean = false;

  constructor(
    private movieService: MovieService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async searchMovie() {
    if (!this.searchQuery.trim()) {
      await this.showToast('Please enter a movie title.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Searching...'
    });
    await loading.present();

    this.movieService.searchMovie(this.searchQuery).subscribe({
      next: async (res: Movie[]) => {
        this.searchResults = res;
        this.selectedMovie = null;
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('No movies found. Try another title.');
      }
    });
  }

  async selectMovie(movie: Movie) {
    this.movieAdded = false;
    this.movieWatched = false;

    const loading = await this.loadingController.create({
      message: 'Loading details...'
    });
    await loading.present();

    this.movieService.getMovieDetails(movie.title).subscribe({
      next: async (res: Movie) => {
        this.selectedMovie = res;

        // Check if already in watchlist
        this.movieService.getWatchlist().subscribe((watchlist: Movie[]) => {
          this.movieAdded = watchlist.some(
            w => w.title === res.title
          );
        });

        // Check if already in watched list
        this.movieService.getWatchedList().subscribe((watched: Movie[]) => {
          this.movieWatched = watched.some(
            w => w.title === res.title
          );
        });

        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Could not load movie details.');
      }
    });
  }

  async addToWatchlist() {
    if (!this.selectedMovie) return;

    this.movieService.addToWatchlist(this.selectedMovie).subscribe({
      next: async () => {
        this.movieAdded = true;
        await this.showToast('Added to Watchlist!');
      },
      error: async () => {
        await this.showToast('Already in your Watchlist.');
      }
    });
  }

  async markAsWatched() {
    if (!this.selectedMovie) return;

    this.movieService.markAsWatched(this.selectedMovie).subscribe({
      next: async () => {
        this.movieWatched = true;
        this.movieAdded = false;
        await this.showToast('Marked as Watched!');
      },
      error: async () => {
        await this.showToast('Already in your Watched list.');
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