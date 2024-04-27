import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, Subject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  private readonly snackQueue: Subject<{ message: string, type: 'info' | 'warning'| 'error' }[]> = new Subject<{ message: string, type: 'info' | 'warning' | 'error'}[]>();
  private isSnackOpen = false;
  private notificationQueue: { message: string, type: 'info' | 'warning' | 'error' }[] = [];

  constructor(private snackBar: MatSnackBar) {
    this.snackQueue
      .pipe(
        tap(() => this.isSnackOpen = true),
        switchMap(notifications => this.showNotifications(notifications)),
      )
      .subscribe(() => {
        if (this.notificationQueue.length) {
          const nextNotification = this.notificationQueue.shift()!;
          this.snackQueue.next([nextNotification]);
        } else {
          this.isSnackOpen = false;
        }
      });
  }

  showInfo(message: string): void {
    this.notificationQueue.push({ message, type: 'info' });
    if (!this.isSnackOpen) {
      const nextNotification = this.notificationQueue.shift()!;
      this.snackQueue.next([nextNotification]);
    }
  }

  
  showError(message: string): void {
    this.notificationQueue.push({ message, type: 'error' });
    if (!this.isSnackOpen) {
      const nextNotification = this.notificationQueue.shift()!;
      this.snackQueue.next([nextNotification]);
    }
  }

  showWarning(message: string): void {
    this.notificationQueue.push({ message, type: 'warning' });
    if (!this.isSnackOpen) {
      const nextNotification = this.notificationQueue.shift()!;
      this.snackQueue.next([nextNotification]);
    }
  }

  private showNotifications(notifications: { message: string, type: 'info' | 'warning' | 'error' }[]): Observable<MatSnackBarDismiss> {
    const { message, type } = notifications[0];
    const panelClass = type === 'info' ? 'info-snack' : 'warning-snack';
    return this.snackBar.open(message, 'Close', { duration: 5000, panelClass }).afterDismissed().pipe(
      tap(() => {
        if (this.notificationQueue.length) {
          const nextNotification = this.notificationQueue.shift()!;
          this.snackQueue.next([nextNotification]);
        } else {
          this.isSnackOpen = false;
        }
      })
    );
  }
}
