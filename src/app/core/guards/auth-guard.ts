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

  /**
   * Метод для проверки подлинности пользователя перед переходом к маршруту.
   * 
   * @returns true, если пользователь аутентифицирован.
   */
  canActivate(): boolean {
    // Проверка, аутентифицирован ли пользователь; если нет, перенаправить на страницу входа.
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Пользователь аутентифицирован, разрешить переход по запрошенному маршруту.
    return true;
  }

  /**
   * Метод проверки статуса аутентификации пользователя на основе срока действия токена.
   * @returns true, если пользователь аутентифицирован.
   */
  private isAuthenticated(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    return false;
  }
}
