import { inject, Injectable } from '@angular/core';
import { ApiResponse, Movie, ApiMovie } from '../models/movie.model';
import { variables } from '../enviroments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  url = variables.BASE_URL;
  http = inject(HttpClient);

  // Store movies locally after fetching from API
  private moviesDataSubject = new BehaviorSubject<Movie[]>([]);
  moviesData$ = this.moviesDataSubject.asObservable();

  private favorites: Movie[] = [];

  constructor() {
    // Load initial movies when service is created
    // this.loadMovies();
  }

  // Method to get all movies from API
  getMoviesFromApi(path: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': 'f82d4f7d1bmshf15af14c40c2a81p1dc62bjsn7d61a5266885',
      'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    });
    const target_url = this.url + `${path}`;
    console.log(`${target_url}`);
    return this.http.get<ApiResponse>(target_url, { headers });
  }

  // Transform API movie to app Movie format
  private transformApiMovie(apiMovie: ApiMovie): Movie {
    return {
      id: apiMovie.id,
      title: apiMovie.titleText.text,
      year: apiMovie.releaseYear.year,
      imageUrl: apiMovie.primaryImage?.url || undefined,
      type: apiMovie.titleType.text,
      genre: 'Unknown', // API doesn't provide genre, you may need another endpoint
      rating: undefined // API doesn't provide rating in this data
    };
  }

  // Load movies from API
  loadMovies(path: string = '/titles'): void {
    this.getMoviesFromApi(path)
      .pipe(
        map(response => {
          // Transform API response to Movie array
          if (response.results) {
            return response.results.map(apiMovie => this.transformApiMovie(apiMovie));
          }
          return [];
        }),
        tap(movies => console.log('Loaded movies:', movies))
      )
      .subscribe(movies => {
        this.moviesDataSubject.next(movies);
      });
  }

  // Get all movies (returns Observable)
  getMovies(): Observable<Movie[]> {
    return this.moviesData$;
  }

  // Get current movies synchronously (for immediate access)
  getCurrentMovies(): Movie[] {
    return this.moviesDataSubject.value;
  }

  // Search movies by title or year
  searchMovies(query: string): Observable<Movie[]> {
    if (!query.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.moviesData$.pipe(
      map(movies => {
        const searchTerm = query.toLowerCase();
        return movies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.year.toString().includes(searchTerm) ||
          (movie.genre && movie.genre.toLowerCase().includes(searchTerm))
        );
      })
    );
  }

  // Get movies by genre
  getMoviesByGenre(genre: string): Observable<Movie[]> {
    return this.moviesData$.pipe(
      map(movies => {
        if (genre === 'all') return movies;
        return movies.filter(movie => movie.genre === genre);
      })
    );
  }

  // Get movie by ID
  getMovieById(id: string): Movie | undefined {
    return this.getCurrentMovies().find(movie => movie.id === id);
  }

  // Add movie to favorites
  addFavorite(movie: Movie): void {
    if (!this.favorites.find(fav => fav.id === movie.id)) {
      this.favorites.push(movie);
      console.log('Added to favorites:', movie);
    }
  }

  // Remove from favorites
  removeFavorite(movieId: string): void {
    this.favorites = this.favorites.filter(movie => movie.id !== movieId);
  }

  // Get favorite movies
  getFavorites(): Movie[] {
    return this.favorites;
  }

  // Check if movie is in favorites
  isFavorite(movieId: string): boolean {
    return this.favorites.some(movie => movie.id === movieId);
  }
}
