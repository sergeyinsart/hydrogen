import {Resolve, Routes} from '@angular/router';
import {AuthGuard} from '../_helperts/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {OnboardingGuard} from '../_helperts/onboarding.guard';
import {Injectable} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {AuthService} from '../auth/auth.service';
import {PortfolioRecommendationService} from '../onboarding/portfolio-recommendation/portfolio-recommendation.service';

@Injectable()
export class AssetSizeResolver implements Resolve<any> {
  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService
  ) {}

  resolve() {
    return this.dashboardService.getAssetSize(this.auth.clientAccount.id);
  }
}

@Injectable()
export class HoldingsResolver implements Resolve<any> {
  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService,
    private portfolioRecommendationService: PortfolioRecommendationService
  ) {}

  resolve() {
    // return this.dashboardService.getHoldings(this.auth.clientAccount.id);
    return Promise.resolve(JSON.parse('[{"id":"cebd9bc0-4c24-4fa3-a3a8-8120f7161ec2","create_date":"2019-09-16T14:49:04.000+0000","update_date":"2019-09-16T14:49:04.000+0000","current_weight":80,"date":"2019-09-01","strategic_weight":80,"model_id":"49fe2bc9-66a6-40b2-aa70-db65f70ca8ef","security_id":"41a615e0-5005-4f90-9da9-0c25e79fc191","metadata":{}},{"id":"6e1acf75-c591-4ec6-9e6f-7271f119d09e","create_date":"2019-09-16T14:50:24.000+0000","update_date":"2019-09-16T14:50:24.000+0000","current_weight":20,"date":"2019-09-01","strategic_weight":20,"model_id":"49fe2bc9-66a6-40b2-aa70-db65f70ca8ef","security_id":"854fc100-ccd6-4441-9b4b-baa0be446ca5","metadata":{}}]'))
      .then((holdings) => {
        return this.dashboardService.getDashboardAllocationData(holdings);
      });
  }
}

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, OnboardingGuard],
    resolve: {
      assetSize: AssetSizeResolver,
      holdings: HoldingsResolver
    }
  },
];
