import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})

export class AllEventsComponent implements OnInit {
  displayedColumns: string[] = ['eventName', 'organizer', 'eventDate', 'city', 'status', 'actions'];
  dataSource:any = [];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  perPage: number = 13;
  search : any;
  manageSearch : any = {
    searchByEventName : '',
    searchByOrganizer : '',
    searchByCity : '',
    searchByDate: '',
    // search : ''
  }

  onSearchChange(event: any) {
    console.log(event.target.value);
    console.log(event.target.name);
    if(event.target.name == 'searchByEventName') {
      this.manageSearch.searchByEventName = event.target.value;
    }
    if(event.target.name == 'searchByOrganizer') {
      this.manageSearch.searchByOrganizer = event.target.value;
    }
    if(event.target.name == 'searchByCity') {
      this.manageSearch.searchByCity = event.target.value;
    }
    if(event.target.name == 'searchByDate') {
      this.manageSearch.searchByDate = event.target.value;
    }
  }

  fetchEvents(): void {
    let reqBody = {
      requestType: 'SuperAdmin',
      limit : this.perPage,
      page: this.currentPage,
      searchBy : 'eventName',
      search : this.manageSearch || {}
    }


    this.http.post(`${environment.BASE_URL}/api/getAllEvents`, reqBody).subscribe((res: any) => {
      console.log('getAllEvents', res);
      
      this.dataSource = res.data || [];
      this.totalItems = res.pagination.totalItems;
      this.totalPages = res.pagination.totalPages;
      this.currentPage = res.pagination.currentPage;
      this.perPage = res.pagination.perPage;

      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  viewEvent(event: any): void {
    this.router.navigate([`/event-details-view/${event.id}`]);
  }
  editEvent(event: any): void {
    // console.log('Edit Event:', event);
    this.router.navigate([`/modify-event/${event.id}`]);
  }

  deleteEvent(event: any): void {
    console.log('Delete Event:', event);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchEvents();
  }


  // activeEvent 
  activeEvent(event: any): void {
    console.log('Active Event:', event);
    let reqBody = {
      eventId : event.id
    }
    this.http.post(`${environment.BASE_URL}/api/activeEvent`, reqBody).subscribe((res: any) => {
      console.log('getAllEvents', res);
      this.fetchEvents();
    });
  }


}
