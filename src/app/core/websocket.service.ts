import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any;
  private messagesSubject: Subject<string> = new Subject<string>();

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        this.messagesSubject.next(message.body);
      });
    });
  }

  getMessages(): Observable<string> {
    return this.messagesSubject.asObservable();
  }
}
