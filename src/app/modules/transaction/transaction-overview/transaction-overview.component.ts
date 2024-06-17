import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../../core/guards/auth.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Category } from '../../../shared/interfaces/category.interface';
import { TransactionType } from '../../../shared/interfaces/transaction-type.interface';
import { Transaction } from '../../../shared/interfaces/transaction.interface';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
})
export class TransactionOverviewComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];

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

  selectedCategory: number | null = null;
  selectedTransactionType: number | null = null;
  selectedMinAmount: number | null = null;
  selectedMaxAmount: number | null = null;
  selectedMinDate: Date | null = null;
  selectedMaxDate: Date | null = null;
  selectedQuery: string = '';

  errorMessage: string = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
  ) { }

  /**
  * Инициализация компонента
  */
  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactionTypes();
    this.verifyTokenAndFetchTransactions();
    this.subscribeToFilterChanges();
  }

  /**
  * Уничтожение компонента
  */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Загрузка категорий транзакций
   */
  loadCategories(): void {
    this.subscription.add(this.utilsService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => this.handleError('Ошибка при загрузке категорий:', error),
    ));
  }


  /**
  * Загрузка типов транзакций
  */
  loadTransactionTypes(): void {
    this.subscription.add(this.utilsService.getTransactionTypes().subscribe(
      (transactionTypes: TransactionType[]) => {
        this.transactionTypes = transactionTypes;
      },
      (error) => this.handleError('Ошибка при загрузке типов транзакций:', error),
    ));
  }

  /**
   * Проверка токена и загрузка транзакций пользователя
   */
  verifyTokenAndFetchTransactions(): void {
    if (this.authService.checkTokenExpiration()) {
      this.fetchTransactions();
    } else {
      this.router.navigate(['/login']);
    }
  }

/**
 * Получение транзакций пользователя
 */
fetchTransactions(): void {
  this.subscription.add(this.transactionService.getTransactionsByUserId().subscribe(
    (userTransactions: Transaction[]) => {
      this.transactions = userTransactions.map((transaction) =>
        this.transactionService.mapTransactionFromBackend(transaction),
      );

      this.transactions.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      this.filteredTransactions = [...this.transactions];

      this.applyFilters();
    },
    (error) => this.handleError('Ошибка при загрузке транзакций:', error),
  ));
}

  /**
  * Применение фильтров
  */
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
    const maxDate = this.selectedMaxDate;

    if (minDate && maxDate) {
      const minDateWithoutTime = new Date(minDate);
      minDateWithoutTime.setHours(0, 0, 0, 0);

      const maxDateWithoutTime = new Date(maxDate);
      maxDateWithoutTime.setHours(0, 0, 0, 0);

      if (minDateWithoutTime > maxDateWithoutTime) {
        this.selectedMaxDate = minDate;
      }
    }

    if (minDate) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        transactionDate.setHours(0, 0, 0, 0);

        const minDateWithoutTime = new Date(minDate);
        minDateWithoutTime.setHours(0, 0, 0, 0);

        return transactionDate >= minDateWithoutTime;
      });
    }

    if (maxDate) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        transactionDate.setHours(0, 0, 0, 0);

        const maxDateWithoutTime = new Date(maxDate);
        maxDateWithoutTime.setHours(0, 0, 0, 0);

        return transactionDate <= maxDateWithoutTime;
      });
    }

    this.filteredTransactions = filteredTransactions;
  }


  /**
  * Удаление транзакции
  * @param id Идентификатор транзакции для удаления
  */
  deleteTransaction(id?: number): void {
    this.subscription.add(this.transactionService.deleteTransactionById(id).subscribe(
      () => {
        this.fetchTransactions();
      },
      (error) => this.handleError('Ошибка при удалении транзакции:', error),
    ));
  }

  /**
   * Редактирование транзакции
   * @param id Идентификатор транзакции для редактирования
   */
  editTransaction(id?: number): void {
    this.router.navigate(['/transaction', id]);
  }

  /**
   * Получение имени категории по идентификатору
   * @param categoryId Идентификатор категории
   * @returns Имя категории
   */
  getCategoryName(categoryId: number): string {
    return this.utilsService.getCategoryNameById(categoryId);
  }
  /**
   * Получение суммы с знаком и цветом в зависимости от типа транзакции
   * @param amount Сумма транзакции
   * @param transactionTypeId Идентификатор типа транзакции
   * @returns Строка с суммой, знаком и валютой
   */
  getAmountWithSignAndColor(amount: number, transactionTypeId: number): string {
    const transactionType = this.transactionTypes.find(type => type.id === transactionTypeId);
    if (transactionType) {
      const typeName = transactionType.type.toLowerCase();
      const sign = typeName === 'доходы' ? '+' : '-';
      const absAmount = Math.abs(amount);
      return `${sign}${absAmount} ₽`;
    } else {
      const absAmount = Math.abs(amount);
      return `-${absAmount} ₽`;
    }
  }

  /**
   * Получение цвета суммы в зависимости от типа транзакции
   * @param transactionTypeId Идентификатор типа транзакции
   * @returns Строка с названием цвета
   */
  getAmountColorByTransactionType(transactionTypeId: number): string {
    const transactionType = this.transactionTypes.find(type => type.id === transactionTypeId);
    if (transactionType) {
      const typeName = transactionType.type.toLowerCase();
      return typeName === 'доходы' ? 'green' : 'red';
    } else {
      return 'red';
    }
  }


  /**
   * Подписка на изменения фильтров
   */
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
  /**
     * Обработка ошибки
     * @param message Сообщение об ошибке
     * @param error Объект ошибки
     */
  handleError(message: string, error: any): void {
    console.error(message, error);
    // Обработка отображения ошибки по необходимости
  }
}

