import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { IonContent, IonHeader, IonToolbar, IonTitle,
         IonList, IonItem, IonLabel, IonButton, IonSpinner,
         IonThumbnail, IonImg, IonBadge,
         ToastController } from '@ionic/angular/standalone';

//my watched page shows all the movies a user has marked as watched.
//uses movieservice to get the watcehd movies+increment watched count+ reset

@Component({
  selector: 'app-watched',
  templateUrl: 'watched.page.html',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar,
            IonTitle, IonList, IonItem, IonLabel, IonButton,
            IonThumbnail, IonImg, IonSpinner, IonBadge]
})
export class WatchedPage implements OnInit {

  watchedMovies: Movie[] = [];
  isLoading: boolean = false;

  constructor(
    private movieService: MovieService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadWatchedList();
  }

  ionViewWillEnter() {
    this.loadWatchedList();
  }

  loadWatchedList() {
    this.isLoading = true;
    this.movieService.getWatchedList().subscribe({
      next: (data: Movie[]) => {
        this.watchedMovies = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  async incrementWatched(movie: Movie) {
    this.movieService.incrementTimesWatched(movie.id!).subscribe({
      next: async () => {
        await this.showToast('Watch count updated!');
        this.loadWatchedList();
      }
    });
  }

  async resetWatched(movie: Movie) {
    this.movieService.resetTimesWatched(movie.id!).subscribe({
      next: async () => {
        await this.showToast('Watch count reset.');
        this.loadWatchedList();
      }
    });
  }

  async removeMovie(movie: Movie) {
    this.movieService.removeFromWatched(movie.id!).subscribe({
      next: async () => {
        await this.showToast('Removed from Watched list.');
        this.loadWatchedList();
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