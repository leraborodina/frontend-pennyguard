import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Создать лимит
  createLimit(limit: Limit): Observable<Limit> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http.post<Limit>(this.limitEndpoint, limit, { headers }).pipe(
      catchError((error) => {
        console.error('Error in creating limit:', error);
        throw error;
      })
    );
  }

  // Получить все лимиты
  getLimits(): Observable<Limit[]> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http.get<Limit[]>(this.limitEndpoint, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching limits:', error);
        throw error;
      })
    );
  }

  // Получить лимит по ID
  getLimitById(id: number): Observable<Limit> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http.get<Limit>(`${this.limitEndpoint}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Error fetching limit with ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Обновить лимит
  updateLimit(limit: Limit): Observable<Limit> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http.put<Limit>(`${this.limitEndpoint}/${limit.id}`, limit, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating limit:', error);
        throw error;
      })
    );
  }

  // Удалить лимит
  deleteLimit(id: number): Observable<void> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http.delete<void>(`${this.limitEndpoint}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Error deleting limit with ID ${id}:`, error);
        throw error;
      })
    );
  }
}
