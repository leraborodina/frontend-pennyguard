import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CardData } from './card-data';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardData: CardData[] = [];

  constructor(private router: Router) { }

  navigate(targetRoute: string): void {
    this.router.navigate([targetRoute]);
  }
}
