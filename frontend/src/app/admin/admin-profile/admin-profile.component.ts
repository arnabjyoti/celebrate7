import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { AdminProfileService } from './admin-profile.service';
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  email:any="";
  profileInfo:any = null;
  constructor(private authService:AuthService, private spinner: NgxSpinnerService, private adminProfileService: AdminProfileService, private toastr: ToastrService){
    this.email = this.authService.getEmail();
  }
  ngOnInit(): void {
    this.getProfileInfo();    
  }

  getProfileInfo(){
    this.spinner.show('SectionSpinner');
    let requestObject: any = {
      email: this.email,
    };
    this.adminProfileService
      .getProfileInfo(requestObject)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.profileInfo = response.data;
          } else {
            this.toastr.error(response.message, 'Error Message');
          }
          this.spinner.hide('SectionSpinner');
        },
        error: (err: any) => {
          this.spinner.hide('SectionSpinner');
          this.toastr.error(err, 'Error Message');
        },
      });
  }
}
