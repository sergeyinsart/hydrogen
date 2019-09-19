import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig, Account} from './user';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientAccount: Account;
  constructor(
    private http: HttpClient,
    private router: Router
    ) {
    this.clientCredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJOL0EiXSwiZXhwIjoxNTY4OTgzMTg0LCJhdXRob3JpdGllcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sImp0aSI6ImYxNTk0M2NhLTg3OGQtNGRlOS05ZTJhLTkzZThkNWNjNWVmMiIsImNsaWVudF9pZCI6IjZxb2NicXZnNWhoejFocTVxd21lM21lZjdsIiwiYXBwcyI6Im51Y2xldXMscHJvdG9uLGVsZWN0cm9uLGludGVncmF0aW9uIn0.bkb1KyTKGRokIJSVCoHWlchm2BfABmj-U4uN_vRjj0-VIa6BotsJVWLdHuOJqxC2yp-NguMx92g8RTEySCyySaOmvwwA6PCFQ7EvgTT153pmO_ycqsZeBOCIInd0SIlEemGqehKajUGNtqy5xU2CEY5Wg2mdIySmjr_hyzJj6U8Aeo5-EazRc3vymokteTTyiQzvVpJHW8Eo_O1l8Lvy_v-DPW6vhLB4HMZ5y4fmSNSNe5QejpGt7QwMEtmWv5E54U4TghyXsZ_T7zdQljxAuWYRB7UFyt8GO3A4g0qn9lhU1th7GI_oSxpmeK-CvgdnafDX7vcJeocLojDe2yagHQ';
    this.passwordToken = localStorage.getItem('token');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  currentUser: User;
  passwordToken: string;
  clientCredToken: string;

  private static generateHeader(authString) {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  authString)
    };
  }

  createUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/v1/client`;

    return this.http.post(url, userData).toPromise()
      .then((user: User) => {
        this.currentUser = user;

        return user;
      });
  }

  updateUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/v1/client/${this.currentUser.id}`;
    delete userData.id;

    return this.http.put(url, userData).toPromise()
      .then((user: User) => {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return user;
      });
  }

  createPassword(username, password) {
    const url = `${environment.apiUrl}/admin/v1/client`;

    const header = AuthService.generateHeader(`Bearer ${environment.clientCredentialsToken}`);

    const userCredentials = new UserCredentialsConfig(username, password);

    return this.http.post(url, userCredentials, header).toPromise();
  }

  login(username, password) {
    const httpParams = new HttpParams()
      .append('username', username)
      .append('password', password)
      .append('grant_type', 'password');

    const url = environment.apiUrl + '/authorization/v1/oauth/token';

    const header = AuthService.generateHeader( `Basic ${environment.apiCredentials}`);

    return this.http.post(url, {}, {
      headers: header.headers,
      params: httpParams
    }).toPromise()
      .then((data: any) => {
        this.passwordToken = data.access_token;
        localStorage.setItem('token', data.access_token);
        return data;
      });
  }

  getClient() {
    const url = environment.apiUrl + '/nucleus/v1/client';

    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }

    return this.http.get(url).toPromise()
      .then((data: {content: User[]}) => {
        const currentUser = data.content[0];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUser = currentUser;

        return this.currentUser;
      });
  }

  getClientAccount(): Promise<Account> {
    const url = `${environment.apiUrl}/nucleus/v1/account`;

    if (this.clientAccount) {
      return Promise.resolve(this.clientAccount);
    }

    return this.http.get(url).toPromise()
      .then((data: {content: Account}) => {
        this.clientAccount = data.content && data.content[0];

        return this.clientAccount;
      });
  }

  logout() {
    this.currentUser = null;
    this.passwordToken = null;

    localStorage.clear();

    this.router.navigate(['/login']);
  }

  get showNavbar() {
    return !!this.currentUser;
  }

}
