import { Injectable } from '@angular/core';
import { urls } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
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
}
