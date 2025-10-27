import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieSearchComponent,
    SearchResultsComponent,
    WatchlistComponent,
    FavoritesComponent,
    MovieCardComponent,
    HomepageComponent
    // ... other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Required for ngModel in search component
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
