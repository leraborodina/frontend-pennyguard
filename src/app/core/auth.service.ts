// auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authEndpoint = `${urls.baseUrl}/auth`;
  private readonly TOKEN_KEY = 'authToken';

  // BehaviorSubject to keep track of user authentication status
  private isUserAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isUserAuthenticated.asObservable();

  private ROUTING_KEY = 'saved_routing';

  // BehaviorSubject to keep track of the authentication token
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private cookieService: CookieService
  ) {
    // Initialize authentication state based on token presence
    this.isUserAuthenticated.next(this.isAuthenticated());
    this.initializeToken();
  }

  private initializeToken(): void {
    // Retrieve and set the stored authentication token
    const storedToken = this.getAuthToken();
    this.tokenSubject.next(storedToken);
  }

  login(email: string | null, password: string | null): Observable<{ token: string }> {
    // Send a login request and return the observable with the token response
    const loginRequest = { email, password };
    return this.http.post<{ token: string }>(`${this.authEndpoint}/login`, loginRequest);
  }

  setAuthenticationStatus(status: boolean): void {
    // Update the authentication status
    this.isUserAuthenticated.next(status);
  }

  setAuthToken(token: string): void {
    // Set the authentication token in both the token service and cookie service
    this.tokenService.setToken(token);
    this.cookieService.set(this.TOKEN_KEY, token);
    this.setAuthenticationStatus(true);
  }

  getAuthToken(): string | null {
    // Retrieve the authentication token from the cookie service
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  isAuthenticated(): boolean {
    // Check if the user is authenticated based on the presence of the authentication token
    return !!this.getAuthToken();
  }

  logout(): void {
    // Delete the authentication token, update authentication status, and navigate to login page
    this.cookieService.delete(this.TOKEN_KEY);
    this.setAuthenticationStatus(false);
    this.router.navigate(['/login']);
  }

  checkTokenExpiration(): boolean {
    // Retrieve the authentication token from the cookie service
    const authToken: string | null = this.getAuthToken();
  
    // Check if the authentication token is expired using the token service
    return authToken !== null && !this.tokenService.isTokenExpired(authToken);
  }
  

  // Routing Management
  saveRouting(url: string): void {
    // Save the current routing information in local storage
    localStorage.setItem(this.ROUTING_KEY, url);
  }

  getSavedRouting(): string | null {
    // Retrieve saved routing information from local storage
    return localStorage.getItem(this.ROUTING_KEY);
  }

  clearSavedRouting(): void {
    // Remove saved routing information from local storage
    localStorage.removeItem(this.ROUTING_KEY);
  }
}
