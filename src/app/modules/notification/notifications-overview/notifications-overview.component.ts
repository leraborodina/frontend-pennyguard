import { Component } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Notification } from '../../../shared/interfaces/notification.interface';

@Component({
  selector: 'app-notifications-overview',
  templateUrl: './notifications-overview.component.html',
  styleUrl: './notifications-overview.component.scss',
})
export class NotificationsOverviewComponent {
  notifications: Notification[] = [];
  constructor(private notificationService: NotificationService) {
    this.getNotifications();
  }

  getNotifications(): void {
    this.notificationService.getNotificationsByUserId().subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      },
    );
  }
}
