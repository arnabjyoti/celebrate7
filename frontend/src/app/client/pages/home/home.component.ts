import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedItem, Event } from './home.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const featuredItems = [
  {
    id: 'f1',
    title: 'A Sky of Stars',
    tagline: 'A modern space odyssey',
    bg: 'http://localhost:8600/uploads/images/1755407420031-360_F_517195733_OmTgPE2tN0uJjOMKxJRaaJRg2RL3CwG2.jpg',
  },
  {
    id: 'f2',
    title: 'Echoes of Earth',
    tagline: 'An emotional drama',
    bg: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder',
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
    this.subs.unsubscribe();
  }

  loadData(): void {
    this.featured = featuredItems;
    this.startCarousel();
    // this.subs.add(
    //   this.eventService.getFeatured().subscribe({
    //     next: f => { this.featured = f; this.startCarousel(); },
    //     error: (e) => console.error(e)
    //   })
    // );
    // this.subs.add(
    //   this.eventService.getEvents().subscribe({
    //     next: m => {
    //       this.events = m;
    //       this.genres = Array.from(new Set(m.map(x => x.genre)));
    //       this.applyFilters();
    //     },
    //     error: (e) => console.error(e)
    //   })
    // );
    this.fetchEvents();
  }

  // events:any = [];
  fetchEvents(): void {
    const reqBody = {
      limit: 13,
      page: 1,
    };

    this.http
      .post(`${environment.BASE_URL}/api/getAllEvents`, reqBody)
      .subscribe((res: any) => {
        let data: any = res.data || [];
        if (data?.length > 0) {
          this.structureEventObjects(data);
        }
      });
  }

  structureEventObjects(data: any) {
    this.events = [];
    data.map((item: any) => {
      console.log('event===', item);
      let obj: any = {
        id: item?.id,
        title: item?.eventName,
        genre: item?.type,
        rating: '7.9',
        runtime: item?.eventTime,
        city: item?.city,
        organizer: item?.organizer,
        poster: this.env + '/' +item?.images[0].path
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

  // --- booking modal
  openBooking(eventId: string) {
    this.selectedEvent =
      this.events.find((m) => m.id === eventId) ||
      (this.featured.find((f) => f.id === eventId) as any);
    if (!this.selectedEvent) return;
    this.dateOptions = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      this.dateOptions.push(d.toISOString().slice(0, 10));
    }
    this.selectedDate = this.dateOptions[0];
    this.qty = 1;
    this.bookingMsg = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmBooking() {
    if (!this.selectedEvent || !this.selectedDate) return;
    const payload = {
      eventId: this.selectedEvent.id,
      date: this.selectedDate,
      qty: this.qty,
    };
    // this.subs.add(
    //   this.eventService.createBooking(payload).subscribe({
    //     next: () => {
    //       this.bookingMsg = `Booking confirmed — ${this.qty} ticket(s) on ${this.selectedDate}`;
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       this.bookingMsg = 'Booking failed. Please try again.';
    //     },
    //   })
    // );
  }
}
