import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../shared/models/category.model';
import { UserData, UserService } from '../../shared/services/user.service';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
})
export class TransactionOverviewComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  userData: UserData | null = null;
  subscription: Subscription | undefined;
  errorMessage: string = '';

  // Form controls for filtering
  searchControl = new FormControl('');
  categoriesControl = new FormControl();
  transactionTypeControl = new FormControl();
  minAmountControl = new FormControl(Validators.min(0));
  maxAmountControl = new FormControl();
  minDateControl = new FormControl();
  maxDateControl = new FormControl();

  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'amount',
    'actions',
  ];
  dataSource = new MatTableDataSource<Transaction>();
  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.getCategories();
    this.getTransactionTypes();
    this.verifyTokenAndFetchTransactions();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (content: Category[]) => {
        this.categories = content;
      },
      (error) => {
        this.handleError('Error fetching categories:', error);
      },
    );
  }

  getTransactionTypes(): void {
    this.transactionService.getTransactionTypes().subscribe(
      (content: TransactionType[]) => {
        this.transactionTypes = content;
      },
      (error) => {
        this.handleError('Error fetching transaction types:', error);
      },
    );
  }

  verifyTokenAndFetchTransactions(): void {
    if (this.authService.checkTokenExpiration()) {
      this.getTransactions();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getTransactions(): void {
    this.subscription = this.transactionService
      .getTransactionsByUserId()
      .subscribe({
        next: (userTransactions: Transaction[]) => {
          this.transactions = userTransactions.map((transaction) =>
            this.transactionService.mapTransactionFromBackend(transaction),
          );

          this.updateDataSource(this.transactions);
        },
        error: (error) => {
          this.handleError('Error fetching transactions:', error);
        },
      });
  }

  updateDataSource(transactions: Transaction[]): void {
    this.dataSource.data = transactions;
    this.filteredTransactions = transactions;
  }

  applyFilters(): void {
    let filteredTransactions = [...this.transactions];

    const searchValue = this.searchControl.value?.trim().toLowerCase();
    if (searchValue && searchValue !== '') {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.purpose.toLowerCase().includes(searchValue),
      );
    }

    const selectedCategory = this.categoriesControl.value;
    if (selectedCategory) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.categoryId === selectedCategory,
      );
    }

    const selectedTransactionType = this.transactionTypeControl.value;
    if (selectedTransactionType) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.typeId === selectedTransactionType,
      );
    }

    const minAmount = Number(this.minAmountControl.value) || 0;
    const maxAmount = Number(this.maxAmountControl.value) || Number.MAX_VALUE;

    filteredTransactions = filteredTransactions.filter(
      (transaction) =>
        transaction.amount >= minAmount && transaction.amount <= maxAmount,
    );

    const minDate = this.minDateControl.value;
    const maxDate = this.maxDateControl.value || new Date();
    if (minDate) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => new Date(transaction.createdAt) >= minDate,
      );
    }
    if (maxDate) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => new Date(transaction.createdAt) <= maxDate,
      );
    }

    this.updateDataSource(filteredTransactions);
  }

  deleteTransaction(id?: number): void {
    this.transactionService.deleteTransactionById(id).subscribe(
      () => {
        this.showSuccessMessage('Transaction deleted successfully.');
        this.getTransactions();
      },
      (error) => {
        this.handleError('Error deleting transaction:', error);
      },
    );
  }

  editTransaction(id?: number): void {
    this.router.navigate(['/transaction', id]);
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    this.showErrorMessage('An error occurred. Please try again later.');
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  getAmountColorByTransactionType(transactionTypeId: number): string {
    return transactionTypeId === 1 ? 'red' : 'green';
  }

  getAmountWithSignAndColor(amount: number, transactionTypeId: number): string {
    const sign = transactionTypeId === 1 ? '-' : '+';
    const absAmount = Math.abs(amount);
    return `${sign}${absAmount}₽`;
  }

  getRowNumber(index: number): number {
    return index + 1;
  }
}
