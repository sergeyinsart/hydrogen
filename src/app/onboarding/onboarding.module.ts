import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ChooseAccountTypeComponent } from './choose-account-type/choose-account-type.component';
import {MaterialModule} from '../material.module';
import {
  AccountTypesResolver, ClientResponseResolver,
  NodeRelationshipResolver,
  NodesResolver,
  QuestionsResolver,
  SuggestedAllocationResolver
} from './onboarding.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PortfolioRecommendationComponent } from './portfolio-recommendation/portfolio-recommendation.component';

@NgModule({
  declarations: [
    QuestionnaireComponent,
    ChooseAccountTypeComponent,
    PortfolioRecommendationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AccountTypesResolver,
    QuestionsResolver,
    NodesResolver,
    NodeRelationshipResolver,
    SuggestedAllocationResolver,
    ClientResponseResolver
  ]
})
export class OnboardingModule { }
