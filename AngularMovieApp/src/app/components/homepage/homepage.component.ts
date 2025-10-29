import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie.service';
import { SearchService } from 'src/app/services/search.service'; // <-- NEW

export interface HeroSlide {
  image: string;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: false
})
export class HomepageComponent implements OnInit, OnDestroy {
  // --- MOVIE LIST & PAGINATION PROPERTIES ---
  fullMovieList: Movie[] = []; // Stores all movies after fetching and sorting
  filteredMovieList: Movie[] = []; // Stores movies after search filter is applied
  displayMovies: Movie[] = []; // Stores the 20 movies for the current view
  
  moviesPerPage: number = 20;
  currentPage: number = 1;

  // --- SEARCH PROPERTY ---
  searchQuery: string = ''; // <-- NEW: Stores the current search input value

  // Slideshow properties
  heroSlides: HeroSlide[] = [
    {
      image: 'https://static0.colliderimages.com/wordpress/wp-content/uploads/2022/04/The-Shawshank-Redemption.jpg?q=49&fit=crop&w=825&dpr=2',
      title: 'The Shawshack Reddemption',
      description: 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.'
    },
    {
      image: 'https://mshanken.imgix.net/cao/bolt/2022-03/1647463313_godfather0422.jpg',
      title: 'The Godfather',
      description: 'The aging patriarch of an organized crime dynasty transfers control of its clandestine empire to his reluctant son.'
    },
    {
      image: 'https://media.gq.com/photos/5b4dfa2c9eea1c27bfdb9e9b/1:1/w_1295,h_1295,c_limit/10-year-anniversary-the-dark-knight-gq.jpg',
      title: 'The Dark Knight',
      description: 'When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.'
    }
  ];

  currentSlideIndex = 0;
  private slideInterval: any;

  // Sidebar properties
  isSidebarActive = false;
  hideHero = true;

  constructor(
    private router: Router, 
    private movieService : MovieService,
    private searchService: SearchService // <-- NEW: Inject SearchService
  ) {}

  ngOnInit() {
    this.startAutoSlide();
    this.fetchAndProcessMovies(); 
    // Subscribe to search query changes if search results are managed globally
    this.searchService.currentQuery$.subscribe(query => {
        this.searchQuery = query;
        if (query) {
            this.performLocalSearch(query);
        } else if (this.fullMovieList.length > 0) {
            // Reset to full list if query is cleared
            this.filteredMovieList = this.fullMovieList;
            this.resetAndPaginate();
        }
    });
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // --- CORE DATA HANDLING & SORTING ---

  fetchAndProcessMovies() {
    this.movieService.getMoviesFromApi("/api/imdb/top250-movies").subscribe({
      next: (resp) => {
        let moviesData: Movie[] = [];

        // Safely extract the movie array from response
        if (resp && Array.isArray(resp)) {
          moviesData = resp;
        } 
        else if (resp && resp.data && Array.isArray(resp.data)) {
          moviesData = resp.data;
        } 
        else {
          console.warn('Unexpected response format or no data received:', resp);
        }

        if (moviesData.length > 0) {
          // 1. Sort the full list
          this.fullMovieList = this.sortMoviesByLatest(moviesData);
          // 2. Set the filtered list to the full list initially
          this.filteredMovieList = this.fullMovieList;
          // 3. Display the first page
          this.resetAndPaginate();
        }
      },
      error: (err) => {
        console.error(`Error getting Movies: ${JSON.stringify(err)}`);
        this.fullMovieList = [];
        this.filteredMovieList = [];
        this.displayMovies = [];
      }
    });
  }

  private sortMoviesByLatest(movies: Movie[]): Movie[] {
    return movies.slice().sort((a, b) => {
      const yearA = a.startYear ? parseInt(a.startYear.toString()) : 0;
      const yearB = b.startYear ? parseInt(b.startYear.toString()) : 0;
      if (yearB !== yearA) {
        return yearB - yearA; 
      }
      return (a.primaryTitle || '').localeCompare(b.primaryTitle || '');
    });
  }

  // --- SEARCH METHODS ---

  /**
   * Triggers the search logic when the button is clicked.
   */
  onSearch() {
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      // Update global search state
      this.searchService.updateCurrentQuery(query);
      this.performLocalSearch(query);
    } else {
      this.clearSearch();
    }
  }

  /**
   * Allows searching via the Enter key press.
   */
  onKeyPress(event: KeyboardEvent) {
    this.onSearch();
  }

  /**
   * Filters the full movie list and updates the display.
   */
  performLocalSearch(query: string) {
    if (query) {
      this.hideHero = false;
      // Use the logic from movie.service.ts's search method
      this.filteredMovieList = this.fullMovieList.filter(movie =>
        movie.primaryTitle.toLowerCase().includes(query) ||
        (movie.startYear && movie.startYear.toString().includes(query)) ||
        (movie.genres && movie.genres.join(', ').toLowerCase().includes(query))
      );
    } else {
      // If query is empty, show the full list
      this.filteredMovieList = this.fullMovieList;
    }
    this.resetAndPaginate();
  }

  /**
   * Clears the search input and resets the movie list.
   */
  clearSearch() {
    this.hideHero = true;
    this.searchQuery = '';
    this.searchService.clearSearch(); // Clears global state
    this.filteredMovieList = this.fullMovieList;
    this.resetAndPaginate();
  }

  // --- PAGINATION METHODS (UPDATED TO USE filteredMovieList) ---

  private resetAndPaginate(): void {
    this.currentPage = 1;
    this.updateDisplayMovies();
  }

  updateDisplayMovies(): void {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    // Slice from the filtered list (which might be the full list or search results)
    this.displayMovies = this.filteredMovieList.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.currentPage++;
      this.updateDisplayMovies();
      document.getElementById('movieGrid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.currentPage--;
      this.updateDisplayMovies();
      document.getElementById('movieGrid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  canGoNext(): boolean {
    const lastMovieIndexOnCurrentPage = this.currentPage * this.moviesPerPage;
    // Check against the filtered list length
    return lastMovieIndexOnCurrentPage < this.filteredMovieList.length;
  }
  
  canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get totalPages(): number {
    if (this.filteredMovieList.length === 0) return 0;
    // Calculate pages based on the filtered list length
    return Math.ceil(this.filteredMovieList.length / this.moviesPerPage);
  }

  // --- SLIDESHOW & SIDEBAR METHODS (Unchanged) ---
  
  startAutoSlide() { /* ... unchanged ... */ }
  nextSlide() { /* ... unchanged ... */ }
  previousSlide() { /* ... unchanged ... */ }
  goToSlide(index: number) { /* ... unchanged ... */ }
  toggleSidebar() { /* ... unchanged ... */ }
  closeSidebar() { /* ... unchanged ... */ }
  navigateTo(route: string) { /* ... unchanged ... */ }
}