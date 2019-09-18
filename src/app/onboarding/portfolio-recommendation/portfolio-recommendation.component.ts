import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Allocation, ClientResponse, Question} from '../onboarding';
import {PortfolioRecommendationService} from './portfolio-recommendation.service';

@Component({
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss']
})
export class PortfolioRecommendationComponent implements OnInit {
  private suggestedAllocation: Allocation;
  private clientResponse: ClientResponse[];
  private timeHorizonLabel: string;
  private reskLevelLabel: string;

  constructor(
    route: ActivatedRoute,
    portfolioRecommendationService: PortfolioRecommendationService
  ) {
    this.suggestedAllocation = route.snapshot.data.suggestedAllocation;
    this.clientResponse = route.snapshot.data.clientResponse;
    const questions = route.snapshot.data.questionnaire.questions;

    this.timeHorizonLabel = portfolioRecommendationService.getTimeHorizonAnswer(questions).label;
    this.reskLevelLabel = portfolioRecommendationService.getTimeRiskProfileAnswer(questions).label;
  }

  ngOnInit() {

  }

}
