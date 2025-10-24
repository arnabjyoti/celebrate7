import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from './register.service';
import * as data from 'countrycitystatejson';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  AllData: any = null;
  Countries: any = [];
  selectedCountry: any = '';
  States: any = [];
  selectedState: any = '';
  Cities: any = [];
  selectedCity: any = '';
  organizerName: any = '';
  typeOfOrganizer: any = '';
  contactName: any = '';
  email: any = '';
  mobileNumber: any = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private registerService: RegisterService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.AllData = data.getAll();
    this.Countries = data.getCountries();
    console.log('AllData==', this.AllData);
  }

  onChangeCountry = () => {
    if (this.selectedCountry) {
      this.States = data.getStatesByShort(this.selectedCountry);
    } else {
      this.States = [];
    }
  };

  onChangeState = () => {
    if (this.selectedState) {
      let country: any = this.AllData[`${this.selectedCountry}`];
      this.Cities = country.states[`${this.selectedState}`];
    } else {
      this.Cities = [];
    }
  };

  handleRegistration = () => {
    let validation: any = this.validateData();
    if (!validation?.isValid) {
      this.toastr.warning(validation.warning, 'Warning Message');
    } else {
      this.spinner.show();
      let requestObject: any = {
        organizerName: this.organizerName,
        typeOfOrganizer: this.typeOfOrganizer,
        contactName: this.contactName,
        email: this.email,
        mobileNumber: this.mobileNumber,
        country: this.selectedCountry,
        state: this.selectedState,
        city: this.selectedCity,
      };
      this.registerService.organizerRegistration(requestObject).subscribe({
        next: (response: any) => {
          if (response.status) {
            Swal.fire({
              title: 'Success Message',
              text: `${response.message}`,
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Login Now',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/login']);
              }
              this.resetForm();
            });
          } else {
            this.toastr.error(response.message, 'Error Message');
          }
          this.spinner.hide();
        },
        error: (err: any) => {
          this.toastr.error(err, 'Error Message');
          this.spinner.hide();
        },
      });
    }
  };

  validateData = () => {
    let validation: any = {
      isValid: true,
      warning: null,
      message: 'No warning!',
    };
    if (!this.selectedCity) {
      validation.isValid = false;
      validation.warning = 'Please select your city';
    }
    if (!this.selectedState) {
      validation.isValid = false;
      validation.warning = 'Please select your state/region';
    }
    if (!this.selectedCountry) {
      validation.isValid = false;
      validation.warning = 'Please select your country';
    }
    if (!this.contactName) {
      validation.isValid = false;
      validation.warning = 'Contact person name can not be left blank';
    }
    if (!this.mobileNumber) {
      validation.isValid = false;
      validation.warning = 'Mobile number can not be left blank';
    }
    if (!this.email) {
      validation.isValid = false;
      validation.warning = 'Email id can not be left blank';
    }
    if (!this.typeOfOrganizer) {
      validation.isValid = false;
      validation.warning = 'Please select type of your organization';
    }
    if (!this.organizerName) {
      validation.isValid = false;
      validation.warning = 'Organization name can not left blank';
    }
    return validation;
  };

  resetForm = () => {
    this.organizerName = '';
    this.typeOfOrganizer = '';
    this.contactName = '';
    this.email = '';
    this.mobileNumber = '';
    this.selectedCountry = '';
    this.selectedState = '';
    this.selectedCity = '';
  };
}
