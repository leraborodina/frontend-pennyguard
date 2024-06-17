import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../core/guards/auth.service';
import { Router } from '@angular/router';
import { CardData, cardData } from './feature-card/card-data';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss']
})
export class StartpageComponent implements OnInit {
  cardData: CardData[] = [];

  constructor(
    private authService: AuthService,
    private el: ElementRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cardData = cardData;
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  navigate(targetRoute: string): void {
    if (this.isLoggedIn()) {
      this.router.navigate([targetRoute]);
    } else {
      this.authService.setRedirectUrl(targetRoute);
      this.router.navigate(['/login']);
    }
  }

  scrollToElement(targetElement: string): void {
    this.el.nativeElement
      .querySelector(targetElement)
      .scrollIntoView({ behavior: 'smooth' });
  }
}
