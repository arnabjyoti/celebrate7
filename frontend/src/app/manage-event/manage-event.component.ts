import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.css']
})
export class ManageEventComponent {

  event = {
    eventName: '',
    type: '',
    eventDate: '',
    eventTime: '',
    country: '',
    state:'',
    city:'',
    fullAddress:'',

  };


  submitted = false;
  content: string = '';


  onSubmit() {
    this.submitted = true;
    console.log('Event Submitted:', this.event);
    // You can also send it to a backend API here
  }

}
