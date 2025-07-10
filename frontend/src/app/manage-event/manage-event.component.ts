import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.css']
})
export class ManageEventComponent {

  event = {
    eventName: '',
    eventDate: '',
    location: ''
  };


  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log('Event Submitted:', this.event);
    // You can also send it to a backend API here
  }

}
