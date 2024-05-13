import { Component, OnInit } from '@angular/core';
import { UserData } from '../../shared/services/user.service';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CookieService } from 'ngx-cookie-service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit {
  barchart: any;
  userData: UserData | null = null;
  transactionTypes: TransactionType[] = [];
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.getTransactionTypes();
    this.getTransactions();
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
        this.createChart();
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      },
    );
  }

  groupTransactionsByYear() {
    const currentYear = new Date().getFullYear();
    const groupedTransactions: {
      [key: string]: { [key: string]: { income: number; expense: number } };
    } = {};

    const incomeTypeIds = this.transactionTypes
      .filter((type) => type.type === 'доходы')
      .map((type) => type.id);

    this.transactions.forEach((transaction) => {
      const date = new Date(parseInt(transaction.createdAt) * 1000);
      const year = date.getFullYear().toString();
      const monthName = this.getMonthName(date.getMonth());

      if (year === currentYear.toString()) {
        if (!groupedTransactions[year]) {
          groupedTransactions[year] = {};
        }

        if (!groupedTransactions[year][monthName]) {
          groupedTransactions[year][monthName] = { income: 0, expense: 0 };
        }

        if (incomeTypeIds.includes(transaction.typeId)) {
          groupedTransactions[year][monthName].income += transaction.amount;
        } else {
          groupedTransactions[year][monthName].expense += transaction.amount;
        }
      }
    });
    return groupedTransactions;
  }

  getMonthName(monthIndex: number) {
    const monthNames = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ];
    return monthNames[monthIndex];
  }

  createChart() {
    const groupedTransactions = this.groupTransactionsByYear();
    const currentYear = new Date().getFullYear();
    const months = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ];
    const dataIncome: number[] = [];
    const dataExpense: number[] = [];

    months.forEach((month) => {
      const transactionsForMonth =
        groupedTransactions[currentYear.toString()][month];
      dataIncome.push(transactionsForMonth?.income ?? 0);
      dataExpense.push(transactionsForMonth?.expense ?? 0);
    });

    this.barchart = new Chart('MyBarChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Доходы',
            data: dataIncome,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Расходы',
            data: dataExpense,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      },
    });
  }
}
