import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      // User is not authenticated, redirect to the start page
      this.router.navigate(['/startpage']);
    } else {
      // User is authenticated, check for token expiration
      this.authService.checkTokenExpirationAndLogout();
    }
    return isAuthenticated;
  }
}
