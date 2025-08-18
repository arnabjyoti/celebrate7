import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    const token = this.auth.getAccessToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}