import { Injectable } from '@angular/core';

import { urls } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsEndpoint = `${urls.baseUrl}/notifications`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  getNotificationsByUserId(): Observable<Notification[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    return this.http
      .get<Notification[]>(`${this.notificationsEndpoint}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in get notifications request:', error);
          return throwError(error);
        }),
      );
  }
}
