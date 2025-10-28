import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedItem, Event } from '../home/home.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LandingScreenService } from './landing-screen.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const featuredItems = [
  {
    id: 'f1',
    title: 'Hornbill Festival',
    tagline: 'A modern space odyssey',
    bg: 'http://localhost:8600/uploads/images/slider/bannerImage1.png',
  },
  {
    id: 'f2',
    title: 'A Sky of Stars',
    tagline: 'A modern space odyssey',
    bg: 'http://localhost:8600/uploads/images/1755407420031-360_F_517195733_OmTgPE2tN0uJjOMKxJRaaJRg2RL3CwG2.jpg',
  },
  {
    id: 'f3',
    title: 'Echoes of Earth',
    tagline: 'An emotional drama',
    bg: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
  },
];


@Component({
  selector: 'app-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.css']
})

export class LandingScreenComponent implements OnInit, OnDestroy {
  featured: FeaturedItem[] = [];
  events: Event[] = [];
  filtered: Event[] = [];
  genres: string[] = [];
  activeGenre: string | null = null;
  searchQuery = '';

  // carousel state
  currentSlide = 0;
  carouselInterval: any;

  subs = new Subscription();

  // modal state
  showModal = false;
  selectedEvent?: Event;
  dateOptions: string[] = [];
  selectedDate?: string;
  qty = 1;
  bookingMsg = '';
  env = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
    this.subs.unsubscribe();
  }

  channels: Event[] = [];
  categories: string[] = [];
  loadData(): void {
    this.spinner.show('nowShowingSectionSpinner');
    this.featured = featuredItems;
    this.startCarousel();
    this.fetchEvents();
    // New code
  }
  
  // events:any = [];
  fetchEvents(): void {
    const reqBody = {
      requestType: 'Public',
      limit: 15,
      page: 1,
    };

    this.http
      .post(`${environment.BASE_URL}/api/getAllEvents`, reqBody)
      .subscribe((res: any) => {
        let data: any = res.data || [];
        if (data?.length > 0) {
          this.structureEventObjects(data);
        } else {
          this.spinner.hide('nowShowingSectionSpinner');
        }
      });
  }

  structureEventObjects(data: any) {
    this.events = [];
    data.map((item: any) => {
      let obj: any = {
        id: item?.id,
        title: item?.eventName,
        genre: item?.categoryDetails?.categoryName,
        rating: '7.9',
        runtime: item?.eventTime,
        city: item?.city,
        organizer: item?.organizerDetails?.organizer_name,
        poster: this.env + '/' + item?.images[0].path,
      };
      this.events.push(obj);
    });
    this.genres = Array.from(new Set(this.events.map((x) => x.genre)));
    this.applyFilters();
  }
  // --- filtering/search
  setGenre(g: string | null) {
    this.activeGenre = g;
    this.applyFilters();
  }

  applyFilters() {
    const q = (this.searchQuery || '').trim().toLowerCase();
    this.filtered = this.events.filter((m) => {
      if (this.activeGenre && m.genre !== this.activeGenre) return false;
      if (
        q &&
        !(
          m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
    this.spinner.hide('nowShowingSectionSpinner');
  }

  onSearchEnter() {
    this.applyFilters();
  }

  resetFilters() {
    this.activeGenre = null;
    this.searchQuery = '';
    this.applyFilters();
  }

  // --- carousel
  startCarousel() {
    clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(() => this.nextSlide(), 6000);
  }

  nextSlide() {
    this.currentSlide =
      (this.currentSlide + 1) % Math.max(1, this.featured.length);
  }
  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.featured.length) %
      Math.max(1, this.featured.length);
  }
}
