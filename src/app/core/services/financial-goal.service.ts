import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { urls } from '../../config/config';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';

@Injectable({
  providedIn: 'root'
})
export class FinancialGoalService {
  private readonly goalsEndpoint = `${urls.baseUrl}/goals`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  createFinancialGoal(financialGoal: FinancialGoal): Observable<FinancialGoal> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .post<FinancialGoal>(this.goalsEndpoint, financialGoal, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error in financial goal create request:', error);
          return throwError(error);
        })
      );
  }


  getFinancialGoals(): Observable<FinancialGoal[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .get<FinancialGoal[]>(this.goalsEndpoint, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error in financial goal get request:', error);
          return throwError(error);
        })
      );
  }

  deleteGoalById(id: number): Observable<void> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .delete<void>(`${this.goalsEndpoint}/${id}`, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error in financial goal delete request:', error);
          return throwError(error);
        })
      );
  }
}
