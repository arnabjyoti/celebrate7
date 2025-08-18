import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sa-admin-layout',
  templateUrl: './sa-admin-layout.component.html',
  styleUrls: ['./sa-admin-layout.component.css'],
})
export class SaAdminLayoutComponent {
  constructor( private router: Router) {}
  handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  };
}
