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
import {SaAdminLayoutComponent} from './super-admin/sa-admin-layout/sa-admin-layout.component';
import { OrganizersComponent } from './super-admin/organizers/organizers.component';
import { EventCategoriesComponent } from './super-admin/event-categories/event-categories.component';
import { AllEventsComponent } from './super-admin/all-events/all-events.component';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddEventComponent } from './admin/event/add-event/add-event.component';
import { ViewEventsComponent } from './admin/event/view-events/view-events.component';
import { EventDetailsComponent } from './admin/event/event-details/event-details.component';
import { EventDetailsClientComponent } from './client/pages/event-details-client/event-details-client.component';


const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'events', component: EventsComponent },
      { path: 'event/:id', component: EventDetailsClientComponent },
    ]
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
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' }
      },
      // { path: 'users', component: UsersComponent },
      // { path: 'settings', component: SettingsComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
       { path: 'add-event', component: AddEventComponent },
      { path: 'edit-event/:id', component: AddEventComponent },
      { path: 'view-event', component: ViewEventsComponent },
      { path: 'event-details/:id', component: EventDetailsComponent },
    ],
  },

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
