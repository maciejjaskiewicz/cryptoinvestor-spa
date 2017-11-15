import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate() {
    return this.isAuthorized();
  }

  canLoad() {
    return this.isAuthorized();
  }

  private isAuthorized() {
    if (this.authService.authenticated) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
