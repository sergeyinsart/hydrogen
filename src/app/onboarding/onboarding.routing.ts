import {Resolve, Routes} from '@angular/router';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ChooseAccountTypeComponent} from './choose-account-type/choose-account-type.component';
import {Injectable} from '@angular/core';
import {OnboardingService} from './onboarding.service';
import {PortfolioRecommendationService} from './portfolio-recommendation/portfolio-recommendation.service';
import {PortfolioRecommendationComponent} from './portfolio-recommendation/portfolio-recommendation.component';
import {QuestionnaireService} from './questionnaire/questionnaire.service';
import {AuthGuard} from '../_helperts/auth.guard';
import {OnboardingGuard} from '../_helperts/onboarding.guard';

@Injectable()
export class AccountTypesResolver implements Resolve<any> {
  constructor(private onboarding: OnboardingService) {}

  resolve() {
    return this.onboarding.getAccountTypes();
  }
}

@Injectable()
export class QuestionsResolver implements Resolve<any> {
  constructor(private questionnaireService: QuestionnaireService) {}

  resolve() {
    return this.questionnaireService.getQuestions();
  }
}

@Injectable()
export class NodesResolver implements Resolve<any> {
  constructor(private questionnaire: PortfolioRecommendationService) {}

  resolve() {
    return this.questionnaire.getNodesList();
  }
}

@Injectable()
export class NodeRelationshipResolver implements Resolve<any> {
  constructor(private questionnaire: PortfolioRecommendationService) {}

  resolve() {
    return this.questionnaire.getNodeRelationship();
  }
}

@Injectable()
export class ClientResponseResolver implements Resolve<any> {
  constructor(private questionnaire: QuestionnaireService) {}

  resolve() {
    return this.questionnaire.getClientResponsesList();
  }
}

@Injectable()
export class SuggestedAllocationResolver implements Resolve<any> {
  constructor(
    private portfolioRecommendationService: PortfolioRecommendationService,
  ) {}

  resolve() {
    return this.portfolioRecommendationService.getResultPageData();
  }
}

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'questionnaire',
    component: QuestionnaireComponent,
    resolve: {
      questionnaire: QuestionsResolver,
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'choose-account-type',
    component: ChooseAccountTypeComponent,
    resolve: {
      accountTypes: AccountTypesResolver
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'portfolio-recommendation',
    component: PortfolioRecommendationComponent,
    resolve: {
      suggestedAllocation: SuggestedAllocationResolver,
      questionnaire: QuestionsResolver,
    },
    canActivate: [AuthGuard, OnboardingGuard]
  },
];
