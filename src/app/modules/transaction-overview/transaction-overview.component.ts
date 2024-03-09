import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/transaction.model';
import { TransactionService } from '../../core/transaction.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
})
export class TransactionOverviewComponent implements OnInit {
  transactions: Transaction[] = [];
  subscription: Subscription | undefined;

  errorMessage: string = '';  

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.verifyTokenAndFetchTransactions();
  }

  verifyTokenAndFetchTransactions() {
    if (this.authService.checkTokenExpiration()) {
      // Token is valid, proceed to fetch transactions
      this.getTransactions();
    } else {
      console.log('Token is expired or invalid. Redirecting to login page...');
      this.router.navigate(['/login']);
    }
  }

  getTransactions() {
    const token = this.cookieService.get('authToken');
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.sub;

    this.subscription = this.transactionService
      .getTransactionsByUserId(userId)
      .subscribe({
        next: (userTransactions: Transaction[]) => {
          this.transactions = userTransactions;
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
          this.setErrorMessages(error);
        },
      });
  }

  setErrorMessages(error: any): void {
    switch (error?.status) {
        case 404:
          this.errorMessage = 'Resource not found. Please check your request and try again.';
          break;
        case 401:
          this.errorMessage = 'Unauthorized. Please login again to continue.';
          break;
        case 500:
          this.errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          this.errorMessage = 'An error occurred. Please try again later.';
          break;
    }

    // Show error message using MatSnackBar
    this.showErrorMessage(this.errorMessage);
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration for which the snackbar will be displayed
      panelClass: ['error-snackbar'], // Add custom CSS class for styling
    });
  }
}
