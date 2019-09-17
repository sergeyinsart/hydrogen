import { Component, OnInit } from '@angular/core';
import {OnboardingService} from '../onboarding.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

  constructor(
    private onboardingService: OnboardingService
  ) { }

  ngOnInit() {

  }

}
