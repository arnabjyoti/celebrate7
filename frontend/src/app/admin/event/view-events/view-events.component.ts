import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.css']
})
export class ViewEventsComponent implements OnInit {
  displayedColumns: string[] = ['eventName', 'organizer', 'eventDate', 'city', 'status', 'actions'];
  dataSource:any = [];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  perPage: number = 10;

  fetchEvents(): void {

    let reqBody = {
      limit : this.perPage,
      page: this.currentPage,
      search : ''
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
    this.router.navigate([`/event-details/${event.id}`]);
  }
  editEvent(event: any): void {
    // console.log('Edit Event:', event);
    this.router.navigate([`/edit-event/${event.id}`]);
  }

  deleteEvent(event: any): void {
    console.log('Delete Event:', event);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchEvents();
  }

}
