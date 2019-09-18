import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientResponse} from '../onboarding';
import {PortfolioRecommendationService} from './portfolio-recommendation.service';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss']
})
export class PortfolioRecommendationComponent implements OnInit {
  private pieChartData: number[];

  constructor(
    route: ActivatedRoute,
    portfolioRecommendationService: PortfolioRecommendationService
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


  ngOnInit() {}
}
