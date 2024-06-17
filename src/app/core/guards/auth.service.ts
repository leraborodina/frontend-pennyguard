import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  map,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '../../config/config';
import { jwtDecode } from 'jwt-decode';
import { UserData, UserService } from '../../shared/services/user.service';
import { LoginResponse } from '../../shared/interfaces/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authEndpoint = `${urls.baseUrl}/auth`;
  private readonly TOKEN_KEY = 'authToken';
  private isUserAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isUserAuthenticated.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private redirectUrl!: string;

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string {
    return this.redirectUrl || '/dashboard';
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private userService: UserService,
  ) {
    this.isUserAuthenticated.next(this.isAuthenticated());
    this.initializeToken();
  }

  private initializeToken(): void {
    const storedToken = this.getAuthToken();
    this.tokenSubject.next(storedToken);
  }

  refreshToken(): Observable<any> {
    const oldToken = this.getAuthToken()!;
    const decodedToken: any = jwtDecode(oldToken);
    const userId: string = decodedToken.sub;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-UserId': userId,
    });

    return this.http
      .post<any>(`${this.authEndpoint}/refresh-token`, {}, { headers })
      .pipe(
        map((response: any) => {
          this.setAuthToken(response.token);
          return response;
        }),
        catchError((error) => {
          console.error('Error in refresh token request:', error);
          return throwError(error);
        }),
      );
  }

  login(
    email: string | null,
    password: string | null,
  ): Observable<LoginResponse> {
    const loginRequest = { email, password };
    return this.http
      .post<LoginResponse>(`${this.authEndpoint}/login`, loginRequest, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<LoginResponse>) => {
          if (response.body) {
            const userData: UserData = {
              email: response.body.email,
              firstname: response.body.firstname,
              lastname: response.body.lastname,
            };

            this.userService.setUserData(userData);
            return response.body;
          } else {
            throw new Error('Empty response body');
          }
        }),
        catchError((error: any) => {
          console.error('HTTP error:', error);
          throw error;
        }),
      );
  }

  getUserDetails() {
    const token = this.tokenService.getToken();
    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub;
  }

  setAuthenticationStatus(status: boolean): void {
    this.isUserAuthenticated.next(status);
  }

  setAuthToken(token: string): void {
    this.tokenService.setToken(token);
    this.cookieService.set(this.TOKEN_KEY, token);
    this.setAuthenticationStatus(true);
  }

  getAuthToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  isAuthenticated(): boolean {
    return this.checkTokenExpiration();
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.setAuthenticationStatus(false);
    this.router.navigate(['/startpage']);
  }

  checkTokenExpirationAndLogout(): void {
    if (!this.checkTokenExpiration()) {
      this.logout();
    }
  }

  checkTokenExpiration(): boolean {
    const authToken: string | null = this.getAuthToken();
    return authToken !== null && !this.tokenService.isTokenExpired(authToken);
  }
}
