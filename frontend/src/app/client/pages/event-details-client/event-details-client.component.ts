import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-event-details-client',
  templateUrl: './event-details-client.component.html',
  styleUrls: ['./event-details-client.component.css'],
})
export class EventDetailsClientComponent implements OnInit, OnChanges {
  mapUrl!: SafeResourceUrl;
  mapsLink: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  event: any = {
    eventName: '',
    organizer: '',
    type: '',
    eventDate: '',
    eventTime: '',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    // description: '',
    status: 'draft',

    location: { name: 'Venue', address: 'Address', lat: 0, lng: 0 },
    pricing: [{ name: 'Standard', price: 1000 }],
    description: '<p>Event description here</p>',
    schedule: [{ time: '18:00', activity: 'Start' }],

    nearby: ['Cafe', 'Parking'],
    attributes: { Capacity: '200' },
  };

  lightboxOpen = false;
  lightboxIndex = 0;
  selectedTier: any = null;
  quantity = 1;
  wishlisted = false;

  // *******************************************************
  content: string = '';
  selectedFiles: any[] = [];
  url = environment.BASE_URL;

  ticket_details: any = [];
  organizer: any = {};
  category: any = {};

  // ngOnInit() {
  //   this.selectedTier = this.event.pricing?.[0] ?? null;
  // }
  eventId: any;
  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID:', this.eventId);
   

    this.getEventDetails(this.eventId);

    this.updateMap();
  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes['event']) {
      this.updateMap();
    }
  }

  private getLatLng(): { lat: number | null; lng: number | null } {
    // Accept either event.lat/event.lng or event.location.lat/location.lng
    const lat = this.event?.lat ?? this.event?.location?.lat ?? null;
    const lng = this.event?.lng ?? this.event?.location?.lng ?? null;
    return { lat, lng };
  }

  updateMap() {
    const { lat, lng } = this.getLatLng();
    console.log('lat lng ', lat, lng);
    

    if (!lat || !lng) {
      // fallback: center on a default location (optional)
      // set a safe blank map (or hide the iframe in template if you prefer)
      const defaultUrl = 'https://www.google.com/maps?output=embed&q=India';
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(defaultUrl);
      this.mapsLink = 'https://www.google.com/maps';
      return;
    }

    // Embed URL — no API key required
    const embed = `https://www.google.com/maps?q=${encodeURIComponent(lat + ',' + lng)}&z=15&output=embed`;
    const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + ',' + lng)}`;

    // Bypass Angular security for the iframe src
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    this.mapsLink = link;
  }

  openLightbox(i: number) {
    console.log('openLightbox', i);
    
    this.lightboxIndex = i;
    this.lightboxOpen = true;
  }

  setLightboxIndex(i: number) {
    this.lightboxIndex = i;
  }
  closeLightbox() {
    this.lightboxOpen = false;
  }

  toggleWishlist() {
    this.wishlisted = !this.wishlisted;
  }

  lowestPrice() {
    if (!this.event.pricing || this.event.pricing.length === 0) return 0;
    return Math.min(...this.event.pricing.map((p: any) => p.price));
  }

  averageRating() {
    const r = this.event.reviews || [];
    if (!r.length) return 0;
    return r.reduce((s: number, x: any) => s + (x.rating || 0), 0) / r.length;
  }

  attributePairs(obj: any) {
    if (!obj) return [];
    return Object.keys(obj).map((k) => ({ key: k, value: obj[k] }));
  }

  onBook() {
    // implement booking flow or emit an event to parent
    const tier = this.selectedTier || this.event.pricing[0];
    const total = (tier?.price || 0) * this.quantity;
    console.log('Reserve', { tier, quantity: this.quantity, total });
  }

  getEventDetails(id: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getEventDetails?id=${id}`;

    this.http.get(ENDPOINT).subscribe(
      (response: any) => {
        console.log('Success');
        console.log('response here ', response);

        (response.event.reviews = [
          { user: 'Rupon', rating: 5, comment: 'Nice to be here on this event', date: new Date() },
          { user: 'Arnab', rating: 4, comment: 'It was a good event', date: new Date() },
          { user: 'Zaman', rating: 4, comment: 'Good event', date: new Date() },
        ]),
          (response.event.schedule = [
            { time: '18:00', activity: 'Start' },
            { time: '19:00', activity: 'End' },
          ]),
          (response.event.attributes = { Capacity: '200' }),
          response.event.nearby= ['Cafe', 'Parking'],
          (this.event = response.event);
        this.content = response.event.description;
        this.selectedFiles = response.eventImages;
        this.ticket_details = response.ticket_details;
        this.organizer = response.organizer;
        this.category = response.category;
        
        this.updateMap();

        // this.selectedTier = this.ticket_details[0]?.ticket_price ?? null;
        // this.

        // return callback && callback(response);
      },
      (error) => {
        console.log('error ', error);
        // return callback && callback(error);
      },
      () => {
        console.log('Observable is now completed.');
      }
    );
  }

  getImagePreview(file: any): string {
    console.log('file ', file);
    // return URL.createObjectURL(file);
    return this.url + '/' + file.path;
  }
}
