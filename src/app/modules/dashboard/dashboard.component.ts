import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { UserData } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { CookieService } from 'ngx-cookie-service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionTypes: TransactionType[] = [];

  currentMonthName: string = '';
  userData: UserData | null = null;
  subscription: Subscription | undefined;
  errorMessage: string = '';

  currentIncomes = 0;
  currentExpenses = 0;
  previousIncomes = 0;
  previousExpenses = 0;
  incomesPercent = 0;
  expensesPercent = 0;

  gridColumns = 3;

  cards = [
    { cols: 1, rows: 1, id: 'incomes' },
    { cols: 1, rows: 1, id: 'expenses' },
    { title: 'Лимиты', cols: 1, rows: 2 },
    { title: 'Последние транзакции', cols: 1, rows: 3 },
    { cols: 1, rows: 3, id: 'chart' },
    { title: 'Цели', cols: 1, rows: 2 },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.getTransactionTypes();
    this.getTransactions();
    this.observeScreenSize();
    const currentDate = new Date();
    this.currentMonthName = this.capitalizeFirstLetter(
      format(currentDate, 'LLLL', { locale: ru }),
    );
  }

  getTransactionTypes() {
    this.transactionService.getTransactionTypes().subscribe(
      (content: TransactionType[]) => {
        this.transactionTypes = content;
      },
      (error) => {
        console.error('Error fetching transaction types:', error);
      },
    );
  }

  getTransactions() {
    this.transactionService.getTransactionsByUserId().subscribe(
      (transactions: Transaction[]) => {
        this.transactions = transactions;
        const {
          currentIncomes,
          currentExpenses,
          previousIncomes,
          previousExpenses,
        } = this.amountCalculate();
        this.currentIncomes = currentIncomes;
        this.currentExpenses = currentExpenses;
        this.previousIncomes = previousIncomes;
        this.previousExpenses = previousExpenses;
        const { incomesPercent, expensesPercent } = this.percentCalculate();
        this.incomesPercent = incomesPercent;
        this.expensesPercent = expensesPercent;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      },
    );
  }

  amountCalculate() {
    const date = new Date();
    let currentIncomesAmount = 0;
    let currentExpensesAmount = 0;

    let previousIncomesAmount = 0;
    let previousExpensesAmount = 0;

    const incomes = this.transactionTypes
      .filter((type) => type.type === 'доходы')
      .map((type) => type.id);
    const expenses = this.transactionTypes
      .filter((type) => type.type === 'расходы')
      .map((type) => type.id);

    this.transactions.forEach((transaction) => {
      const transactionDate = new Date(parseInt(transaction.createdAt) * 1000);
      if (
        transactionDate.getFullYear() === date.getFullYear() &&
        transactionDate.getMonth() === date.getMonth()
      ) {
        if (incomes.includes(transaction.typeId)) {
          currentIncomesAmount += transaction.amount;
        } else if (expenses.includes(transaction.typeId)) {
          currentExpensesAmount += transaction.amount;
        }
      } else {
        if (
          transactionDate.getFullYear() === date.getFullYear() &&
          transactionDate.getMonth() === date.getMonth() - 1
        ) {
          if (incomes.includes(transaction.typeId)) {
            previousIncomesAmount += transaction.amount;
          } else if (expenses.includes(transaction.typeId)) {
            previousExpensesAmount += transaction.amount;
          }
        }
      }
    });
    return {
      currentIncomes: currentIncomesAmount,
      currentExpenses: currentExpensesAmount,
      previousIncomes: previousIncomesAmount,
      previousExpenses: previousExpensesAmount,
    };
  }

  percentCalculate() {
    const incomeDifference = this.currentIncomes - this.previousIncomes;
    const expenseDifference = this.currentExpenses - this.previousExpenses;

    const incomesPercent =
      this.previousIncomes !== 0
        ? Math.round((incomeDifference / this.previousIncomes) * 100)
        : 0;
    const expensesPercent =
      this.previousExpenses !== 0
        ? Math.round((expenseDifference / this.previousExpenses) * 100)
        : 0;

    return { incomesPercent: incomesPercent, expensesPercent: expensesPercent };
  }

  getColor(
    incomesPercent: number,
    expensesPercent: number,
  ): { incomesColor: string; expensesColor: string } {
    const incomesColor = incomesPercent >= 0 ? 'green' : 'red';
    const expensesColor = expensesPercent >= 0 ? 'red' : 'green';

    return { incomesColor, expensesColor };
  }

  handleError(message: string, error: any): void {
    console.error(message, error);
    this.showErrorMessage('An error occurred. Please try again later.');
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

  observeScreenSize(): void {
    this.breakpointObserver
      .observe([
        '(max-width: 800px)',
        '(max-width: 1060px)',
        '(max-width: 1200px)',
      ])
      .subscribe((result) => {
        if (result.matches) {
          switch (true) {
            case this.breakpointObserver.isMatched('(max-width: 800px)'):
              this.gridColumns = 1;
              this.cards = [
                { cols: 1, rows: 1, id: 'incomes' },
                { cols: 1, rows: 1, id: 'expenses' },
                { title: 'Лимиты', cols: 1, rows: 2 },
                { title: 'Последние транзакции', cols: 1, rows: 3 },
                { cols: 1, rows: 3, id: 'chart' },
                { title: 'Цели', cols: 1, rows: 2 },
              ];
              break;
            case this.breakpointObserver.isMatched('(max-width: 1060px)'):
              this.gridColumns = 2;
              this.cards = [
                { cols: 1, rows: 1, id: 'incomes' },
                { cols: 1, rows: 1, id: 'expenses' },
                { title: 'Лимиты', cols: 1, rows: 2 },
                { title: 'Последние транзакции', cols: 1, rows: 3 },
                { cols: 1, rows: 3, id: 'chart' },
                { title: 'Цели', cols: 1, rows: 2 },
              ];
              break;
            case this.breakpointObserver.isMatched('(max-width: 1200px)'):
              this.gridColumns = 3;
              this.cards = [
                { cols: 1, rows: 1, id: 'incomes' },
                { cols: 1, rows: 1, id: 'expenses' },
                { title: 'Лимиты', cols: 1, rows: 2 },
                { title: 'Последние транзакции', cols: 1, rows: 3 },
                { cols: 1, rows: 3, id: 'chart' },
                { title: 'Цели', cols: 1, rows: 2 },
              ];
              break;
          }
          this.assignGrid(result.matches);
        }
      });
  }

  assignGrid(matches: boolean): void {
    if (!matches) return;

    switch (true) {
      case this.breakpointObserver.isMatched('(max-width: 800px)'):
        this.gridColumns = 1;
        break;
      case this.breakpointObserver.isMatched('(max-width: 1060px)'):
        this.gridColumns = 2;
        break;
      case this.breakpointObserver.isMatched('(max-width: 1200px)'):
        this.gridColumns = 3;
        break;
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
