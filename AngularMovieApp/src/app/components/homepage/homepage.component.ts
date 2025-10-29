import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Slideshow methods
  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  previousSlide() {
    this.currentSlideIndex = this.currentSlideIndex === 0 
      ? this.heroSlides.length - 1 
      : this.currentSlideIndex - 1;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  // Sidebar methods
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  closeSidebar() {
    this.isSidebarActive = false;
  }

  // Navigation methods
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeSidebar();
  }
}