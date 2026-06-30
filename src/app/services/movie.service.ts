import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../models/movie.model';

//handles all my http calls to my backend API related to movies, watchlist and watched list.
//searches movies by title, gets their dets, etc.

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = 'https://localhost:7195/api';

  constructor(private http: HttpClient) {}

  searchMovie(title: string) {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/search?t=${title}`);
  }

  getMovieDetails(title: string) {
    return this.http.get<Movie>(`${this.apiUrl}/movies/details?t=${title}`);
  }

  getWatchlist() {
    return this.http.get<Movie[]>(`${this.apiUrl}/watchlist`);
  }

  addToWatchlist(movie: Movie) {
    return this.http.post(`${this.apiUrl}/watchlist`, movie,
      { responseType: 'text' });
  }

  removeFromWatchlist(title: string) {
    return this.http.delete(`${this.apiUrl}/watchlist/${title}`,
      { responseType: 'text' });
  }

  getWatchedList() {
    return this.http.get<Movie[]>(`${this.apiUrl}/watched`);
  }

  markAsWatched(movie: Movie) {
    return this.http.post(`${this.apiUrl}/watched`, movie,
      { responseType: 'text' });
  }

  incrementTimesWatched(id: number) {
    return this.http.put(`${this.apiUrl}/watched/${id}`, {},
      { responseType: 'text' });
  }

  removeFromWatched(id: number) {
    return this.http.delete(`${this.apiUrl}/watched/${id}`,
      { responseType: 'text' });
  }

  resetTimesWatched(id: number) {
    return this.http.post(`${this.apiUrl}/watched/reset/${id}`, {},
      { responseType: 'text' });
  }
}