import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { IonContent, IonHeader, IonToolbar,
         IonTitle, IonSpinner } from '@ionic/angular/standalone';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import Chart from 'chart.js/auto';

//my stats page shows some stats about a user's watched movies 
//uses movieservice to get the watched movies +builds a genre distribution pie chart+
//5 most watched movies bar chart.

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar,
            IonTitle, IonSpinner, MatTableModule,
            MatPaginatorModule, MatSortModule]
})
export class StatsPage implements OnInit, AfterViewInit {

  watchedMovies: Movie[] = [];
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<Movie>([]);
  tableColumns: string[] = ['title', 'genre', 'year', 'timesWatched'];

  private genreChart: any;
  private watchCountChart: any;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadStats();
  }

  ionViewWillEnter() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.movieService.getWatchedList().subscribe({
      next: (data: Movie[]) => {
        this.watchedMovies = data;
        this.dataSource.data = data;
        this.isLoading = false;
        setTimeout(() => {
          this.buildGenreChart();
          this.buildWatchCountChart();
        }, 300);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {}

  buildGenreChart() {
    const genreCount: { [key: string]: number } = {};

    this.watchedMovies.forEach((movie: Movie) => {
      const genres = movie.genre.split(',').map((g: string) => g.trim());
      genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const sorted = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const labels = sorted.map(([genre]) => genre);
    const values = sorted.map(([, count]) => count);

    if (this.genreChart) this.genreChart.destroy();

    this.genreChart = new Chart('genreChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#e94560', '#0f3460', '#533483',
            '#ea93a1cc', '#16213e', '#1a1a2e'
          ]
        }]
      }
    });
  }

  buildWatchCountChart() {
    const top5 = [...this.watchedMovies]
      .sort((a, b) => (b.timesWatched ?? 0) - (a.timesWatched ?? 0))
      .slice(0, 5);

    const labels = top5.map((m: Movie) => m.title);
    const values = top5.map((m: Movie) => m.timesWatched ?? 0);

    if (this.watchCountChart) this.watchCountChart.destroy();

    this.watchCountChart = new Chart('watchCountChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Times Watched',
          data: values,
          backgroundColor: '#e94560'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}