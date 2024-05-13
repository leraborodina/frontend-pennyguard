import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { UserData } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrl: './last-transactions.component.scss',
})
export class LastTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];

  userData: UserData | null = null;
  subscription: Subscription | undefined;
  errorMessage: string = '';
  rowCounter: number = 0;

  constructor(
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.subscription = this.transactionService
      .getTransactionsByUserId()
      .subscribe({
        next: (userTransactions: Transaction[]) => {
          const lastTransations = userTransactions.slice(0, 5);
          this.transactions = lastTransations.map((transaction) =>
            this.transactionService.mapTransactionFromBackend(transaction),
          );
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

    this.showErrorMessage(this.errorMessage);
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
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
