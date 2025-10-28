import { Component, Input } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie: any;
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {
    this.movieService.getMoviesFromApi("/titles").subscribe({
      next: ({results}) => {
        console.log(`We called our API: ${JSON.stringify(results)}`);
        this.movies = results;
      },
      error: (err) => {
        console.log(`Display error on fetching movies ${JSON.stringify(err)}`);
      }
    });
  }

  addToFavorites(movie: any) {
    this.movieService.addFavorite(movie);
  }
}
