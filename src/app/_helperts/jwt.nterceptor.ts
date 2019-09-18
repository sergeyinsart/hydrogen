import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';

// TODO need to catch errors and show error message

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  private static generateHeader(request, token) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const isLoggedIn = this.authService.passwordToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isClientCred = request.url.startsWith(environment.apiUrl + '/nucleus/v1/node');

    if (isLoggedIn && isApiUrl) {
      if (isClientCred) {
        request = JwtInterceptor.generateHeader(request, this.authService.clientCredToken);
      } else {
        request = JwtInterceptor.generateHeader(request, this.authService.passwordToken);
      }

    }

    return next.handle(request);
  }
}
