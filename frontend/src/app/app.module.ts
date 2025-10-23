import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import { AuthGuardService } from './auth/auth-gaurd.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { ClientNavbarComponent } from './client/client-navbar/client-navbar.component';
import { ClientFooterComponent } from './client/client-footer/client-footer.component';
import { HomeComponent } from './client/pages/home/home.component';
import { AboutComponent } from './client/pages/about/about.component';
import { LoginComponent } from './client/pages/login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminNavbarComponent } from './admin/admin-navbar/admin-navbar.component';
import { AdminFooterComponent } from './admin/admin-footer/admin-footer.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RegisterComponent } from './client/pages/register/register.component';
import { EventsComponent } from './client/pages/events/events.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AddEventComponent } from './admin/event/add-event/add-event.component';
import { ViewEventsComponent } from './admin/event/view-events/view-events.component';
import { EventDetailsComponent } from './admin/event/event-details/event-details.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SaDashboardComponent } from './super-admin/sa-dashboard/sa-dashboard.component';
import { SaAdminLayoutComponent } from './super-admin/sa-admin-layout/sa-admin-layout.component';
import { OrganizersComponent } from './super-admin/organizers/organizers.component';
import { EventCategoriesComponent } from './super-admin/event-categories/event-categories.component';
import { AllEventsComponent } from './super-admin/all-events/all-events.component';
import { EventDetailsClientComponent } from './client/pages/event-details-client/event-details-client.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientLayoutComponent,
    ClientNavbarComponent,
    ClientFooterComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    AdminLayoutComponent,
    AdminNavbarComponent,
    AdminFooterComponent,
    DashboardComponent,
    RegisterComponent,
    EventsComponent,
    SaDashboardComponent,
    SaAdminLayoutComponent,
    OrganizersComponent,
    FileUploadComponent,
    AddEventComponent,
    ViewEventsComponent,
    EventDetailsComponent,
    EventCategoriesComponent,
    AllEventsComponent,
    EventDetailsClientComponent,
  ],
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSlideToggleModule,
    NgxSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    FlexLayoutModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    QuillModule.forRoot(),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, AuthGuardService, DatePipe, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
