import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
user: any = {
    organizationName: '',
    name: 'Skaplink Technologies',
    email: 'skaplink@gmail.com',
    phone: '9988776655',
    country: 'India',
    state: 'Assam',
    city: 'Guwahati'
  };
}
