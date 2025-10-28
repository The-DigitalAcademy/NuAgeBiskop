import { inject, Injectable } from '@angular/core';
import { ApiResponse, Movie } from '../models/movie.model';
import { variables } from '../enviroments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // our base url
  url = variables.BASE_URL;

  // inject http service for network request
  http = inject(HttpClient);

  // first method to get all movies /movies data
  getMoviesFromApi(path: string) : Observable<ApiResponse> {
    // https://moviesdatabase.p.rapidapi.com/path
    const headers = new HttpHeaders({
    'x-rapidapi-key': 'f82d4f7d1bmshf15af14c40c2a81p1dc62bjsn7d61a5266885',
    'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
  });
  const target_url = this.url + `${path}`;
  console.log(`${target_url}`);
    return this.http.get<ApiResponse>(target_url, {headers});
  }
  
  // Sample movie data - in real app, this would come from an API
  private moviesData: Movie[] = [];

  // Favorites array
  private favorites: Movie[] = [];

  constructor() { }

  // Get all movies
  getMovies(): Movie[] {
    return this.moviesData;
  }

  // Search movies by title, year, or genre
  searchMovies(query: string): Movie[] {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return this.moviesData.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.year.toString().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm)
    );
  }

  // Get movies by genre
  getMoviesByGenre(genre: string): Movie[] {
    if (genre === 'all') return this.moviesData;
    return this.moviesData.filter(movie => movie.genre === genre);
  }

  // Get movie by ID
  getMovieById(id: string): Movie | undefined {
    return this.moviesData.find(movie => movie.id === id);
  }

  // Add movie to favorites
  addFavorite(movie: Movie): void {
    this.favorites.push(movie);
    console.log('Added to favorites:', movie);
  }

  // Get favorite movies
  getFavorites(): Movie[] {
    return this.favorites;
  }
}
