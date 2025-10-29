import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  movie: any = {
      "id": "tt0111161",
      "url": "https://www.imdb.com/title/tt0111161/",
      "primaryTitle": "The Shawshank Redemption",
      "originalTitle": "The Shawshank Redemption",
      "type": "movie",
      "description": "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
      "primaryImage": "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@.jpg",
      "thumbnails": [
        {
          "url": "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX100_CR0,0,100,148_.jpg",
          "width": 100,
          "height": 148
        },
        {
          "url": "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX280_CR0,0,280,414_.jpg",
          "width": 280,
          "height": 414
        },
        {
          "url": "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
          "width": 380,
          "height": 562
        }
      ],
      "trailer": "https://www.youtube.com/watch?v=xyXX8LXiNJ4",
      "contentRating": "R",
      "startYear": 1994,
      "endYear": null,
      "releaseDate": "1994-10-14",
      "interests": ["Epic", "Period Drama", "Prison Drama", "Drama"],
      "countriesOfOrigin": ["US"],
      "externalLinks": ["https://www.facebook.com/shawshankredemptionfilm/", "https://www.warnerbros.com/movies/shawshank-redemption"],
      "spokenLanguages": ["en"],
      "filmingLocations": ["Mansfield Reformatory - 100 Reformatory Road, Mansfield, Ohio, USA"],
      "productionCompanies": [
        {
          "id": "co0040620",
          "name": "Castle Rock Entertainment"
        }
      ],
      "budget": 25000000,
      "grossWorldwide": 29334033,
      "genres": ["Drama"],
      "isAdult": false,
      "runtimeMinutes": 142,
      "averageRating": 9.3,
      "numVotes": 3113579,
      "metascore": 82
    }

  isFavorite = false;
  showReviews = false;
  showReviewForm = false;
  showLoginModal = false;
  isUserLoggedIn = false; // set true if testing login
  // newReview = { rating: 0, text: '' };
  movieDetails: Actor[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {
    this.movieService.getMovieActorsByMovieId("tt0111161").subscribe({
        next: (resp) => {
          console.log(`Hopefully we have the movie details here ${JSON.stringify(resp)}`);
          this.movieDetails = resp;
        },
        error: (err) => {
          console.log(`error getting movie details here ${JSON.stringify(err)}`);
        }
      })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('movie_id') ?? '';

    const movieObj = this.movieService.getMovieById(id);
    if(movieObj) {
      this.movie = movieObj;
      this.movieService.getMovieActorsByMovieId("tt0111161").subscribe({
        next: (resp) => {
          console.log(`Hopefully we have the movie details here ${JSON.stringify(resp)}`);
          this.movieDetails = resp;
        },
        error: (err) => {
          console.log(`error getting movie details here ${JSON.stringify(err)}`);
        }
      })
    }

    // Try to get cached movie
    // const cachedMovie = this.movieService.getMovieById(id);
    // if (cachedMovie) {
    //   this.movie = cachedMovie;
    //   this.isFavorite = this.movieService.isFavorite(this.movie.id);
    // } else {
    //   // Fetch movie from API
    //   this.movieService.getMoviesFromApi(`/titles/${id}`).subscribe({
    //     next: (response) => {
    //       if (response.data && response.data.length > 0) {
    //         const apiMovie = response.data[0];
    //         // this.movie = this.movieService['transformApiMovie'](apiMovie);
    //         this.isFavorite = this.movieService.isFavorite(this.movie.id);
    //       } else {
    //         console.error('Movie not found in API:', id);
    //       }
    //     },
    //     error: (err) => console.error('Error fetching movie from API:', err)
    //   });
    // }
  }

  /** Watch button */
  watchNow(): void {
    alert(`🎬 Playing ${this.movie.primaryTitle}...`);
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
    // if (!this.newReview.text.trim() || this.newReview.rating < 1) {
    //   alert('Please enter a valid rating and review text.');
    //   return;
    // }
    // alert('✅ Review submitted! (Currently local placeholder)');
    // this.newReview = { rating: 0, text: '' };
    // this.showReviewForm = false;
  }
}
