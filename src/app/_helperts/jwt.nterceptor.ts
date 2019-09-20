import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

// TODO need to catch errors and show error message

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private isRefreshing = false;

  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private static addBasicToken(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        Authorization: `Basic ${environment.apiCredentials}`
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isLoggedIn = this.authService.passwordToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isClientCred = request.url.startsWith(environment.apiUrl + '/nucleus/v1/node')
      || request.url.startsWith(environment.apiUrl + '/nucleus/v1/model')
      || request.url.startsWith(environment.apiUrl + '/admin/v1/client')
      || (request.url.startsWith(environment.apiUrl + '/nucleus/v1/client') && (request.method === 'POST' || request.method === 'PUT'));
    const isAuth = request.url.startsWith(environment.apiUrl + '/authorization');

    if (isAuth) {
      request = JwtInterceptor.addBasicToken(request);
      return next.handle(request);
    }

    if (isClientCred) {
      if (this.authService.clientCredToken) {
        request = JwtInterceptor.addToken(request, this.authService.clientCredToken);
        return next.handle(request).pipe(catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(request, next);
          } else {
            return throwError(error);
          }
        }));
      } else {
        return this.handle401Error(request, next);
      }

    } else if (isLoggedIn && isApiUrl) {
      request = JwtInterceptor.addToken(request, this.authService.passwordToken);
      return next.handle(request);
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshClientCredToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(JwtInterceptor.addToken(request, token.access_token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(JwtInterceptor.addToken(request, jwt));
        }));
    }
  }
}
