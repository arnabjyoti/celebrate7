import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent {

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  eventId: any;
  event = {
    eventName: '',
    organizer: '',
    type: '',
    eventDate: '',
    eventTime: '',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    description: '',
    status: 'draft',
  };
  content: string = '';
  selectedFiles: any[] = [];
  url = environment.BASE_URL;

  ticket_details: any = [];


  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID:', this.eventId);
      this.getEventDetails(this.eventId);
  }

  getEventDetails(id: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getEventDetails?id=${id}`;

    this.http.get(ENDPOINT).subscribe(
      (response: any) => {
        console.log('Success');
        console.log('response here ', response);
        this.event = response.event;
        this.content = response.event.description;
        this.selectedFiles = response.eventImages;
        this.ticket_details = response.ticket_details;
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
