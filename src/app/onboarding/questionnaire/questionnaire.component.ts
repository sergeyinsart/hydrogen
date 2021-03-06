import {Component, OnInit, ViewChild} from '@angular/core';
import {OnboardingService} from '../onboarding.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientResponse, Question} from '../onboarding';
import {MatHorizontalStepper, MatSnackBar} from '@angular/material';
import * as _sortBy from 'lodash/sortBy';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {QuestionnaireService} from './questionnaire.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  private questions: Question[];

  @ViewChild('stepper', {static: false}) stepper: MatHorizontalStepper;
  form: FormGroup;

  constructor(
    private onboardingService: OnboardingService,
    private questionnaireService: QuestionnaireService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.questions = _sortBy(route.snapshot.data.questionnaire.questions, (a => a.order_index));
  }

  ngOnInit() {
    const group: any = {};

    this.questions.forEach(question => {
      group[question.id] = new FormControl('', Validators.required);
    });

    this.form =  new FormGroup(group);
  }

  submit() {

  }

  nextStep(question: Question) {
    const currentStepControl = this.form.controls[question.id];
    if (currentStepControl.status !== 'VALID') {
      this.stepper.next();

      return;
    }

    const answerValue = this.form.value[question.id];
    const answerObj = question.question_type === 'radio' ? question.answers.find(a => a.value === answerValue) : question.answers[0];
    const answerId = answerObj.id;

    const response: ClientResponse = {
      client_id: this.authService.currentUser.id,
      answer_id: answerId,
      answer_value: answerValue,
      secondary_id: question.metadata.secondary_id,
    };

    this.questionnaireService.createClientResponse(response)
      .then(() => {
        this.form.status === 'INVALID' ? this.stepper.next() : this.defineAllocation();
      })
      .catch(() => {
        // TODO - correct error message
        this.snackBar.open('error');
      });
  }

  private defineAllocation() {
    this.router.navigate(['/portfolio-recommendation']);
  }
}
