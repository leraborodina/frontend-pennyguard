import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { WebsocketService } from './core/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private websocketService: WebsocketService) {}

  ngOnInit() {
    // Check the authentication status when the component initializes
    this.isAuthenticated = this.authService.isAuthenticated();

    this.websocketService.connect('ws://localhost:8080/ws/notifications').subscribe(
      (message: any) => {
        console.log('Received message from server:', message);
        // Handle incoming message (e.g., update UI)
      },
      (error: any) => {
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
