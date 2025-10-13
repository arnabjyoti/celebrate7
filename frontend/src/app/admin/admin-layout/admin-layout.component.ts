import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
constructor( private router: Router) {}
  handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  };
}
