import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  useEmail = true;
  mobile = '';
  email = '';
  otp = '';
  otpSent = false;
  // message = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  toggleMode() {
    this.useEmail = !this.useEmail;
    this.otpSent = false;
    this.mobile = '';
    this.email = '';
    this.otp = '';
  }

  sendOtp() {
    if (!this.mobile && !this.email) {
      this.toastr.warning('Please enter your registered email id','Warning Message');
      return;
    }
    this.spinner.show();
    this.authService.requestOtp(this.mobile, this.email).subscribe({
      next: (res) => {
        console.log('RES==', res);
        if (res?.status) {
          this.otpSent = true;
          this.toastr.success(res.message, 'Success Message');
        } else {
          this.otpSent = false;
          this.toastr.error(res.message, 'Error Message');
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.otpSent = false;
        this.toastr.error('Failed to send OTP','Error Message');
        this.spinner.hide();
      },
    });
  }

  verifyOtp() {
    this.authService.verifyOtp(this.mobile, this.email, this.otp).subscribe({
      next: (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.toastr.success('Login successful!', 'Success Message');
        // this.router.navigate(['/dashboard']);
        const role = this.authService.getRole();
        if (role === 'sa') {
          this.router.navigate(['/sa-dashboard']);
        } else if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'user') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/unknown-role']);
        }
      },
      error: () => {
        this.toastr.error('Invalid or expired OTP','Error Message');
      },
    });
  }
}
