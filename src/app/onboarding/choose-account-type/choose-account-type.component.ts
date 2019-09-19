import { Component, OnInit } from '@angular/core';
import {OnboardingService} from '../onboarding.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountType} from '../onboarding';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../auth/auth.service';
import {Account} from '../../auth/user';
import * as _update from 'lodash/update';

@Component({
  selector: 'app-choose-account-type',
  templateUrl: './choose-account-type.component.html',
  styleUrls: ['./choose-account-type.component.scss']
})
export class ChooseAccountTypeComponent implements OnInit {
  accountTypes: AccountType[];
  private icons: { investment: string; savings: string };

  constructor(
    private onboardingService: OnboardingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.accountTypes = route.snapshot.data.accountTypes.content;

    this.icons = {
      investment: 'loop',
      savings: 'save'
    };
  }

  ngOnInit() {
  }

  selectAccountType(accountType: AccountType) {
    this.onboardingService.createAccount(accountType)
      .then((account: Account) => {
        const updatedUser = {...this.auth.currentUser};
        _update(updatedUser, 'metadata.accountId', () => account.id);

        return this.auth.updateUser(updatedUser);
      })
      .then(() => {
        this.router.navigate(['/questionnaire']);
      })
      .catch(() => {
        // TODO need to add correct error message
        this.snackBar.open('Error');
      });
  }

}
