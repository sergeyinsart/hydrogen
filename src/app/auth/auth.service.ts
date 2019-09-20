import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig, Account} from './user';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientAccount: Account;
  constructor(
    private http: HttpClient,
    private router: Router
    ) {
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

    return this.http.post(url, userData).toPromise();
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

    const userCredentials = new UserCredentialsConfig(username, password);

    return this.http.post(url, userCredentials).toPromise();
  }

  login(username, password) {
    const httpParams = new HttpParams()
      .append('username', username)
      .append('password', password)
      .append('grant_type', 'password');

    const url = environment.apiUrl + '/authorization/v1/oauth/token';

    return this.http.post(url, {}, {
      params: httpParams
    }).toPromise()
      .then((data: any) => {
        this.passwordToken = data.access_token;
        localStorage.setItem('token', data.access_token);
        return data;
      });
  }

  refreshClientCredToken() {
    const httpParams = new HttpParams()
      .append('grant_type', 'client_credentials');

    const url = environment.apiUrl + '/authorization/v1/oauth/token';

    return this.http.post(url, {}, {
      params: httpParams
    }).pipe(tap((data: any) => {
      this.clientCredToken = data.access_token;
    }));
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
