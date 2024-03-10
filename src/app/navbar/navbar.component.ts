import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private authService: AuthService, private userService: UserService) {}

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserName(): string | null {
    const userData = this.userService.getUserData();
    return userData ? `${userData.firstname} ${userData.lastname}` : null;
  }

  logout(): void {
    this.authService.logout();
  }
}
