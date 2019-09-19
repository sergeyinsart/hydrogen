import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig, Account} from './user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
    this.clientCredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJOL0EiXSwiZXhwIjoxNTY4OTAyMjQ4LCJhdXRob3JpdGllcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sImp0aSI6ImQ1ZjdhYmUxLTVjYjEtNDExMi05ZTU0LThhNGVhMGRjMzc0NiIsImNsaWVudF9pZCI6IjZxb2NicXZnNWhoejFocTVxd21lM21lZjdsIiwiYXBwcyI6Im51Y2xldXMscHJvdG9uLGVsZWN0cm9uLGludGVncmF0aW9uIn0.OgPJ0U5-yeIZr6g7dO-CrJgBqTQi48SyPrmXqHHoFVp1kVTwkfQSFNnlIgDs8M_cbUudfePNKqY06d6ioox8SQ4PICagHt8kg7JDz2xqB_ZCm68Ud8jcWg2uIFhoy2dP5MmJjJp7seHUtDyi003scbQk1jaQhUk-FjRpmTgUugbD5mDhRnG8-xJkQGAz645ADNv5tha-KZm42o3qmRcEGAmI6PxMcGdmTKKGUmdmGCvtTexpYtjnEfj_aUHW1KFQbOVydl75fiQJLuYAYce8k68Br3GRa72KZGZo1MRL1mHAG89nuKNftLyNev5huDdgEpXrDGqnYR6l2ifuAzsctw';
    this.passwordToken = localStorage.getItem('token');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  currentUser: User;
  passwordToken: string;
  clientCredToken: string;
  clientAccount: Account;

  private static generateHeader(authString) {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  authString)
    };
  }

  createUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/v1/client`;

    const header = AuthService.generateHeader(`Bearer ${environment.clientCredentialsToken  }`);

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


}
