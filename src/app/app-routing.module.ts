import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {ONBOARDING_ROUTES} from './onboarding/onboarding.routing';
import {AuthGuard} from './_helperts/auth.guard';
import {DASHBOARD_ROUTES} from './dashboard/dashboard.routing';
import {DashboardComponent} from './dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  ...ONBOARDING_ROUTES,
  ...DASHBOARD_ROUTES,
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
