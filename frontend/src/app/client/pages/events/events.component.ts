import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as data from 'countrycitystatejson';
import { HelperService } from 'src/app/helpers/helper.service';

interface LocationPoint {
  id: string | number;
  title: string;
  description?: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private helper: HelperService
  ) {}

  AllData: any = null;
  Countries: any = [];
  selectedCountry: any = '';
  States: any = [];
  selectedState: any = '';
  Cities: any = [];
  selectedCity: any = '';
  countryDetails: any = {};

  locations: LocationPoint[] = [];

  env = environment.BASE_URL;
  events: any[] = [];
  filteredEvents: any[] = [];

  viewAs: string = 'grid';

  filters = {
    dateRange: false,
    fromDate: '',
    toDate: '',
    date: '',
    country: '',
    state: '',
    city: '',
    month: '',
    language: '',
    category: '',
    genre: '',
    more: '',
    activeDateButton: '',
  };

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  today: string = '';

  isDateRangeValid: boolean = false;
  dateError: string = '';
  loader: boolean = false;

  ngOnInit(): void {
    this.fetchEvents();
    this.getInitApi();
    const now = new Date();
    this.today = now.toISOString().split('T')[0];

    this.AllData = data.getAll();
    // this.Countries = data.getCountries();
    console.log('AllData==', this.AllData);
    console.log('data =>', data.getCountries());

    this.getEventCategories();
  }

  getInitApi() {
    this.helper.getCountryStateCity().subscribe(() => {
      const countries = this.helper.getAllCountries();

      console.log('countries: ', countries);
      this.Countries = countries;
    });
  }

  fetchEvents(): void {
    const reqBody = {
      requestType: 'Public',
      limit: 15,
      page: 1,
      filters: this.filters,
    };

    console.log('📤 Sending request to backend with filters:', reqBody);
    this.loader = true;
    this.http
      .post(`${environment.BASE_URL}/api/getAllEvents`, reqBody)
      .subscribe({
        next: (res: any) => {
          this.loader = false;
          console.log('✅ Response received:', res);
          this.events = res.data || [];
          console.log('Events:', this.events);
          this.locations = this.events.map((event: any) => ({
            id: event.id,
            title: event.eventName,
            // {{ event.eventDate | date : "mediumDate" }}
            description: `${new Date(event.eventFromDate).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
              }
            )} `,
            lat: event.lat,
            lng: event.lng,
          }));

          console.log('Locations:', this.locations);

          this.filteredEvents = [...this.events];
        },
        error: (err) => {
          this.loader = false;
          console.error('❌ Error fetching events:', err);
        }
      });
  }

  filterByDate(option: string): void {
    this.filters.activeDateButton = option; // set active button
    this.filters.date = option; // update filter
    this.filters.dateRange = false; // optional: turn off date range
    this.applyFilters();
  }

  toggleDateRange(): void {
    if (!this.filters.dateRange) {
      this.clearDates();
    }
    this.applyFilters();
  }

  applyFilters(): void {
    console.log('⚙️ Applying filters:', this.filters);
    this.fetchEvents();
  }

  clearFilters(): void {
    console.log('🔄 Clearing all filters...');
    this.filters = {
      date: '',
      dateRange: false,
      fromDate: '',
      toDate: '',
      country: '',
      state: '',
      city: '',
      month: '',
      language: '',
      category: '',
      genre: '',
      more: '',
      activeDateButton: '',
    };
    this.dateError = '';
    this.isDateRangeValid = false;
    this.fetchEvents();
  }

  openDatePicker(type: 'from' | 'to') {
    const input =
      type === 'from'
        ? document.querySelector<HTMLInputElement>('#fromPicker')
        : document.querySelector<HTMLInputElement>('#toPicker');
    input?.showPicker(); // opens native date picker
  }

  onDateChange() {
    const { fromDate, toDate } = this.filters;
    this.dateError = '';

    if (fromDate && toDate && fromDate > toDate) {
      this.dateError = 'From Date cannot be greater than To Date.';
      this.isDateRangeValid = false;
      return;
    }

    this.isDateRangeValid = !!(fromDate && toDate && fromDate <= toDate);
  }

  clearDates() {
    this.filters.fromDate = '';
    this.filters.toDate = '';
    this.dateError = '';
    this.isDateRangeValid = false;
  }

  searchByDateRange() {
    if (this.isDateRangeValid) {
      console.log(
        '🔍 Searching between:',
        this.filters.fromDate,
        'and',
        this.filters.toDate
      );
      this.filters.date = ''; // clear single-date filter
      this.applyFilters();
    }
  }

  setView(mode: 'grid' | 'map') {
    this.viewAs = mode;
    console.log('Switched view to:', mode);
  }

  //country state city fatch

  onChangeCountry = () => {
    if (this.filters.country) {
      this.helper.getCountryStateCity().subscribe(() => {
        const states = this.helper.getStates(this.filters.country);
        console.log('statessss', states);
        this.States = states;
      });

      // find country object by full name
      // const selectedCountry = this.Countries.find(
      //   (c:any) => c.name.toLowerCase() === this.filters.country.toLowerCase()
      // );

      // // get states using shortName (like "IN")
      // this.States = selectedCountry
      //   ? data.getStatesByShort(selectedCountry.shortName)
      //   : [];

      this.filters.state = '';
      this.Cities = [];
    } else {
      this.States = [];
      this.Cities = [];
    }
  };

  onChangeState = () => {
    if (this.filters.state && this.filters.country) {
      this.helper.getCountryStateCity().subscribe(() => {
        const cities = this.helper.getCities(
          this.filters.country,
          this.filters.state
        );
        console.log('getCities', cities);
        // this.States = states;
        this.Cities = cities || [];
        // this.filters.state = '';
        this.filters.city = '';
      });

      // const selectedCountry = this.Countries.find(
      //   (c:any) => c.name.toLowerCase() === this.filters.country.toLowerCase()
      // );

      // this.Cities = selectedCountry
      //   ? data.getCities(selectedCountry.shortName, this.filters.state)
      //   : [];
    } else {
      this.Cities = [];
    }
  };

  // types/ categories
  eventCategories: any = [];
  getEventCategories() {
    this.eventCategories = [];
    let requestObject = {};
    this.http
      .post(`${environment.BASE_URL}/api/getEventCategories`, requestObject)
      .subscribe((res: any) => {
        if (res.status && res.data.length >= 1) {
          this.eventCategories = res.data || [];
        } else {
          this.eventCategories = [];
        }
      });
  }
}
