import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  constructor(private http: HttpClient, private router: Router) {}

  env = environment.BASE_URL;
  events: any[] = [];
  filteredEvents: any[] = [];

  filters = {
  dateRange: false,
  fromDate: '',
  toDate: '',
  date: '',
  state: '',
  month: '',
  language: '',
  category: '',
  genre: '',
  more: '',
};

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

today: string = '';

isDateRangeValid: boolean = false;
dateError: string = '';
  
  ngOnInit(): void {
    this.fetchEvents();
    const now = new Date();
  this.today = now.toISOString().split('T')[0];
  }

  fetchEvents(): void {
    const reqBody = {
      limit: 13,
      page: 1,
      filters: this.filters,
    };

    console.log('📤 Sending request to backend with filters:', reqBody);

    this.http.post(`${environment.BASE_URL}/api/getAllEvents`, reqBody).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        this.events = res.data || [];
        this.filteredEvents = [...this.events];
      },
      error: (err) => console.error('❌ Error fetching events:', err),
    });
  }

  filterByDate(option: string): void {
    this.filters.date = option;
    this.filters.dateRange = false; // turn off range mode if clicked
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
      state: '',
      month: '',
      language: '',
      category: '',
      genre: '',
      more: '',
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
      console.log('🔍 Searching between:', this.filters.fromDate, 'and', this.filters.toDate);
      this.filters.date = ''; // clear single-date filter
      this.applyFilters();
    }
  }
}