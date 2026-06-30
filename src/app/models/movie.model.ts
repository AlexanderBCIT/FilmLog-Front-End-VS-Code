export interface Movie {
  id?: number;
  title: string;
  year: string;
  poster: string;
  actors: string;
  genre: string;
  director: string;
  plot: string;
  imdbRating?: string;
  imdbID?: string;
  runtime?: string;
  timesWatched?: number;
  userId?: number;
}