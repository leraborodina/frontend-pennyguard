import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/dashboard.service';
import { UserData, UserService } from '../../shared/user.service';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  userData$!: Observable<UserData | null>;
  dashboardContent: string = '';

  constructor(private dashboardService: DashboardService, private userService: UserService, private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.userData$ = this.userService.getUserData();
    this.loadDashboardContent();
  }

  loadDashboardContent(): void {
    this.userData$.pipe(take(1)).subscribe((userData: UserData | null) => {
      // Assuming you want to extract the email from userData if available
      const userEmail = userData ? userData.email : this.cookieService.get('userEmail');
  
      this.dashboardService.getDashboard(userEmail).subscribe(
        (content: string) => {
          this.dashboardContent = JSON.stringify(content);
        },
        (error) => {
          console.error('Error fetching dashboard content:', error);
        }
      );
    });
  }
}
