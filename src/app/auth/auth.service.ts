import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './user';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  constructor(private http: HttpClient) {}

  createUser(userData: User) {
    const url = `${environment.apiUrl}/nucleus/client`;
    return this.http.post(url, userData)
      .pipe(map((user: User) => {
        this.currentUser = user;
      }));
  }

  getToken() {
    const url = environment.apiUrl + '/authorization/v1/oauth/token?grant_type=client_credentials';

    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic NnFvY2Jxdmc1aGh6MWhxNXF3bWUzbWVmN2w6NnE3ZnpzZGNnb3BidjRueXdrcTNvbng4bDQ=}`)
    };

    return this.http.post(url, {}, header)
      .pipe(map((user: User) => {
        this.currentUser = user;
      }));
  }
}
