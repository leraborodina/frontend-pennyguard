import { Component } from '@angular/core';

import { User } from '../../../shared/user.model';
import { RegistrationService } from '../../../core/registration.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  confirmedPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private registrationService: RegistrationService) { }
  
  // Method triggered when the registration form is submitted
  registerUser(): void {
    // Check if passwords match before proceeding with registration
    if (this.arePasswordsMatch()) {
      // Create a User object with the form input values
      const user = new User(this.firstname, this.lastname, this.email, this.password);

      // Call the registration service to register the user
      this.registrationService
        .registerUser(user)
        .subscribe(
          (response) => this.handleSuccessResponse(response),
          (error) => this.handleErrorResponse(error)
        );
    } else {
      // Display error message when passwords don't match
      this.errorMessage = "Passwords don't match";
    }
  }

  // Check if the entered passwords match
  private arePasswordsMatch(): boolean {
    return this.password === this.confirmedPassword;
  }

  // Handle successful registration response
  private handleSuccessResponse(response: HttpResponse<any>): void {
    if (response.status === 201) {
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
}
