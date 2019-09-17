import {Resolve, Routes} from '@angular/router';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ChooseAccountTypeComponent} from './choose-account-type/choose-account-type.component';
import {Injectable} from '@angular/core';
import {OnboardingService} from './onboarding.service';

@Injectable()
export class AccountTypesResolver implements Resolve<any> {
  constructor(private onboarding: OnboardingService) {}

  resolve() {
    return this.onboarding.getAccountTypes();
  }
}

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'questionnaire',
    component: QuestionnaireComponent
  },
  {
    path: 'choose-account-type',
    component: ChooseAccountTypeComponent,
    resolve: {
      accountTypes: AccountTypesResolver
    }
  },
];
