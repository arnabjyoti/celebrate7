import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private appService: AppService, private authService: AuthService, private http: HttpClient){}

  counts: any ={};
  ngOnInit(): void {
    let payload=this.authService.getDecodedToken();
    console.log("Payload=",payload);
    this.getCounts();
  }
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


  getCounts(): void {
  
    this.http.get(`${environment.BASE_URL}/api/getCounts`).subscribe((res: any) => {
      console.log('getAllEvents', res);
      this.counts = res;
    
    });
  }


 createEvent(): void {
    window.location.href = '/add-event';
  }



}