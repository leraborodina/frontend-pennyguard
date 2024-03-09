import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { urls } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private registryEndpoint = `${urls.baseUrl}/user/register`;

  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param user The user object to be registered.
   * @returns An observable with the HTTP response.
   */
  registerUser(user: any): Observable<HttpResponse<any>> {
    // Make a POST request to the registration endpoint and observe the response
    return this.http
      .post<
        HttpResponse<any>
      >(this.registryEndpoint, user, { observe: 'response' })
      .pipe(
        catchError(this.handleError), // Handle errors using the private handleError method
      );
  }

  /**
   * Handles HTTP errors during registration.
   * @param error The error response.
   * @returns An observable with the error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Default error message for unexpected errors
    let errorMessage = 'An error occurred during registration.';

    // Check if the error is a client-side error
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message; // Extract client-side error message
    } else {
      errorMessage = error.error || errorMessage; // Extract server-side error message or use default
    }

    console.error(errorMessage); // Log the error message to the console
    return throwError(errorMessage); // Return an observable with the error message
  }
}
