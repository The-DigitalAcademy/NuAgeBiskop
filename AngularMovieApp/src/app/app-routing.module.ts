import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';

const routes: Routes = [
  { path: "", redirectTo:"watchlist", pathMatch:"full"},
  { path: 'search-results', component: SearchResultsComponent, pathMatch:"full" },
  { path: 'watchlist', component: WatchlistComponent, pathMatch:"full"},
  { path: 'movie-search', component: MovieSearchComponent, pathMatch:"full"},
  { path: 'favorites', component: FavoritesComponent, pathMatch:"full"},
  { path: 'MovieCard', component: MovieCardComponent, pathMatch:"full"},
  { path: 'MovieDetails', component: MovieDetailsComponent, pathMatch: "full"}


  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
