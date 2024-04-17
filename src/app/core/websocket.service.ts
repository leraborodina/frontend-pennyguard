import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
  private websocket: WebSocket = new WebSocket('');

  constructor() { }

  public connect(url: string): Observable<any> {
    this.websocket = new WebSocket(url);

    return new Observable(observer => {
      this.websocket.onmessage = (event) => {
        observer.next(event.data);
      };

      this.websocket.onerror = (event) => {
        observer.error(event);
      };

      this.websocket.onclose = (event) => {
        observer.complete();
      };
    });
  }

  public send(message: any) {
    this.websocket.send(JSON.stringify(message));
  }

  public close() {
    this.websocket.close();
  }
}