import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './core/guards/auth.service';
import { WebSocketService } from './core/services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  notification: string | null = null;
  notifications: string[] = [];

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
  ) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();

    this.webSocketService.connect();

    this.webSocketService.getMessages().subscribe((message) => {
      this.displayNotification(message);
    });
  }
  
  displayNotification(message: string) {
    // Add the message to the notifications array
    this.notifications.push(message);

    // Automatically dismiss the notification after 15 seconds
    setTimeout(() => {
      this.dismissNotification(message);
    }, 15000);
  }

  dismissNotification(message: string) {
    // Remove the notification from the notifications array
    const index = this.notifications.indexOf(message);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
  }
}
