import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ChooseAccountTypeComponent } from './choose-account-type/choose-account-type.component';
import {MaterialModule} from '../material.module';
import {AccountTypesResolver} from './onboarding.routing';

@NgModule({
  declarations: [
    QuestionnaireComponent,
    ChooseAccountTypeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  providers: [
    AccountTypesResolver
  ]
})
export class OnboardingModule { }
