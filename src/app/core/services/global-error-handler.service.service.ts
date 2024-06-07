import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorNotificationService } from './error-notification.service.service';
import { AuthService } from '../guards/auth.service';


@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private errorNotificationService: ErrorNotificationService,
    private authService: AuthService,
  ) { }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status === 403) {
      const errorMessage = this.getErrorMessage(error);
      this.errorNotificationService.showError(errorMessage);

      this.authService.refreshToken().subscribe(
        (response) => {
          this.errorNotificationService.showInfo(
            'Your token was refreshed. Repeat your last action, please.',
          );
        },
        (error) => {
          const errorMessage = this.getErrorMessage(error);
          this.errorNotificationService.showError(errorMessage);
        },
      );
    } else if (error instanceof HttpErrorResponse && error.status === 404) {
      const errorMessage = this.getErrorMessage(error);
      this.errorNotificationService.showError(errorMessage);
    } else if (error instanceof HttpErrorResponse && error.status === 400) {
      const errorMessage = this.getErrorMessage(error);
      this.errorNotificationService.showError(errorMessage);
    } else {
      // TODO: handle other errors
      console.error('An error occurred:', error);
    }
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      // If the error is an instance of Error class, return the error message
      return error.error;
    } else {
      // If the error is not an instance of Error class, return a generic error message
      return 'An unexpected error occurred. Please try again later.';
    }
  }
}
