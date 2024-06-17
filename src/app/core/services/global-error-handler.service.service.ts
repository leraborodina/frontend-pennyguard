import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorNotificationService } from './error-notification.service';
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
        () => {
          this.errorNotificationService.showInfo(
            'Ваш токен обновлен. Повторите последнее действие, пожалуйста.',
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
      console.error('Произошла ошибка:', error);
    }
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return error.error;
    } else {
      return 'Произошла ошибка. Пожалуйста, повторите попытку позже.';
    }
  }
}
