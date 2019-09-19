import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientResponse, PortfolioRecommendation} from '../onboarding';
import {PortfolioRecommendationService} from './portfolio-recommendation.service';
import {Label} from 'ng2-charts';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material';

const timeHorizonLabels = {
  '&gt;20 years': 'greater than 20 years',
  '10-20 years': '10-20 years',
  '&lt;10 years': 'less than 10 years'
};

const riskLevelLabels = {
  conservative: 'conservative',
  aggressive: 'aggressive',
  moderate: 'moderate',
};

@Component({
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss']
})
export class PortfolioRecommendationComponent implements OnInit {
  private pieChartData: number[];

  constructor(
    route: ActivatedRoute,
    private portfolioRecommendationService: PortfolioRecommendationService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.suggestedAllocation = route.snapshot.data.suggestedAllocation;
    this.clientResponse = route.snapshot.data.clientResponse;

    this.timeHorizonLabel = timeHorizonLabels[portfolioRecommendationService.getTimeHorizonResponse().answer_value];
    this.reskLevelLabel = riskLevelLabels[portfolioRecommendationService.getTimeRiskProfileResponse().answer_value];


    this.pieChartData = this.suggestedAllocation.map(a => a.weight);
    this.pieChartLabels = this.suggestedAllocation.map(a => a.securityName);
  }
  private suggestedAllocation: any[];
  private clientResponse: ClientResponse[];
  private timeHorizonLabel: string;
  private reskLevelLabel: string;

  pieChartLabels: Label[];


  ngOnInit() {

  }

  subscribeAccount() {
    const accountId = this.auth.clientAccount.id;
    const allocationId = this.portfolioRecommendationService.suggestedAllocation.id;
    this.portfolioRecommendationService.subscribeAccount(accountId, allocationId)
      .then((data: PortfolioRecommendation[]) => {
        const portfolio = data[0];
        const promises = [
          this.portfolioRecommendationService.createAssetSize(portfolio.id),
          this.createPortfolioHoldings(portfolio.id)
        ];
        return Promise.all(promises);
      })
      .then(() => {
        return this.router.navigate(['/dashboard']);
      })
      .catch(() => {
        this.snackBar.open('error');
      });
  }

  createPortfolioHoldings(portfolioId) {
    const holdingPromises = this.suggestedAllocation.map(a => {
      return this.portfolioRecommendationService.createPortfolioHoldings(portfolioId, a.securityId, a.weight);
    });

    return Promise.all(holdingPromises);
  }
}
