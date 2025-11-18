import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth/role.gaurd';
import { AuthGuardService as AuthGuard } from './auth/auth-gaurd.service';
import { HomeComponent } from './client/pages/home/home.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { AboutComponent } from './client/pages/about/about.component';
import { LoginComponent } from './client/pages/login/login.component';
import { RegisterComponent } from './client/pages/register/register.component';
import { EventsComponent } from './client/pages/events/events.component';

import { SaDashboardComponent } from './super-admin/sa-dashboard/sa-dashboard.component';
import { SaAdminLayoutComponent } from './super-admin/sa-admin-layout/sa-admin-layout.component';
import { OrganizersComponent } from './super-admin/organizers/organizers.component';
import { EventCategoriesComponent } from './super-admin/event-categories/event-categories.component';
import { AllEventsComponent } from './super-admin/all-events/all-events.component';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddEventComponent } from './admin/event/add-event/add-event.component';
import { ViewEventsComponent } from './admin/event/view-events/view-events.component';
import { EventDetailsComponent } from './admin/event/event-details/event-details.component';
import { EventDetailsClientComponent } from './client/pages/event-details-client/event-details-client.component';
import { MapViewComponent } from './map-view/map-view.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
// import { MapTestComponent } from './map-test/map-test.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ContactUsComponent } from './client/pages/contact-us/contact-us.component';
import { EventsCategorywiseComponent } from './client/pages/events-categorywise/events-categorywise.component';
const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contactUs', component: ContactUsComponent },
      { path: 'event/:id', component: EventDetailsClientComponent },
      { path: 'events-by-category/:categoryName', component: EventsCategorywiseComponent }
    ],
  },
  {
    path: '',
    component: SaAdminLayoutComponent,
    children: [
      {
        path: 'sa-dashboard',
        component: SaDashboardComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
      {
        path: 'organizers',
        component: OrganizersComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
      {
        path: 'event-categories',
        component: EventCategoriesComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
      {
        path: 'all-events',
        component: AllEventsComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
      { path: 'create-event', 
        component: AddEventComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' }, 
      },
      { path: 'modify-event/:id', 
        component: AddEventComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' },
      },
      { path: 'edit-event/:id', 
        component: AddEventComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' }, 
      },
      { path: 'event-details-view/:id', 
        component: EventDetailsComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'sa' }, 
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'my-profile',
        component: AdminProfileComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      { path: 'add-event', 
        component: AddEventComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' }, 
      },
      { path: 'edit-event/:id', 
        component: AddEventComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' }, 
      },
      { path: 'view-event', 
        component: ViewEventsComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
      },
      { path: 'event-details/:id', 
        component: EventDetailsComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' }, 
      },
    ],
  },

  { path: 'map', component: MapViewComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: '', redirectTo: 'map', pathMatch: 'full' },

  { path: '**', redirectTo: 'home' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
