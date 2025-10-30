import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturedItem, Event } from './home.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from './home.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const featuredItems = [
  {
    id: 'f1',
    title: "Celebrate7 - Bihu of Assam",
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Bihu.png`,
  },
  {
    id: 'f2',
    title: 'Celebrate7 - Durga Puja Vibe',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/DurgaPuja.png`,
  },
  {
    id: 'f3',
    title: 'Celebrate7 -  The Sky of Stars',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Singers.png`,
  },
  {
    id: 'f4',
    title: 'Celebrate7 - Echoes of Earth',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Tourism.png`,
  },
  {
    id: 'f5',
    title: 'Celebrate7 - Christmas Fest',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Christmas.png`,
  },
  {
    id: 'f6',
    title: 'Celebrate7 - Eid Fest',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Eid.png`,
  },
  {
    id: 'f7',
    title: 'Celebrate7 - NorthEast Culture',
    tagline: 'Join the celebration',
    bg: `${environment.BASE_URL}/uploads/images/slider/Culture.png`,
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

  // carousel state
  currentSlide = 0;
  carouselInterval: any;

  subs = new Subscription();
  env = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
    this.subs.unsubscribe();
  }

  categories: string[] = [];
  loadData(): void {
    this.spinner.show('nowShowingSectionSpinner');
    this.featured = featuredItems;
    this.startCarousel();
    this.fetchEvents();
  }

  // ================== Carousel Code ======================
  startCarousel() {
    clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(() => this.nextSlide(), 9000);
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

  // ================== Carousel Code End ======================

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

    this.categories = Array.from(new Set(this.events.map((c: any) => c.genre)));
    console.log("Cat==", this.categories);
    this.groupByCategory();
  }
  
  groupedChannels: Record<string, Event[]> = {};
  groupByCategory() {
    this.groupedChannels = this.categories.reduce((acc, cat) => {
      acc[cat] = this.events.filter((c) => c.genre === cat);
      return acc;
    }, {} as Record<string, Event[]>);
    this.spinner.hide('nowShowingSectionSpinner');
  }

  scrollLeft(cat: string, index:any) {    
    const container = document.querySelector(`#slider${index}`) as HTMLElement;
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(cat: string, index:any) {
    const container = document.querySelector(`#slider${index}`) as HTMLElement;
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
