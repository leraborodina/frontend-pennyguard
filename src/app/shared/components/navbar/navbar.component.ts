import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/guards/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { UserService } from '../../services/user.service';

// Интерфейс для объекта с открытыми/закрытыми меню
interface DropdownMenus {
  [key: string]: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('notLoggedInMenu') notLoggedInMenu!: TemplateRef<any>;
  username: string | undefined;

  isNavbarCollapsed = true;
  isDropdownMenuOpen: DropdownMenus = {};


  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.initializeDropdownMenus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeAllDropdowns();
      }
    });
  }

  ngOnInit(): void {
    this.userService.getUsername().subscribe(username => {
      this.username = username;
    });
  }

  initializeDropdownMenus(): void {
    this.isDropdownMenuOpen = {
      transactions: false,
      limits: false,
      categories: false,
    };
  }


  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }


  toggleDropdownMenu(menu: string): void {
    this.isDropdownMenuOpen[menu] = !this.isDropdownMenuOpen[menu];
    this.closeOtherDropdowns(menu);
  }


  closeOtherDropdowns(currentMenu: string): void {
    Object.keys(this.isDropdownMenuOpen)
      .filter(menu => menu !== currentMenu)
      .forEach(menu => this.isDropdownMenuOpen[menu] = false);
  }


  closeAllDropdowns(): void {
    Object.keys(this.isDropdownMenuOpen)
      .forEach(menu => this.isDropdownMenuOpen[menu] = false);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.closeAllDropdowns();
  }
}
