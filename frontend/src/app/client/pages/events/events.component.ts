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
    state: '',
    month: '',
    type: '',
    date: '',
  };

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    const reqBody = {
      limit: 13,
      page: 1,
    };

    this.http.post(`${environment.BASE_URL}/api/getAllEvents`, reqBody).subscribe((res: any) => {
      this.events = res.data || [];
      this.filteredEvents = [...this.events];
    });
  }

  filterByDate(option: string): void {
    this.filters.date = option;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchesState = !this.filters.state || event.state === this.filters.state;
      const matchesMonth = !this.filters.month || event.month === this.filters.month;
      const matchesType = !this.filters.type || event.type === this.filters.type;
      return matchesState && matchesMonth && matchesType;
    });
  }

  clearFilters(): void {
    this.filters = { state: '', month: '', type: '', date: '' };
    this.filteredEvents = [...this.events];
  }

  viewEvent(event: any): void {
    this.router.navigate([`/event-details/${event.id}`]);
  }
}
