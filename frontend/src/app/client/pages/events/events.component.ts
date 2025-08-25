import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  constructor(
    // private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
    // private route: ActivatedRoute,
    // private location: Location
  ) {}




    perPage: number = 13;
    currentPage: number = 1;
    totalItems: number = 0;
    totalPages: number = 0;
    manageSearch : any = {
      searchByEventName : '',
      searchByOrganizer : '',
      searchByCity : '',
      searchByDate: '',
      // search : ''
    }
    env = environment.BASE_URL;

    events: any[] = [];

    ngOnInit(): void {
      this.fetchEvents();
    }


  fetchEvents(): void {

    let reqBody = {
      limit : this.perPage,
      page: this.currentPage,
      searchBy : 'eventName',
      search : this.manageSearch || {}
    }

   


    this.http.post(`${environment.BASE_URL}/api/getAllEvents`, reqBody).subscribe((res: any) => {
      console.log('getAllEvents', res);
      
      this.events = res.data || [];
      this.totalItems = res.pagination.totalItems;
      this.totalPages = res.pagination.totalPages;
      this.currentPage = res.pagination.currentPage;
      this.perPage = res.pagination.perPage;
    });
  }

  viewEvent(event: any): void {
    this.router.navigate([`/event-details/${event.id}`]);
  }

}
