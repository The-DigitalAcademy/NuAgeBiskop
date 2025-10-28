import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  // Input: Single movie to display
  @Input() movie!: Movie;
  movies: any = [];

  // Optional: If you want to show watchlist/favorite buttons
  @Input() showWatchlistButton: boolean = true;
  @Input() showFavoriteButton: boolean = true;

  // Output events for parent component
  @Output() favoriteToggled = new EventEmitter<Movie>();
  @Output() watchlistToggled = new EventEmitter<Movie>();

  constructor(
    private movieService: MovieService,
    private watchlistService: WatchlistService
  ) {
    this.movieService.getMoviesFromApi('/api/imdb/top250-movies').subscribe({
      next: (resp)=>{
        console.log(`We called our API: ${JSON.stringify(resp)}`);
        const movies = resp;
      },
      error: (err)=>{
        console.log(`Display error on fetching movies ${JSON.stringify(err)}`)
      }
    });
  }

  // Add movie to favorites
  addToFavorites(): void {
    this.movieService.addFavorite(this.movie);
    this.favoriteToggled.emit(this.movie);
  }

  // Remove from favorites
  removeFromFavorites(): void {
    this.movieService.removeFavorite(this.movie.id);
    this.favoriteToggled.emit(this.movie);
  }

  // Toggle favorite status
  toggleFavorite(): void {
    if (this.isFavorite()) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  }

  // Add to watchlist
  addToWatchlist(): void {
    this.watchlistService.addToWatchlist(this.movie);
    this.watchlistToggled.emit(this.movie);
  }

  // Remove from watchlist
  removeFromWatchlist(): void {
    this.watchlistService.removeFromWatchlist(this.movie.id);
    this.watchlistToggled.emit(this.movie);
  }

  // Toggle watchlist status
  toggleWatchlist(): void {
    if (this.isInWatchlist()) {
      this.removeFromWatchlist();
    } else {
      this.addToWatchlist();
    }
  }

  // Check if movie is in favorites
  isFavorite(): boolean {
    return this.movieService.isFavorite(this.movie.id);
  }

  // Check if movie is in watchlist
  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movie.id);
  }

  // Get placeholder image if no image available
  get movieImage(): string {
    return this.movie.imageUrl || 'assets/images/placeholder-movie.jpg';
  }
}
