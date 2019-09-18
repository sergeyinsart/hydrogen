import {Resolve, Routes} from '@angular/router';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ChooseAccountTypeComponent} from './choose-account-type/choose-account-type.component';
import {Injectable} from '@angular/core';
import {OnboardingService} from './onboarding.service';
import {QuestionnaireService} from './questionnaire/questionnaire.service';

@Injectable()
export class AccountTypesResolver implements Resolve<any> {
  constructor(private onboarding: OnboardingService) {}

  resolve() {
    return this.onboarding.getAccountTypes();
  }
}

@Injectable()
export class QuestionsResolver implements Resolve<any> {
  constructor(private onboarding: OnboardingService) {}

  resolve() {
    return this.onboarding.getQuestions();
  }
}

@Injectable()
export class NodesResolver implements Resolve<any> {
  constructor(private questionnaire: QuestionnaireService) {}

  resolve() {
    return this.questionnaire.getNodesList();
  }
}

@Injectable()
export class NodeRelationshipResolver implements Resolve<any> {
  constructor(private questionnaire: QuestionnaireService) {}

  resolve() {
    return this.questionnaire.getNodeRelationship();
  }
}

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'questionnaire',
    component: QuestionnaireComponent,
    resolve: {
      questionnaire: QuestionsResolver,
      nodes: NodesResolver,
      nodeRelationship: NodeRelationshipResolver
    }
  },
  {
    path: 'choose-account-type',
    component: ChooseAccountTypeComponent,
    resolve: {
      accountTypes: AccountTypesResolver
    }
  },
];
