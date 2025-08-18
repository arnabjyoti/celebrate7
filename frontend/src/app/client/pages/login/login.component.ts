import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  useEmail = false;
  mobile = '';
  email = '';
  otp = '';
  otpSent = false;
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.useEmail = !this.useEmail;
    this.message = '';
    this.otpSent = false;
    this.mobile = '';
    this.email = '';
    this.otp = '';
  }

  sendOtp() {
    if (!this.mobile && !this.email) {
      this.message = 'Please enter mobile or email.';
      return;
    }

    this.authService.requestOtp(this.mobile, this.email).subscribe({
      next: () => {
        this.otpSent = true;
        this.message = 'OTP sent successfully';
      },
      error: (err) => {
        this.otpSent = false;
        this.message = 'Failed to send OTP';
      },
    });
  }

  verifyOtp() {
    this.authService.verifyOtp(this.mobile, this.email, this.otp).subscribe({
      next: (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.message = 'Login successful!';
        // this.router.navigate(['/dashboard']);
        const role = this.authService.getRole();
        console.log("Role==",role);
        
        if (role === 'sa') {
          this.router.navigate(['/sa-dashboard']);
        }else if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'user') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/unknown-role']);
        }
      },
      error: () => {
        this.message = 'Invalid or expired OTP';
      },
    });
  }
}
