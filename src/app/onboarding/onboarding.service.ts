import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AccountType} from './onboarding';
import {AuthService} from '../auth/auth.service';

const questionnaireId = 'b87dbd6a-2422-45d2-961b-759a8442e570';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getQuestions() {
    const url = `${environment.apiUrl}/nucleus/v1/questionnaire/${questionnaireId}`;

    return this.http.get(url).toPromise();
  }

  getAccountTypes() {
    const url = `${environment.apiUrl}/nucleus/v1/account_type`;

    return this.http.get(url).toPromise();
  }

  createAccount(accountType: AccountType) {
    const url = `${environment.apiUrl}/nucleus/v1/account`;

    const data = {
      name: accountType.name,
      account_type_id: accountType.id,
      clients: [{
        client_id: this.authService.currentUser.id,
        client_account_association_type: 'owner'
      }]
    };
    return this.http.post(url, data).toPromise();
  }
}
