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

import { FlexLayoutModule } from '@angular/flex-layout';
import { ManageEventComponent } from './manage-event/manage-event.component';


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
    ManageEventComponent,
  ],
  imports: [
    FormsModule,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, AuthGuardService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
