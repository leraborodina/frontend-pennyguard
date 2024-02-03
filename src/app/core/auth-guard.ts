// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  // This method is called to check if the user is authenticated before navigating to a route
  canActivate(): boolean {
    // Check if the user is authenticated; if not, navigate to the login page
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // User is authenticated, allow navigation to the requested route
    return true;
  }

  // Private method to check user authentication status based on custom logic
  private isAuthenticated(): boolean {
    // Check if the user is authenticated and the authentication token is still valid
    if (this.authService.isAuthenticated() && this.authService.checkTokenExpiration()) {
      // User is authenticated
      return true;
    }

    // User is not authenticated
    return false;
  }
}
