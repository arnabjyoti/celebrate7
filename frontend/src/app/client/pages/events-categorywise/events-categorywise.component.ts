import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeaturedItem, Event } from '../home/home.model';
import { EventsCategorywiseService } from './events-categorywise.service';
import { environment } from 'src/environments/environment';

const featuredItems = [
  {
    id: 'f1',
    title: 'Celebrate7 - Bihu of Assam',
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
  selector: 'app-events-categorywise',
  templateUrl: './events-categorywise.component.html',
  styleUrls: ['./events-categorywise.component.css'],
})
export class EventsCategorywiseComponent implements OnInit {
  featured: FeaturedItem[] = [];
  currentSlide = 0;
  carouselInterval: any;
  categoryName: any = '';
  env = environment.BASE_URL;
  subs = new Subscription();
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private eventsCategorywiseService: EventsCategorywiseService
  ) {}
  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName');
    this.startCarousel();
    this.getEventsByCategory();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
    this.subs.unsubscribe();
  }

  // ================== Carousel Code ======================
  startCarousel() {
    this.featured = featuredItems;
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

  events: any = [];
  getEventsByCategory() {
    this.spinner.show('SectionSpinner');
    let requestObject: any = {
      page: 1,
      limit: 100,
      categoryName: this.categoryName,
    };
    this.eventsCategorywiseService
      .getEventsByCategory(requestObject)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.structureEventObjects(response.data);
          } else {
            this.spinner.hide('SectionSpinner');
            this.toastr.error(response.message, 'Error Message');
          }
        },
        error: (err: any) => {
          this.spinner.hide('SectionSpinner');
          this.toastr.error(err, 'Error Message');
        },
      });
  }

  structureEventObjects(data: any) {
    this.events = [];
    if (data?.length > 0) {
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
    }
    this.spinner.hide('SectionSpinner');
  }
}
