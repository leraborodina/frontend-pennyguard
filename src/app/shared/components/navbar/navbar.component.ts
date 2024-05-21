import { Component } from '@angular/core';
import { AuthService } from '../../../core/guards/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isNavbarCollapsed: boolean = true;
  isDropdownMenuOpen: { [key: string]: boolean };

  constructor(
    private authService: AuthService
  ) {
    this.isDropdownMenuOpen = {
      transactions: false,
      limits: false
    };
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggleDropdownMenu(menu: string): void {
    this.isDropdownMenuOpen[menu] = !this.isDropdownMenuOpen[menu];
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}
