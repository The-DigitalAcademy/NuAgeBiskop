import { Component, Input } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie: any;

  constructor(private movieService: MovieService) {}

  addToFavorites(movie: any) {
    this.movieService.addFavorite(movie);
  }
}
