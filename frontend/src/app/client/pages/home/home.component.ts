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
    title: "Know Us at a Glance",
    tagline: 'Celebrate7 is your one-stop destination for discovering events, festivals, and cultural experiences from the enchanting states of Northeast India, fondly known as the Seven Sisters. Each of these states is home to countless languages, traditions, and cultural identities that together form a rich and diverse tapestry.',
    // bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
    bg: `${environment.BASE_URL}/uploads/images/slider/bg.jpg`,
  },
  {
    id: 'f2',
    title: 'Our Mission',
    tagline: 'At Celebrate7, our mission is to bring people together to honour and embrace this incredible diversity. Whether you’re in the Northeast or living halfway across the world, our platform connects you to your roots and to others who share your heritage.',
    // bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
    bg: `${environment.BASE_URL}/uploads/images/slider/bg.jpg`,
  },
  {
    id: 'f3',
    title: 'Your Gateway to Northeast Cultural Events',
    tagline: 'Whether you’re organizing an event that celebrates any aspect of Northeast India’s culture or simply looking for one happening near you, Celebrate7 is here to help you discover, connect, and be part of the celebration.',
    // bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
    bg: `${environment.BASE_URL}/uploads/images/slider/bg.jpg`,
  },
  {
    id: 'f4',
    title: 'Uniting the Spirit of the Seven Sisters',
    tagline: 'By showcasing events and stories from every corner of the region, Celebrate7 strives to unite communities, preserve traditions, and celebrate the spirit of the Seven Sisters.',
    // bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
    bg: `${environment.BASE_URL}/uploads/images/slider/bg.jpg`,
  },
  // {
  //   id: 'f5',
  //   title: 'Celebrate7 - Christmas Fest',
  //   tagline: 'Join the celebration',
  //   bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
  //   // bg: `${environment.BASE_URL}/uploads/images/slider/Christmas.png`,
  // },
  // {
  //   id: 'f6',
  //   title: 'Celebrate7 - Eid Fest',
  //   tagline: 'Join the celebration',
  //   bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
  //   // bg: `${environment.BASE_URL}/uploads/images/slider/Eid.png`,
  // },
  // {
  //   id: 'f7',
  //   title: 'Celebrate7 - NorthEast Culture',
  //   tagline: 'Join the celebration',
  //   bg: `https://images.unsplash.com/photo-1542204165-3b0b5b1b1f4e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder`,
  //   // bg: `${environment.BASE_URL}/uploads/images/slider/Culture.png`,
  // },
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
