import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { EventService } from './event.service';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string = '';

  constructor(private eventService: EventService) { }

  /**
   * Sets the authentication token.
   * @param token The authentication token to be set.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Gets the currently stored authentication token.
   * @returns The authentication token.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Checks if the given token is expired.
   * @param token The authentication token to be checked.
   * @returns True if the token is expired, false otherwise.
   */
  isTokenExpired(token: string): boolean {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationTimestamp: number = decodedToken.exp * 1000;
        const isExpired = Date.now() > expirationTimestamp;

        if (isExpired) {
          this.eventService.emitTokenExpired();
        }

        return isExpired;
      } catch (error) {
        console.error('Error decoding token:', error);
        return true;
      }
    }

    return true;
  }
}
