import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactUsService } from './contact-us.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private toastr: ToastrService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactUsService.saveClientQuery(this.contactForm.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            // this.toastr.success('Thank you for reaching out! We’ll get back to you soon.', 'Success Message');
            Swal.fire({
              title: 'Success Message',
              text: `${response.message}`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.isConfirmed) {
              }
              this.contactForm.reset();
            });
          } else {
            this.toastr.error(response.message, 'Error Message');
          }
        },
        error: (err: any) => {
          this.toastr.error(err, 'Error Message');
        },
      });
    }
  }
}
