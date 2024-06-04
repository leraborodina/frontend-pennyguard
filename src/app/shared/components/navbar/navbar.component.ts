import { Component, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/guards/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { TemplateRef } from '@angular/core';

// Интерфейс для объекта с открытыми/закрытыми меню
interface DropdownMenus {
  [key: string]: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @ViewChild('notLoggedInMenu') notLoggedInMenu!: TemplateRef<any>; // Ссылка на шаблон неавторизованного меню

  isNavbarCollapsed = true; // Флаг для сворачивания/разворачивания меню
  isDropdownMenuOpen: DropdownMenus = {}; // Объект для хранения состояний открытых/закрытых меню

  constructor(private authService: AuthService, private router: Router) {
    this.initializeDropdownMenus(); // Инициализируем состояния меню

    // Подписка на событие окончания навигации для закрытия всех открытых меню
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeAllDropdowns();
      }
    });
  }

  // Метод для инициализации состояний меню
  initializeDropdownMenus(): void {
    this.isDropdownMenuOpen = {
      transactions: false,
      limits: false,
      categories: false,
    };
  }

  // Метод для переключения состояния сворачивания/разворачивания навбара
  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  // Метод для переключения состояния открытости конкретного меню
  toggleDropdownMenu(menu: string): void {
    this.isDropdownMenuOpen[menu] = !this.isDropdownMenuOpen[menu];
    this.closeOtherDropdowns(menu); // Закрываем другие меню
  }

  // Метод для закрытия других открытых меню, кроме текущего
  closeOtherDropdowns(currentMenu: string): void {
    // Получение ключей всех меню, закрытие остальных исключая текущее
    Object.keys(this.isDropdownMenuOpen)
      .filter(menu => menu !== currentMenu)
      .forEach(menu => this.isDropdownMenuOpen[menu] = false);
  }

  // Метод для закрытия всех открытых меню
  closeAllDropdowns(): void {
    // Закрыть все меню
    Object.keys(this.isDropdownMenuOpen)
      .forEach(menu => this.isDropdownMenuOpen[menu] = false);
  }

  // Метод для проверки авторизации пользователя
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  // Метод для выхода из системы
  logout(): void {
    this.authService.logout();
  }

  // Обработчик события клика по документу для закрытия всех открытых меню
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.closeAllDropdowns();
  }
}
