import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { urls } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly dashboardEndpoint = `${urls.baseUrl}/dashboard`;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getDashboard(email: string): Observable<string> {
    // Assuming you have stored the JWT token in localStorage
    const authToken = this.cookieService.get('authToken');

    // Create headers with the Authorization token and user email
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-User-Email': email // Add the user's email to the headers
    });

    // Make the HTTP request to the backend endpoint to get the dashboard data
    return this.http.get<string>(this.dashboardEndpoint, { headers }).pipe(
      catchError(error => {
        console.error('Error in dashboard request:', error);
        return throwError(error);
      })
    );
  }
}
