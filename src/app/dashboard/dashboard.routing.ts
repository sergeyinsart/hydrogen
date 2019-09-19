import {Routes} from '@angular/router';import {AuthGuard} from '../_helperts/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
];
