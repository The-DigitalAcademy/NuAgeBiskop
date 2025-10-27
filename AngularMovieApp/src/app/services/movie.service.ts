import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // Sample movie data - in real app, this would come from an API
  private moviesData: Movie[] = [
    { id: 1, title: "The Dark Knight", year: 2008, rating: 9.0, genre: "Action" },
    { id: 2, title: "Inception", year: 2010, rating: 8.8, genre: "Sci-Fi" },
    { id: 3, title: "Interstellar", year: 2014, rating: 8.6, genre: "Sci-Fi" },
    { id: 4, title: "The Matrix", year: 1999, rating: 8.7, genre: "Sci-Fi" },
    { id: 5, title: "Pulp Fiction", year: 1994, rating: 8.9, genre: "Crime" },
    { id: 6, title: "Fight Club", year: 1999, rating: 8.8, genre: "Drama" },
    { id: 7, title: "Forrest Gump", year: 1994, rating: 8.8, genre: "Drama" },
    { id: 8, title: "The Godfather", year: 1972, rating: 9.2, genre: "Crime" },
    { id: 9, title: "The Shawshank Redemption", year: 1994, rating: 9.3, genre: "Drama" },
    { id: 10, title: "Goodfellas", year: 1990, rating: 8.7, genre: "Crime" },
    { id: 11, title: "The Silence of the Lambs", year: 1991, rating: 8.6, genre: "Thriller" },
    { id: 12, title: "Saving Private Ryan", year: 1998, rating: 8.6, genre: "War" },
    { id: 13, title: "Gladiator", year: 2000, rating: 8.5, genre: "Action" },
    { id: 14, title: "The Green Mile", year: 1999, rating: 8.6, genre: "Drama" },
    { id: 15, title: "Schindler's List", year: 1993, rating: 9.0, genre: "Drama" },
    { id: 16, title: "The Departed", year: 2006, rating: 8.5, genre: "Crime" },
    { id: 17, title: "The Prestige", year: 2006, rating: 8.5, genre: "Thriller" },
    { id: 18, title: "Memento", year: 2000, rating: 8.4, genre: "Thriller" },
    { id: 19, title: "The Lion King", year: 1994, rating: 8.5, genre: "Animation" },
    { id: 20, title: "Toy Story", year: 1995, rating: 8.3, genre: "Animation" }
  ];

  // Favorites array
  private favorites: Movie[] = [];

  constructor() { }

  // Get all movies
  getMovies(): Movie[] {
    return this.moviesData;
  }

  // Search movies by title, year, or genre
  searchMovies(query: string): Movie[] {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return this.moviesData.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.year.toString().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm)
    );
  }

  // Get movies by genre
  getMoviesByGenre(genre: string): Movie[] {
    if (genre === 'all') return this.moviesData;
    return this.moviesData.filter(movie => movie.genre === genre);
  }

  // Get movie by ID
  getMovieById(id: number): Movie | undefined {
    return this.moviesData.find(movie => movie.id === id);
  }

  // Add movie to favorites
  addFavorite(movie: Movie): void {
    this.favorites.push(movie);
    console.log('Added to favorites:', movie);
  }

  // Get favorite movies
  getFavorites(): Movie[] {
    return this.favorites;
  }
}
