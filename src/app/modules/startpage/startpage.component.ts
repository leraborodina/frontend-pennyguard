import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.scss'
})
export class StartpageComponent {

  constructor(private authService: AuthService, private el: ElementRef, private router: Router) {
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
    this.el.nativeElement.querySelector(targetElement).scrollIntoView({ behavior: 'smooth' });
  }
}
