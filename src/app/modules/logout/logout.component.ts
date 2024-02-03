// app.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private authService: AuthService) {}

  /**
   * Checks if the user is authenticated.
   * @returns True if authenticated, false otherwise.
   */
  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this.authService.logout();
  }
}
