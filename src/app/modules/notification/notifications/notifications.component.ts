import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input() message!: string;
  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  dismissNotification(): void {
    this.dismiss.emit();
  }
}
