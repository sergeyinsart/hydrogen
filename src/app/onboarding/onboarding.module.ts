import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ChooseAccountTypeComponent } from './choose-account-type/choose-account-type.component';
import {MaterialModule} from '../material.module';
import {AccountTypesResolver, NodeRelationshipResolver, NodesResolver, QuestionsResolver} from './onboarding.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    QuestionnaireComponent,
    ChooseAccountTypeComponent
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
    NodeRelationshipResolver
  ]
})
export class OnboardingModule { }
