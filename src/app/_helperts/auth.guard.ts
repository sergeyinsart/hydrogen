import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import * as _get from 'lodash/get';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.auth.passwordToken) {
      return Promise.all([this.auth.getClient(), this.auth.getClientAccount()])
        .then(() => {
          if (!this.auth.currentUser) {
            this.router.navigate(['/login']);
            return false;
          } else if (!this.auth.clientAccount) {
            this.router.navigate(['/choose-account-type']);
            return false;
          } else {
            return true;
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
