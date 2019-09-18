import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, UserCredentialsConfig} from './user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
    this.passwordToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJOL0EiXSwiZXhwIjoxNTY4ODE1NTMyLCJhdXRob3JpdGllcyI6WyJST0xFX1NVUEVSX0FETUlOIl0sImp0aSI6ImJjMmYyNWM4LTMyMDEtNDdlMi05ZjE2LTczZTgzMDZiNDJkZSIsImNsaWVudF9pZCI6IjZxb2NicXZnNWhoejFocTVxd21lM21lZjdsIiwiYXBwcyI6Im51Y2xldXMscHJvdG9uLGVsZWN0cm9uLGludGVncmF0aW9uIn0.bGWU2IFEvpi0Rs9GYFBtsl97De1cSfyPTP2tt3shO-gJZxM2RtGt2rgD5fWMDurozoV2A3vxPIyzTD3--sglbMGpdbQEF-OwCa2FxtLhb3ScgdCi1oqX_vMMDXG2Yhjqr36PTLJRTlWZH3yS8VQk6VhZH9VCr7B5vAnKLiimM_7iMu9fG7kT40kh-oyymM6VZX7HPmyHzcVn6qXvuA_tjO1F0ef_4s5KyNKTFVeYgxbjaxcvT45IU05bOLf84-o2bEnHdoRpulp0KKkv_uOQcv0lXstKZ9I7Acs4-gW1l_s71R0SaKgsYBhh_OYn5DjjbQsvEiuG3LLL-7UWRj0OmQ'; //  localStorage.getItem('token');
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

    return this.http.get(url).toPromise()
      .then((data: {content: User[]}) => {
        const currentUser = data.content[0];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUser = currentUser;

        return this.currentUser;
      });
  }
}
