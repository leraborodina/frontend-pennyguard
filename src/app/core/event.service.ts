import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Event emitter for signaling token expiration
  tokenExpired = new EventEmitter<void>();

  /**
   * Emits a token expiration event.
   */
  emitTokenExpired(): void {
    // Trigger the token expiration event
    this.tokenExpired.emit();
  }
}
