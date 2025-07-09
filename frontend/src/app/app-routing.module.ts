import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from "./auth/auth-gaurd.service";
import { HomeComponent } from './client/pages/home/home.component';
import { ClientLayoutComponent } from './client/client-layout/client-layout.component';
import { AboutComponent } from './client/pages/about/about.component';
import { LoginComponent } from './client/pages/login/login.component';
import { RegisterComponent } from './client/pages/register/register.component';
import { EventsComponent } from './client/pages/events/events.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'events', component: EventsComponent },
    ]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // { path: 'users', component: UsersComponent },
      // { path: 'settings', component: SettingsComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  { path: "**", redirectTo: "home" }
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
