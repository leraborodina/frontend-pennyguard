import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserData, UserService } from '../../../shared/services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { LoginResponse } from '../../../shared/interfaces/loginresponse.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Initialization logic, if needed
  }

  login(): void {
    // Subscribe to the login service
    this.authService.login(this.email.value, this.password.value).subscribe(
      // Handle successful login response
      (response: LoginResponse) => {
        // Extract the token from the response body
        const token = response.token;

        // If token is present, handle successful login
        if (token) {
          this.handleSuccessfulLogin(token);
        } else {
          this.handleLoginFailure();
        }
      },
      // Handle login errors
      (error) => {
        // If the error is an HTTP error, handle it
        if (error instanceof HttpErrorResponse) {
          this.handleHttpError(error);
        } else {
          this.handleUnexpectedError(error);
        }
      },
    );
  }

  private handleSuccessfulLogin(token: string): void {
    // // Set the authentication token
    // this.authService.setAuthToken(token);

    // // Navigate to the transaction-overview
    // this.router.navigate(['/transaction-overview']);

    // Set the authentication token
    this.authService.setAuthToken(token);

    // Navigate to the saved url or transaction-overview
    const redirectUrl = this.authService.getRedirectUrl();
    this.router.navigate([redirectUrl]);
  }

  private handleLoginFailure(): void {
    // Handle login failure logic here, if needed
    console.log('Login failed');
  }

  private handleUnexpectedError(error: any): void {
    // Log and display a generic error message for unexpected errors
    console.error('Unexpected error during login:', error);
  }

  private handleHttpError(error: HttpErrorResponse): void {
    // Handle different HTTP error statuses with specific messages
    switch (error.status) {
      case 404:
        console.log('User not found:', error.error);
        this.email.setErrors({ notFound: true, message: error.error });
        break;
      case 400:
        console.log('Invalid login credentials:', error.error);
        this.password.setErrors({
          invalidCredentials: true,
          message: error.error,
        });
        break;
      default:
        // Log and display a generic error message for other HTTP errors
        console.error('Unexpected HTTP error during login:', error);
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.email.hasError(errorName);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Обязательное поле';
    }

    return this.email.hasError('email') ? 'Неверная почта' : '';
  }

  redirectToRegistry(): void {
    this.router.navigate(['/registration']);
  }
}
