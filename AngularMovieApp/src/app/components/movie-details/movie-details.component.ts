import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  movie!: Movie ;
  isFavorite = false;
  showReviews = false;
  showReviewForm = false;
  showLoginModal = false;
  isUserLoggedIn = false; // set true if testing login
  newReview = { rating: 0, text: '' };

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    // Try to get cached movie
    const cachedMovie = this.movieService.getMovieById(id);
    if (cachedMovie) {
      this.movie = cachedMovie;
      this.isFavorite = this.movieService.isFavorite(this.movie.id);
    } else {
      // Fetch movie from API
      this.movieService.getMoviesFromApi(`/titles/${id}`).subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            const apiMovie = response.data[0];
            this.movie = this.movieService['transformApiMovie'](apiMovie);
            this.isFavorite = this.movieService.isFavorite(this.movie.id);
          } else {
            console.error('Movie not found in API:', id);
          }
        },
        error: (err) => console.error('Error fetching movie from API:', err)
      });
    }
  }

  /** Watch button */
  watchNow(): void {
    alert(`🎬 Playing ${this.movie.title}...`);
  }

  /** Toggle favorites */
  toggleFavorite(): void {
    if (!this.isFavorite) {
      this.movieService.addFavorite(this.movie);
    } else {
      this.movieService.removeFavorite(this.movie.id);
    }
    this.isFavorite = !this.isFavorite;
  }

  /** Show/hide reviews */
  toggleReviews(): void {
    this.showReviews = !this.showReviews;
  }

  /** Open review form or login modal */
  openReviewForm(): void {
    if (this.isUserLoggedIn) {
      this.showReviewForm = true;
    } else {
      this.showLoginModal = true;
    }
  }

  /** Close login modal */
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  /** Submit new review (placeholder) */
  submitReview(): void {
    if (!this.newReview.text.trim() || this.newReview.rating < 1) {
      alert('Please enter a valid rating and review text.');
      return;
    }
    alert('✅ Review submitted! (Currently local placeholder)');
    this.newReview = { rating: 0, text: '' };
    this.showReviewForm = false;
  }
}
