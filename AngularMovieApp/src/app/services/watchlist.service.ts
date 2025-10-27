import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  // BehaviorSubject to track watchlist state reactively
  private watchlistSubject = new BehaviorSubject<Movie[]>(this.getStoredWatchlist());

  constructor() { }

  // Get watchlist as observable for components to subscribe to
  getWatchlist(): Observable<Movie[]> {
    return this.watchlistSubject.asObservable();
  }

  // Add movie to watchlist
  addToWatchlist(movie: Movie): void {
    const currentWatchlist = this.watchlistSubject.value;
    // Check if movie already exists in watchlist
    if (!currentWatchlist.some(m => m.id === movie.id)) {
      const updatedWatchlist = [...currentWatchlist, movie];
      this.updateWatchlist(updatedWatchlist);
    }
  }

  // Remove movie from watchlist
  removeFromWatchlist(movieId: number): void {
    const currentWatchlist = this.watchlistSubject.value;
    const updatedWatchlist = currentWatchlist.filter(movie => movie.id !== movieId);
    this.updateWatchlist(updatedWatchlist);
  }

  // Check if movie is in watchlist
  isInWatchlist(movieId: number): boolean {
    return this.watchlistSubject.value.some(movie => movie.id === movieId);
  }

  // Clear entire watchlist
  clearWatchlist(): void {
    this.updateWatchlist([]);
  }

  // Get watchlist count
  getWatchlistCount(): number {
    return this.watchlistSubject.value.length;
  }

  // Private method to update watchlist and persist to localStorage
  private updateWatchlist(watchlist: Movie[]): void {
    this.watchlistSubject.next(watchlist);
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }

  // Private method to get watchlist from localStorage
  private getStoredWatchlist(): Movie[] {
    const stored = localStorage.getItem('movieWatchlist');
    return stored ? JSON.parse(stored) : [];
  }
}
