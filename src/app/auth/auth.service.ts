import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig} from './user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  currentUser: User;
  private tempToken: string;

  private static generateHeader(authString) {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  authString)
    };
  }

  createUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/v1/client`;

    return this.getToken()
      .then(() => {
        const header = AuthService.generateHeader(`Bearer ${this.tempToken}`);

        return this.http.post(url, userData, header).toPromise();
      })
      .then((user: User) => {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        return user;
      });
  }

  createPassword(username, password) {
    const url = `${environment.apiUrl}/admin/v1/client`;

    const header = AuthService.generateHeader(`Bearer ${this.tempToken}`);

    const userCredentials = new UserCredentialsConfig(username, password);

    return this.http.post(url, userCredentials, header).toPromise()
      .then(() => {
        this.tempToken = null;
        });
  }

  private getToken() {
    if (this.tempToken) {
      return Promise.resolve(this.tempToken);
    }

    const url = environment.apiUrl + '/authorization/v1/oauth/token?grant_type=client_credentials';

    const header = AuthService.generateHeader( `Basic ${environment.apiCredentials}`);

    return this.http.post(url, {}, header).toPromise()
      .then((data: any) => {
        this.tempToken = data.access_token;
        return this.tempToken;
      });
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
        this.tempToken = data.access_token;
        return this.tempToken;
      });
  }
}
