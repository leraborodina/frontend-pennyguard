import { Component, OnInit } from '@angular/core';
import { Message } from '../../shared/interfaces/message.interface';
import { PopupMessageService } from '../../shared/services/popup-message.service';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class PopupMessageComponent implements OnInit {
  messages: Message[] = [];

  constructor(private popupMessageService: PopupMessageService) {}

  ngOnInit(): void {
    this.popupMessageService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  removeMessage(message: Message): void {
    const index = this.messages.indexOf(message);
    if (index !== -1) {
      this.popupMessageService.removeMessage(index);
    }
  }
}
