import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../shared/models/category.model';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { UserData, UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrl: './last-transactions.component.scss'
})
export class LastTransactionsComponent implements OnInit{

  transactions: Transaction[] = [];
  // categories:  Category[] = [];
  // transactionTypes: TransactionType[] = [];

  userData: UserData | null = null;
  subscription: Subscription | undefined;
  errorMessage: string = '';
  rowCounter: number = 0;

  constructor(
    private transactionService: TransactionService,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
  ){}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.subscription = this.transactionService
      .getTransactionsByUserId()
      .subscribe({
        next: (userTransactions: Transaction[]) => {
          this.transactions = userTransactions.slice(0, 5);
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
        this.errorMessage =
          'Resource not found. Please check your request and try again.';
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

  getAmountColorByTransactionType(transactionTypeId: number): string {
    return transactionTypeId == 1 ? 'red' : 'green';
  }
  
  getAmountWithSignAndColor(amount: number, transactionTypeId: number): string {
    const sign = transactionTypeId == 1 ? '-' : '+';
    const absAmount = Math.abs(amount);
    return `${sign}${absAmount}₽`;
  }

  getRowNumber(index: number): number {
    return index + 1;
  }

}
