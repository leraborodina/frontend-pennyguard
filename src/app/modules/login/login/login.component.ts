import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserData, UserService } from '../../../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Initialization logic, if needed
  }

  login(): void {
    // Subscribe to the login service
    this.authService.login(this.email, this.password).subscribe(
      // Handle successful login response
      (response: { token: string }) => {
        // If token is present, handle successful login
        response.token ? this.handleSuccessfulLogin(response.token) : this.handleLoginFailure();
      },
      // Handle login errors
      (error) => {
        // If the error is an HTTP error, handle it
        error instanceof HttpErrorResponse ? this.handleHttpError(error) : this.handleUnexpectedError(error);
      }
    );
  }

  private handleSuccessfulLogin(token: string): void {
    // Set the authentication token
    this.authService.setAuthToken(token);

    // Set user data
    const userData: UserData = { email: this.email };
    this.userService.setUserData(userData);

    // Navigate to the dashboard
    this.router.navigate(['/dashboard']);
  }

  private handleLoginFailure(): void {
    // Handle login failure logic here, if needed
    console.log('Login failed');
  }

  private handleUnexpectedError(error: any): void {
    // Log and display a generic error message for unexpected errors
    console.error('Unexpected error during login:', error);
    this.errorMessage = 'An unexpected error occurred during login.';
  }

  private handleHttpError(error: HttpErrorResponse): void {
    // Handle different HTTP error statuses with specific messages
    switch (error.status) {
      case 404:
        console.log('User not found:', error.error);
        this.errorMessage = 'User not found. Please check your email.';
        break;
      case 400:
        console.log('Invalid login credentials:', error.error);
        this.errorMessage = 'Invalid login credentials. Please try again.';
        break;
      default:
        // Log and display a generic error message for other HTTP errors
        console.error('Unexpected HTTP error during login:', error);
        this.errorMessage = 'An unexpected error occurred during login.';
    }
  }
}
