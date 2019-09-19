import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientResponse, PortfolioRecommendation} from '../onboarding';
import {PortfolioRecommendationService} from './portfolio-recommendation.service';
import {Label} from 'ng2-charts';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material';

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
    private snackBar: MatSnackBar
  ) {
    this.suggestedAllocation = route.snapshot.data.suggestedAllocation;
    this.clientResponse = route.snapshot.data.clientResponse;
    const questions = route.snapshot.data.questionnaire.questions;

    this.timeHorizonLabel = portfolioRecommendationService.getTimeHorizonAnswer(questions).label;
    this.reskLevelLabel = portfolioRecommendationService.getTimeRiskProfileAnswer(questions).label;


    this.pieChartData = this.suggestedAllocation.map(a => a.strategic_weight);
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
        return this.portfolioRecommendationService.createAssetSize(portfolio.id);
      })
      .catch(() => {
        this.snackBar.open('error');
      });
  }
}
