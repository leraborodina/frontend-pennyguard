import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../core/websocket.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {

  notifications: any[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    // Subscribe to WebSocket messages
    this.websocketService.connect('ws://localhost:8080/ws/notifications').subscribe(
      (message) => {
        console.log('Received message from server:', message);
        // Handle incoming message (e.g., update UI)
        // Example: Add new notification to the list
        this.notifications.push(JSON.parse(message));
      },
      (error) => {
        console.error('WebSocket error:', error);
        // Handle error
      },
      () => {
        console.log('WebSocket connection closed');
        // Handle connection closed
      }
    );
  }
}
