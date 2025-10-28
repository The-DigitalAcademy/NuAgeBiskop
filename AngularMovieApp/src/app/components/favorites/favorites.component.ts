import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.favorites = this.movieService.getFavorites();
    console.log(`Display my favourite movies \n`);
    console.log(`${this.favorites}`);
  }
}