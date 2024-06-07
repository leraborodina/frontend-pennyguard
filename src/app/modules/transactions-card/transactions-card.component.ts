import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';

/**
 * Компонент для отображения последних транзакций пользователя.
 */
@Component({
  selector: 'transactions-card',
  templateUrl: './transactions-card.component.html',
  styleUrls: ['./transactions-card.component.scss'],
})
export class TransactionsCardComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionTypes: TransactionType[] = [];

  errorMessage: string = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) { }

  /**
   * Вызывается при инициализации компонента.
   */
  ngOnInit(): void {
    this.getTransactionTypes();
    this.getTransactions();
  }

  /**
   * Получает типы транзакций.
   */
  getTransactionTypes() {
    this.transactionService.getTransactionTypes().subscribe(
      (types: TransactionType[]) => {
        this.transactionTypes = types;
      },
      (error) => {
        console.error('Ошибка получения типов транзакций:', error);
        this.setErrorMessages(error);
      }
    );
  }

  /**
   * Получает транзакции пользователя.
   */
  getTransactions() {
    this.transactionService.getTransactionsByUserId().subscribe({
      next: (userTransactions: Transaction[]) => {
        this.transactions = userTransactions.slice(0, 3);
      },
      error: (error) => {
        console.error('Ошибка получения транзакций:', error);
        this.setErrorMessages(error);
      },
    });
  }

  /**
   * Возвращает цвет суммы транзакции в зависимости от ее типа (доходы или расходы).
   * @param transaction Транзакция для определения цвета.
   * @returns Строка с названием цвета.
   */
  getAmountColor(transaction: Transaction): string {
    const type = this.transactionTypes.find(
      (type) => type.id === transaction.typeId
    );
    return type?.type === 'доходы' ? 'green' : 'red';
  }

  /**
   * Устанавливает сообщение об ошибке.
   * @param error Объект ошибки.
   */
  setErrorMessages(error: any): void {
    this.errorMessage = 'Ошибка получения данных';
  }

  /**
   * Перенаправляет на страницу создания новой транзакции.
   */
  navigateToCreateTransaction(): void {
    this.router.navigate(['/transaction-form']);
  }

  /**
   * Перенаправляет на страницу обзора всех транзакций.
   */
  navigateToTransactions(): void {
    this.router.navigate(['/transaction-overview']);
  }
}
