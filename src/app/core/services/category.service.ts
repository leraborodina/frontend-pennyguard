import { Injectable } from '@angular/core';
import { urls } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getCategories(): Observable<Category[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .get<Category[]>(`${this.categoriesEndpoint}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in get categories request:', error);
          return throwError(error);
        }),
      );
  }

  getUserCategories(): Observable<Category[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .get<Category[]>(`${this.categoriesEndpoint}/user`, { headers }) // Endpoint to get categories by user ID
      .pipe(
        catchError((error) => {
          console.error('Error in get user categories request:', error);
          return throwError(error);
        }),
      );
  }

  createCategory(category: Category): Observable<Category> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .post<Category>(`${this.categoriesEndpoint}`, category, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in create category request:', error);
          return throwError(error);
        }),
      );
  }

  updateCategory(category: Category): Observable<Category> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .put<Category>(`${this.categoriesEndpoint}/${category.id}`, category, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in update category request:', error);
          return throwError(error);
        }),
      );
  }

  getCategoryById(id: number): Observable<Category> {
    const authToken = this.cookieService.get('authToken');
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  
    return this.http
      .get<Category>(`${this.categoriesEndpoint}/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in get category by id request:', error);
          return throwError(error);
        }),
      );
  }  

  deleteCategory(id: number): Observable<void> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .delete<void>(`${this.categoriesEndpoint}/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in delete category request:', error);
          return throwError(error);
        }),
      );
  }
}
