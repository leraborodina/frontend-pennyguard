import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { AuthService } from '../../core/guards/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Category } from '../../shared/interfaces/category.interface';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { TransactionService } from '../../core/services/transaction.service';
import { UtilsService } from '../../shared/services/utils.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
})
export class TransactionOverviewComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  subscription: Subscription = new Subscription();
  errorMessage: string = '';
  today: Date = new Date();
  minAmount: number = 0;
  maxAmount: number = 0;

  searchControl = new FormControl();
  categoriesControl = new FormControl();
  transactionTypeControl = new FormControl();
  minAmountControl = new FormControl(null, Validators.min(0));
  maxAmountControl = new FormControl(null, Validators.min(0));
  minDateControl = new FormControl();
  maxDateControl = new FormControl();

  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];

  selectedCategory: number | null = null;
  selectedTransactionType: number | null = null;
  selectedMinAmount: number | null = null;
  selectedMaxAmount: number | null = null;
  selectedMinDate: Date | null = null;
  selectedMaxDate: Date | null = null;
  selectedQuery: string = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactionTypes();
    this.verifyTokenAndFetchTransactions();

    this.subscribeToFilterChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCategories(): void {
    this.subscription.add(this.utilsService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => this.handleError('Error fetching categories:', error),
    ));
  }

  loadTransactionTypes(): void {
    this.subscription.add(this.utilsService.getTransactionTypes().subscribe(
      (transactionTypes: TransactionType[]) => {
        this.transactionTypes = transactionTypes;
      },
      (error) => this.handleError('Error fetching transaction types:', error),
    ));
  }

  verifyTokenAndFetchTransactions(): void {
    if (this.authService.checkTokenExpiration()) {
      this.fetchTransactions();
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchTransactions(): void {
    this.subscription.add(this.transactionService.getTransactionsByUserId().subscribe(
      (userTransactions: Transaction[]) => {
        this.transactions = userTransactions.map((transaction) =>
          this.transactionService.mapTransactionFromBackend(transaction),
        );

        this.filteredTransactions = userTransactions.map((transaction) =>
          this.transactionService.mapTransactionFromBackend(transaction),
        );

        this.applyFilters();
      },
      (error) => this.handleError('Error fetching transactions:', error),
    ));
  }


  applyFilters(): void {
    let filteredTransactions = this.transactions;

    const searchValue = this.selectedQuery.trim().toLowerCase();
    if (searchValue) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.purpose.toLowerCase().includes(searchValue)
      );
    }

    const selectedCategory = this.selectedCategory;
    if (selectedCategory !== null) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.categoryId == selectedCategory
      );
    }

    const selectedTransactionType = this.selectedTransactionType;
    if (selectedTransactionType !== null) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.typeId == selectedTransactionType
      );
    }

    const minAmount = this.selectedMinAmount;
    if (minAmount !== null) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.amount >= minAmount
      );
    }

    const maxAmount = this.selectedMaxAmount;
    if (maxAmount !== null) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.amount <= maxAmount
      );
    }

    const minDate = this.selectedMinDate;
    if (minDate) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        new Date(transaction.createdAt) >= new Date(minDate)
      );
    }

    const maxDate = this.selectedMaxDate;
    if (maxDate) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        new Date(transaction.createdAt) <= new Date(maxDate)
      );
    }

    this.filteredTransactions = filteredTransactions;
  }


  deleteTransaction(id?: number): void {
    this.subscription.add(this.transactionService.deleteTransactionById(id).subscribe(
      () => {
        this.fetchTransactions();
      },
      (error) => this.handleError('Fehler beim Löschen der Transaktion:', error),
    ));
  }

  editTransaction(id?: number): void {
    this.router.navigate(['/transaction', id]);
  }

  getAmountWithSignAndColor(amount: number, transactionTypeId: number): string {
    const transactionType = this.transactionTypes.find(type => type.id === transactionTypeId);
    if (transactionType) {
      const typeName = transactionType.type.toLowerCase();
      const sign = typeName === 'доходы' ? '+' : '-';
      const absAmount = Math.abs(amount);
      return `${sign}${absAmount} ₽`;
    } else {
      // Fallback: Wenn der Transaktionstyp nicht gefunden wird, verwenden wir standardmäßig das Minuszeichen
      const absAmount = Math.abs(amount);
      return `-${absAmount} ₽`;
    }
  }

  getAmountColorByTransactionType(transactionTypeId: number): string {
    const transactionType = this.transactionTypes.find(type => type.id === transactionTypeId);
    if (transactionType) {
      const typeName = transactionType.type.toLowerCase();
      return typeName === 'доходы' ? 'green' : 'red';
    } else {
      return 'red';
    }
  }

  getCategoryName(categoryId: number): string {
    return this.utilsService.getCategoryNameById(categoryId);
  }


  subscribeToFilterChanges(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    this.categoriesControl.valueChanges.subscribe(() => this.applyFilters());

    this.transactionTypeControl.valueChanges.subscribe(() => this.applyFilters());

    this.minAmountControl.valueChanges.subscribe(() => this.applyFilters());

    this.maxAmountControl.valueChanges.subscribe(() => this.applyFilters());

    this.minDateControl.valueChanges.subscribe(() => this.applyFilters());

    this.maxDateControl.valueChanges.subscribe(() => this.applyFilters());
  }


  handleError(message: string, error: any): void {
    console.error(message, error);
    // Handle error display as needed
  }
}

