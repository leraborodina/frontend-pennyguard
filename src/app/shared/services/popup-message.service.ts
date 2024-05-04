import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../interfaces/message.interface';
 

@Injectable({
  providedIn: 'root'
})
export class PopupMessageService {
  private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  constructor() { }

  addMessage(message: Message): void {
    const messages = this.messagesSubject.getValue();
    messages.push(message);
    this.messagesSubject.next(messages);
  }

  removeMessage(index: number): void {
    const messages = this.messagesSubject.getValue();
    messages.splice(index, 1);
    this.messagesSubject.next(messages);
  }
}
