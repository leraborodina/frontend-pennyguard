import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Limit } from '../../shared/interfaces/limit.interface';
import { urls } from '../../config/config';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LimitService {
  private readonly limitEndpoint = `${urls.baseUrl}/transaction-limits`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  /**
   * Создает HTTP-заголовки для аутентификации.
   * @returns Объект HttpHeaders с заголовками аутентификации.
   */
  private getAuthHeaders(): HttpHeaders {
    const authToken = this.cookieService.get('authToken');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  /**
   * Создать лимит.
   * @param limit Объект Limit, который необходимо создать.
   * @returns Observable с объектом Limit или строкой ошибки.
   */
  createLimit(limit: Limit): Observable<Limit> {
    return this.http.post<Limit>(this.limitEndpoint, limit, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Получить все лимиты.
   * @returns Observable с массивом объектов Limit или строкой ошибки.
   */
  getLimits(): Observable<Limit[]> {
    return this.http.get<Limit[]>(this.limitEndpoint, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Получить лимит по ID.
   * @param id Идентификатор лимита.
   * @returns Observable с объектом Limit или строкой ошибки.
   */
  getLimitById(id: number): Observable<Limit> {
    return this.http.get<Limit>(`${this.limitEndpoint}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Обновить лимит.
   * @param limit Объект Limit, который необходимо обновить.
   * @returns Observable с объектом Limit или строкой ошибки.
   */
  updateLimit(limit: Limit): Observable<Limit> {
    return this.http.put<Limit>(`${this.limitEndpoint}/${limit.id}`, limit, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Удалить лимит по его идентификатору.
   * @param id Идентификатор лимита, который необходимо удалить.
   * @returns Observable с пустым результатом или строкой ошибки.
   */
  deleteLimit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.limitEndpoint}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  /**
   * Обрабатывает ошибки, возникающие при HTTP-запросах.
   * @param error Объект HttpErrorResponse с возникшей ошибкой.
   * @returns Observable, возвращающий строку ошибки.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    console.error('Ошибка в HTTP-запросе:', error);
    return throwError(errorMessage);
  }

  /**
   * Определяет сообщение об ошибке на основе объекта HttpErrorResponse.
   * @param error Объект HttpErrorResponse с возникшей ошибкой.
   * @returns Соответствующая строка сообщения об ошибке.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    let errorMessage = '';
    if (error.status === 409) {
      errorMessage = 'Лимит на данную категорию уже существует';
    } else if (error.status === 400) {
      errorMessage = error.error.message || 'Ошибка в запросе.';
    } else if (error.status === 500) {
      errorMessage = 'Внутренняя ошибка сервера';
    } else {
      errorMessage = 'Неизвестная ошибка';
    }
    return errorMessage;
  }
}
