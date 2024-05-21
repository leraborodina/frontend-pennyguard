import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionTypes: TransactionType[] = [];

  errorMessage: string = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTransactionTypes();
    this.getTransactions();
  }

  getTransactionTypes() {
    this.transactionService.getTransactionTypes().subscribe(
      (types: TransactionType[]) => {
        this.transactionTypes = types;
      },
      (error) => {
        console.error('Error fetching transaction types:', error);
        this.setErrorMessages(error);
      }
    );
  }

  getTransactions() {
    this.transactionService.getTransactionsByUserId().subscribe({
      next: (userTransactions: Transaction[]) => {
        this.transactions = userTransactions.slice(0, 3);
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.setErrorMessages(error);
      },
    });
  }

  getAmountColor(transaction: Transaction): string {
    const type = this.transactionTypes.find(
      (type) => type.id === transaction.typeId
    );
    return type?.type === 'доходы' ? 'green' : 'red';
  }

  setErrorMessages(error: any): void {
    this.errorMessage = 'Fehler beim Abrufen der Daten';
  }

  navigateToCreateTransaction(): void {
    this.router.navigate(['/create-transaction']);
  }

  getCategoryName(categoryId: number): string {
    return 'Kategorienname';
  }
}
