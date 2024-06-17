import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { urls } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private registryEndpoint = `${urls.baseUrl}/user/register`;

  constructor(private http: HttpClient) { }

  /**
   * Регистрирует нового пользователя.
   * @param user Объект пользователя, который необходимо зарегистрировать.
   * @returns Наблюдаемая переменная с HTTP-ответом.
   */
  registerUser(user: any): Observable<HttpResponse<any>> {
    return this.http
      .post<
        HttpResponse<any>
      >(this.registryEndpoint, user, { observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Обрабатывает ошибки HTTP во время регистрации.
   * @param error Ответ об ошибке.
   * @returns Наблюдаемый объект с сообщением об ошибке.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during registration.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error || errorMessage;
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
