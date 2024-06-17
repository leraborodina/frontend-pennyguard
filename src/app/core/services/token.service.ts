import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string = '';

  constructor() { }

  /**
   * Устанавливает токен аутентификации.
   * @param token Устанавливаемый токен аутентификации.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Получает текущий сохраненный токен аутентификации.
   * @returns Токен аутентификации.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Проверяет, истек ли срок действия данного токена.
   * @param token Токен аутентификации, который необходимо проверить.
   * @returns True, если срок действия токена истек, в противном случае — false.
   */
  isTokenExpired(token: string): boolean {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationTimestamp: number = decodedToken.exp * 1000;
        const isExpired = Date.now() > expirationTimestamp;
        return isExpired;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    }

    return true;
  }
}
