import { Component } from '@angular/core';

import { User } from '../../../shared/user.model';
import { RegistrationService } from '../../../core/registration.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmedPassword = new FormControl('', [Validators.required]);
  successMessage = '';
  errorMessage = '';

  constructor(private registrationService: RegistrationService, private router: Router) { }
  
  // Method triggered when the registration form is submitted
  registerUser(): void {
    if (this.arePasswordsMatch()) {
      const userData = {
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        email: this.email.value,
        password: this.password.value
      };

      this.registrationService.registerUser(userData)
        .subscribe(
          (response) => this.handleSuccessResponse(response),
          (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
            }
          }
        );
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }

  // Check if the entered passwords match
    arePasswordsMatch(): boolean {
    return this.password.value === this.confirmedPassword.value;
  }

  // Handle successful registration response
  private handleSuccessResponse(response: HttpResponse<any>): void {
    if (response.status === 201) {
      this.firstname.setValue('');
            this.lastname.setValue('');
            this.email.setValue('');
            this.password.setValue('');
            this.confirmedPassword.setValue('');
      // Set success message based on the response data
      this.setSuccessMessage(response.body);
    }
  }

  // Set success message based on user data
  private setSuccessMessage(userData: any): void {
    try {
      const savedUserName = `${userData.firstname} ${userData.lastname}`;
      this.successMessage = `User ${savedUserName} registered successfully!`;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
    }
  }

  // Handle error response based on HTTP status code
  private handleErrorResponse(error: HttpErrorResponse): void {
    switch (error.status) {
      case 400:
        // Handle bad request errors (e.g., validation errors)
        this.handleBadRequest(error.error);
        break;
      case 500:
        // Handle internal server errors
        this.handleInternalServerError(error.error);
        break;
      // Add more cases as needed
      default:
        // Log unhandled status codes
        console.error('Unhandled status code:', error.status);
        break;
    }
  }

  // Handle bad request errors
  private handleBadRequest(errorMessage: any): void {
    if (errorMessage) {
      // Display detailed error message received from the server
      this.errorMessage = errorMessage;
      console.error('Bad request:', errorMessage);
    } else {
      // Display a generic error message for unexpected response format
      this.errorMessage = 'Bad request: Unexpected response format';
      console.error('Bad request: Unexpected response format', errorMessage);
    }
  }

  // Handle internal server errors
  private handleInternalServerError(response: any): void {
    // Display detailed error message received from the server
    console.error('Internal server error:', response.body);
    // Additional actions if needed
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
