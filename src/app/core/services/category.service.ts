import { Injectable } from '@angular/core';
import { urls } from '../../config/config';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesEndpoint = `${urls.baseUrl}/categories`;

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
   * Получает категории с сервера.
   * @returns Observable, возвращающий массив категорий.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoriesEndpoint}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Получает категории пользователя с сервера.
   * @returns Observable, возвращающий массив категорий.
   */
  getUserCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.categoriesEndpoint}/user`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Создает новую категорию на сервере.
   * @param category Создаваемая категория.
   * @returns Observable, возвращающий созданную категорию.
   */
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.categoriesEndpoint}`, category, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Обновляет существующую категорию на сервере.
   * @param category Обновляемая категория.
   * @returns Observable, возвращающий обновленную категорию.
   */
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.categoriesEndpoint}/${category.id}`, category, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Получает категорию по ее идентификатору с сервера.
   * @param id Идентификатор категории.
   * @returns Observable, возвращающий полученную категорию.
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesEndpoint}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(error => {
          return this.handleError(error);
        })
      );
  }

  /**
   * Удаляет категорию по ее идентификатору с сервера.
   * @param id Идентификатор категории.
   * @returns Observable, возвращающий void при успешном удалении.
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesEndpoint}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
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
      errorMessage = 'Категория уже существует.';
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
