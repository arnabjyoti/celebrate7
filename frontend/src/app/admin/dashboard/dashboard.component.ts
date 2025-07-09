import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

// Define the columns to show in the Material table
  displayedColumns: string[] = ['event', 'date', 'tickets', 'status'];

  // Sample data for recent events
  events = [
    {
      event: 'New Year Bash',
      date: 'Dec 31, 2025',
      tickets: 320,
      status: 'Active'
    },
    {
      event: 'Music Fest',
      date: 'Aug 15, 2025',
      tickets: 512,
      status: 'Completed'
    },
    {
      event: 'Startup Expo',
      date: 'Sep 10, 2025',
      tickets: 210,
      status: 'Active'
    },
    {
      event: 'Food Carnival',
      date: 'Oct 20, 2025',
      tickets: 420,
      status: 'Completed'
    }
  ];
}