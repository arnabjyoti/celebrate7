import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent {
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  routeName: any = '';
  eventId: any;

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID:', this.eventId);

    const fullPath = this.route.snapshot.routeConfig?.path; // e.g. "edit-event/:id"
    const mainRoute = fullPath?.split('/')[0];
    this.routeName = mainRoute;

    if (mainRoute === 'edit-event') {
      // this.activeForm = 2;
      this.getEventDetails(this.eventId);
    }

    // You can now fetch the event with this ID
    // this.fetchEvent(this.eventId);
  }

  selectedFiles: File[] = [];

  onFilesReceived(files: File[]) {
    this.selectedFiles = files;
    console.log('Received files:', this.selectedFiles);
  }

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

  activeForm = 1;

  submitted = false;
  content: string = '';

  onChange(event: any) {
    console.log('Editor changed:', event.html);
  }

  handleNext() {
    this.activeForm++;
  }

  handlePrevious() {
    this.activeForm--;
  }

  onSubmit() {
    this.submitted = true;
    console.log('Event Submitted:', this.event);
    console.log('content:', this.content);
    console.log('Selected Files:', this.selectedFiles);

    this.event.description = this.content;

    // You can also send it to a backend API here
    const ENDPOINT = `${environment.BASE_URL}/api/saveEvent`;
    const requestOptions = {
      // headers: this.headers,
      method: 'post',
      data: this.event,
    };

    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        console.log('Success');
        // return callback && callback(response);
        console.log('response here ', response);
        // this.saveEventImg(response);
        let eventId = response.event.id;
        console.log('eventIdeventId ', eventId);

        this.manageImageUpload(eventId);
        this.toastr.success('Event added successfully');
      },
      (error) => {
        // return callback && callback(error);
        console.log('error ', error);
      },
      () => {
        console.log('Observable is now completed.');
      }
    );
  }

  manageImageUpload(eventId: any) {
    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('image', file);
      formData.append('title', `Title ${index}`);

      this.saveEventImg(formData);
    });
  }

  saveEventImg(imgData: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/saveEventImg`;

    this.http.post(ENDPOINT, imgData).subscribe(
      (res: any) => {
        // alert('Upload Successful!');
        console.log(res);
        // this.imagePreviews = [];
        // this.selectedFiles = [];
      },
      (err) => {
        console.error(err);
        alert('Upload Failed!');
      }
    );
  }

  // for edit

  getEventDetails(id: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getEventDetails?id=${id}`;

    this.http.get(ENDPOINT).subscribe(
      (response: any) => {
        console.log('Success');
        console.log('response here ', response);

        this.event = response.event;
        this.content = response.event.description;

        this.selectedFiles = response.eventImages;

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

  handleUpdate() {
    this.onUpdate();
  }

  onUpdate() {
    const ENDPOINT = `${environment.BASE_URL}/api/updateEvent`;
    const requestOptions = {
      // headers: this.headers,
      method: 'post',
      data: this.event,
    };

    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response: any) => {
        console.log('Success');
        // return callback && callback(response);
        console.log('response here ', response);
        this.toastr.success('Event updated successfully');
      },
      (error) => {
        // return callback && callback(error);
        console.log('error ', error);
      },
      () => {
        console.log('Observable is now completed.');
      }
    );
  }

  goBack() {
    // window.history.back();
    this.location.back();
  }
}
