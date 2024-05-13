import { Injectable } from '@angular/core';
import { urls } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, throwError } from 'rxjs';
import { LimitType } from '../shared/models/limit-type.model';
import { Limit } from '../shared/models/limit.model';

@Injectable({
  providedIn: 'root',
})
export class LimitService {
  private readonly transactionLimitEndpoint = `${urls.baseUrl}/transaction-limits`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  createLimit(limit: Limit): Observable<Limit> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http
      .post<Limit>(this.transactionLimitEndpoint, limit, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in transaction limit create request:', error);
          return throwError(error);
        }),
      );
  }
}
