import {Component, OnInit, ViewChild} from '@angular/core';
import {OnboardingService} from '../onboarding.service';
import {ActivatedRoute} from '@angular/router';
import {ClientResponse, Question} from '../onboarding';
import {MatHorizontalStepper, MatSnackBar} from '@angular/material';
import * as _sortBy from 'lodash/sortBy';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

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
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.questions = _sortBy(route.snapshot.data.questionnaire.questions, (a => a.order_index));
  }

  ngOnInit() {
    const group: any = {};

    this.questions.forEach(question => {
      group[question.id] = new FormControl('');
    });

    this.form =  new FormGroup(group);
  }

  submit() {

  }

  nextStep(question: Question) {
    const answerId = this.form.value[question.id];

    const response: ClientResponse = {
      client_id: this.authService.currentUser.id,
      answer_id: question.id,
      answer_value: question.answers.find(a => a.id === answerId).value
    };

    this.onboardingService.createClientResponse(response)
      .then(() => {
        this.stepper.next();
      })
      .catch(() => {
        // TODO - correct error message
        this.snackBar.open('error');
      });
  }

}
