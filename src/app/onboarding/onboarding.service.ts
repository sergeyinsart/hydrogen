import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AccountType, ClientResponse} from './onboarding';
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

  createClientResponse(clientResponse: ClientResponse) {
    const url = `${environment.apiUrl}/nucleus/v1/client_response`;

    return this.http.post(url, clientResponse).toPromise();
  }

  getDecisionTree() {
    const url = `${environment.apiUrl}/nucleus/v1/decision_tree/3396e7f6-5686-4e0f-b615-5cd12b2f4cde`;

    return this.http.get(url).toPromise();
  }

  getAllocationList() {
    const url = `${environment.apiUrl}/nucleus/v1/allocation`;

    return this.http.get(url).toPromise();
  }

  getAllocation(id) {
    const url = `${environment.apiUrl}/nucleus/v1/allocation?filter=node_map.node_id==${id}`;

    return this.http.get(url).toPromise();
  }

  performance() {
    const url = `${environment.apiUrl}/nucleus/v1/allocation/604e8aec-4b20-427c-8a71-48713dc92439/performance?stat=monte_carlo`;

    return this.http.get(url).toPromise();
  }
}
