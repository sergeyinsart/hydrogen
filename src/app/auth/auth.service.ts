import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig} from './user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
    this.passwordToken = localStorage.getItem('token');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  currentUser: User;
  passwordToken: string;

  private static generateHeader(authString) {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  authString)
    };
  }

  createUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/v1/client`;

    const header = AuthService.generateHeader(`Bearer ${environment.apiCredentials  }`);

    return this.http.post(url, userData, header).toPromise()
      .then((user: User) => {
        this.currentUser = user;

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

    return this.http.get(url).toPromise()
      .then((data: {content: User[]}) => {
        const currentUser = data.content[0];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUser = currentUser;

        return this.currentUser;
      });
  }
}
