import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AccountType, ClientResponse} from './onboarding';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

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

  getAllocationByNodeId(id) {
    const url = `${environment.apiUrl}/nucleus/v1/allocation?filter=node_map.node_id==${id}`;

    return this.http.get(url).toPromise();
  }
}
