import {Resolve, Routes} from '@angular/router';
import {AuthGuard} from '../_helperts/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {Injectable} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {AuthService} from '../auth/auth.service';
import {AppGuard} from '../_helperts/app.guard';

@Injectable()
export class AssetSizeResolver implements Resolve<any> {
  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  resolve() {
    return this.dashboardService.getAssetSize(this.auth.currentUser.metadata.accountId);
  }
}

@Injectable()
export class HoldingsResolver implements Resolve<any> {
  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  resolve() {
    return this.dashboardService.getHoldings(this.auth.currentUser.metadata.portfolioId)
      .then((holdings) => {
        return this.dashboardService.getDashboardAllocationData(holdings);
      });
  }
}

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, AppGuard],
    resolve: {
      assetSize: AssetSizeResolver,
      holdings: HoldingsResolver
    }
  },
];
