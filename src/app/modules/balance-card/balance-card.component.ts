import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';
import { UtilsService } from '../../shared/services/utils.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';

@Component({
  selector: 'balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.scss']
})
export class BalanceCardComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  incomes: number = 0;
  expenses: number = 0;
  monthNames: string[] = [];
  availableYears: number[] = [];
  transactionTypes: TransactionType[] = [];

  constructor(
    private transactionService: TransactionService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      this.availableYears.push(year);
    }
    this.monthNames = this.utilsService.getMonthNames();
    this.utilsService.getTransactionTypes().subscribe(types => {
      this.transactionTypes = types;
      this.updateBalances();
    });
  }

  /**
   * Обновляет суммы доходов и расходов за выбранный месяц и год.
   * Получает типы транзакций и транзакции для пользователя, затем вычисляет
   * доходы и расходы на основе сумм транзакций и их типов в указанном диапазоне дат.
   */
  updateBalances() {
    const { startDate, endDate } = this.calculateMonthDateRange(this.selectedYear, this.selectedMonth);

    forkJoin({
      transactions: this.transactionService.getTransactionsByUserId()
    }).subscribe(
      ({ transactions }) => {
        this.incomes = 0;
        this.expenses = 0;
        
        transactions.forEach(transaction => {
          const transactionDate = this.parseDate(transaction.createdAt);

          if (transactionDate && transactionDate >= startDate && transactionDate <= endDate) {
            this.calculateIncomesAndExpenses(transaction);
          }
        });
      },
      error => console.error('Ошибка получения данных', error)
    );
  }

  /**
  * Обновляет суммы доходов и расходов на основе переданной транзакции.
  * @param transaction Транзакция для обновления сумм.
  */
  calculateIncomesAndExpenses(transaction: Transaction) {
    const transactionType = this.transactionTypes.find(type => type.id === transaction.typeId);
    if (transactionType) {
      if (transactionType.type === 'доходы') {
        this.incomes += transaction.amount;
      } else if (transactionType.type === 'расходы') {
        this.expenses += transaction.amount;
      }
    }
  }

  /**
   * Вычисляет начальную и конечную даты для указанного месяца и года.
   * @param year Год.
   * @param month Месяц (от 0 до 11).
   * @returns Объект с начальной и конечной датой.
   */
  calculateMonthDateRange(year: number, month: number) {
    const startDate = new Date(year, month, 1);

    let endDate: Date;
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const lastDay = isLeapYear && month === 1 ? 29 : this.getLastDayOfMonth(month);
    endDate = new Date(year, month, lastDay, 23, 59, 59);

    return { startDate, endDate };
  }

  /**
   * Возвращает количество дней в указанном месяце.
   * @param month Номер месяца (от 0 до 11).
   * @returns Количество дней в месяце.
   */
  getLastDayOfMonth(month: number): number {
    const lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return lastDays[month];
  }

  /**
   * Преобразует строку с датой в объект Date.
   * @param dateString Строка с датой.
   * @returns Объект Date или null, если строка не является корректной датой.
   */
  parseDate(dateString: string): Date | null {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  /**
   * Возвращает название месяца по его индексу.
   * @param month Индекс месяца (от 0 до 11).
   * @returns Название месяца.
   */
  getMonthName(month: number): string {
    return this.utilsService.getMonthName(month);
  }

  /**
 * Получает транзакции за указанный месяц и год.
 * @param year Год.
 * @param month Месяц (от 0 до 11).
 * @returns Поток данных с транзакциями за указанный месяц и год.
 */
  getTransactionsByMonth(year: number, month: number): Observable<Transaction[]> {
    return this.transactionService.getTransactionsByUserId().pipe(
      map(transactions =>
        transactions.filter(transaction => {
          const date = this.parseDate(transaction.createdAt);
          return date && date.getFullYear() === year && date.getMonth() === month;
        })
      )
    );
  }
}
