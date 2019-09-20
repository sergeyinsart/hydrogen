import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientResponse, PortfolioRecommendation} from '../onboarding';
import {PortfolioRecommendationService} from './portfolio-recommendation.service';
import {Label} from 'ng2-charts';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material';
import * as _update from 'lodash/update';

const timeHorizonLabels = {
  '&gt;20 years': 'greater than 20 years',
  '10-20 years': '10-20 years',
  '&lt;10 years': 'less than 10 years'
};

const timeHorizonNumLabels = {
  '&gt;20 years': 25,
  '10-20 years': 15,
  '&lt;10 years': 10
};

const riskLevelLabels = {
  conservative: 'conservative',
  aggressive: 'aggressive',
  moderate: 'moderate',
};

const rates = {
  conservative: 10,
  aggressive: 30,
  moderate: 50,
};

@Component({
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss']
})
export class PortfolioRecommendationComponent implements OnInit {
  pieChartData: number[];
  private timeHorizonNumLabel: { '&gt;20 years': number; '&lt;10 years': number; '10-20 years': number };
  private projectedGrowth: number;
  private investAmount: number;

  constructor(
    route: ActivatedRoute,
    private portfolioRecommendationService: PortfolioRecommendationService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.suggestedAllocation = route.snapshot.data.suggestedAllocation;
    this.clientResponse = route.snapshot.data.clientResponse;

    const timeHorizonResponse = portfolioRecommendationService.getResponse('timeHorizon');
    const riskLevelResponse = portfolioRecommendationService.getResponse('riskProfile');
    const investResponse = portfolioRecommendationService.getResponse('invest');

    this.investAmount = parseInt(investResponse.answer_value, 0);

    this.timeHorizonLabel = timeHorizonLabels[timeHorizonResponse.answer_value];
    this.riskLevelLabel = riskLevelLabels[riskLevelResponse.answer_value];


    this.pieChartData = this.suggestedAllocation.map(a => a.weight);
    this.pieChartLabels = this.suggestedAllocation.map(a => a.securityName);

    this.timeHorizonNumLabel = timeHorizonNumLabels[timeHorizonResponse.answer_value];

    this.projectedGrowth = portfolioRecommendationService.calculateGrowth(this.investAmount, 10, rates[riskLevelResponse.answer_value]);
  }
  private suggestedAllocation: any[];
  clientResponse: ClientResponse[];
  private timeHorizonLabel: string;
  private riskLevelLabel: string;

  pieChartLabels: Label[];


  ngOnInit() {

  }

  subscribeAccount() {
    const accountId = this.auth.currentUser.metadata.accountId;
    const allocationId = this.portfolioRecommendationService.suggestedAllocation.id;
    let portfolio;
    this.portfolioRecommendationService.subscribeAccount(accountId, allocationId)
      .then((data: PortfolioRecommendation[]) => {
        portfolio = data[0];
        const promises = [
          this.portfolioRecommendationService.createAssetSize(portfolio.id, this.investAmount),
          this.createPortfolioHoldings(portfolio.id)
        ];
        return Promise.all(promises);
      })
      .then(() => {
        const updatedUser = {...this.auth.currentUser};
        _update(updatedUser, 'metadata.portfolioId', () => portfolio.id);

        return this.auth.updateUser(updatedUser);
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
