import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

    constructor(
      private movieService: MovieService
    ) {
      this.movieService.getMoviesFromApi('/api/imdb/top250-movies').subscribe({
        next: (results)=>{
          console.log(`We called our API: ${JSON.stringify(results)}`);
          const movies = results;
        },
        error: (err)=>{
          console.log(`Display error on fetching movies ${JSON.stringify(err)}`)
        }
      });
    }

  ngOnInit() {
    this.favorites = this.movieService.getFavorites();
  }
}
