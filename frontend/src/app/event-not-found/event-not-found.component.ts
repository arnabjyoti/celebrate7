import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-not-found',
  templateUrl: './event-not-found.component.html',
  styleUrls: ['./event-not-found.component.css']
})
export class EventNotFoundComponent {

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  browseEvents() {
    this.router.navigate(['/events']);
  }
}