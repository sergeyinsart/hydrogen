import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import * as _get from 'lodash/get';

@Injectable({ providedIn: 'root' })

export class AppGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) {

  }

  canActivate() {
    return this.auth.getClient()
      .then(() => {
        if (!this.auth.currentUser.metadata.portfolioId) {
          this.router.navigate(['/questionnaire']);
          return false;
        } else {
          return true;
        }
      });
  }
}
