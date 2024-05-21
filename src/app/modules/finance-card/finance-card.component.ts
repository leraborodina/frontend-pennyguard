import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';
import { UtilsService } from '../../shared/services/utils.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';

@Component({
  selector: 'app-finance-card',
  templateUrl: './finance-card.component.html',
  styleUrls: ['./finance-card.component.scss']
})
export class FinanceCardComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  income: number = 0;
  expense: number = 0;
  monthNames: string[] = [];

  constructor(
    private transactionService: TransactionService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.monthNames = this.utilsService.getMonthNames();
    this.updateSums();
  }

  updateSums() {
    this.income = 0;
    this.expense = 0;

    console.log(this.selectedMonth)
    console.log(this.selectedYear)

    const { startDate, endDate } = this.getMonthDateRange(this.selectedYear, this.selectedMonth);

    forkJoin({
      transactionTypes: this.transactionService.getTransactionTypes(),
      transactions: this.transactionService.getTransactionsByUserId()
    }).subscribe(
      ({ transactionTypes, transactions }) => {
        transactions.forEach(transaction => {
          const transactionDate = this.parseDate(transaction.createdAt);

          console.log(this.utilsService.formatStringToLocalDateTimeString(transaction.createdAt))
          console.log(transactionDate)

          if (transactionDate && transactionDate >= startDate && transactionDate <= endDate) {
            this.updateIncomeAndExpense(transaction, transactionTypes);
          }
        });
      },
      error => console.error('Error fetching data', error)
    );
  }

  updateIncomeAndExpense(transaction: Transaction, transactionTypes: TransactionType[]) {
    const transactionType = transactionTypes.find(type => type.id === transaction.typeId);
    if (transactionType) {
      if (transactionType.type === 'доходы') {
        this.income += transaction.amount;
      } else if (transactionType.type === 'расходы') {
        this.expense += transaction.amount;
      }
    }
  }

  getMonthDateRange(year: number, month: number) {
    // Calculate the start date
    const startDate = new Date(year, month, 1);

    // Calculate the end date
    let endDate: Date;
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const lastDay = isLeapYear && month === 1 ? 29 : this.getLastDayOfMonth(month);
    endDate = new Date(year, month, lastDay, 23, 59, 59); // Last day of the selected month

    return { startDate, endDate };
  }

  getLastDayOfMonth(month: number): number {
    const lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return lastDays[month]; // Retrieve the last day from the array
  }



  parseDate(dateString: string): Date | null {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  getMonthName(month: number): string {
    return this.utilsService.getMonthName(month); // Correcting the month index to match 0-based array
  }

  getTransactionsByMonth(year: number, month: number): Observable<Transaction[]> {
    return this.transactionService.getTransactionsByUserId().pipe(
      map(transactions =>
        transactions.filter(transaction => {
          const date = this.parseDate(transaction.createdAt);
          return date && date.getFullYear() === year && date.getMonth() + 1 === month; // Month is 0-based, add 1 to match the selected month
        })
      )
    );
  }

  calculateSums(year: number, month: number): Observable<{ income: number, expense: number }> {
    return this.getTransactionsByMonth(year, month).pipe(
      map(transactions => {
        const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
        return { income, expense };
      }),
      catchError(() => of({ income: 0, expense: 0 }))
    );
  }
}
