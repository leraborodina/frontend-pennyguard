import { Observable, catchError, throwError } from "rxjs";
import { Limit } from "../../shared/interfaces/limit.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { urls } from "../../config/config";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class LimitService {
  private readonly transactionLimitEndpoint = `${urls.baseUrl}/transaction-limits`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

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

  getLimits(): Observable<Limit[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
    });

    return this.http
      .get<Limit[]>(this.transactionLimitEndpoint, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in fetching transaction limits:', error);
          return throwError(error);
        }),
      );
  }
}
