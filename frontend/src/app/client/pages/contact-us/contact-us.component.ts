import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
contactForm: FormGroup;
loader: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loader = true;   // start loader
      console.log('Form Data:', this.contactForm.value);
      alert('Thank you for reaching out! We’ll get back to you soon.');
      this.contactForm.reset();
       this.loader = false;   // stop loader
    }
  }
}