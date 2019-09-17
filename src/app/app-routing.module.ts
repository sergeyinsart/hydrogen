import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {ONBOARDING_ROUTES} from './onboarding/onboarding.routing';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
];

// otherwise redirect to home
const OTHERWISE = { path: '**', redirectTo: '' };

@NgModule({
  imports: [RouterModule.forRoot([...routes, ...ONBOARDING_ROUTES, OTHERWISE])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
