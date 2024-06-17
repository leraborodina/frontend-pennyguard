import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../../shared/interfaces/transaction.interface';
import Chart from 'chart.js/auto';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '../../../shared/services/utils.service';
import { TransactionType } from '../../../shared/interfaces/transaction-type.interface';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit {
  barchart: Chart<"bar"> | undefined;
  transactionTypes: TransactionType[] = [];
  transactions: Transaction[] = [];
  groupedTransactions: { [key: string]: { [key: string]: { income: number; expense: number } } } = {};
  displayedYear: number = new Date().getFullYear();
  isUpdate: boolean = false;
  showNoTransactionsMessage: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin({
      transactionTypes: this.getTransactionTypes(),
      transactions: this.getTransactions()
    }).pipe(
      catchError(error => {
        console.error('Error loading data:', error);
        return [];
      })
    ).subscribe(({ transactionTypes, transactions }) => {
      this.transactionTypes = transactionTypes;
      this.transactions = transactions;
      this.createChart();
    });
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    return this.transactionService.getTransactionTypes();
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionService.getTransactionsByUserId();
  }

  groupTransactionsByYear(transactions: Transaction[]) {
    const groupedTransactions: { [key: string]: { [key: string]: { income: number; expense: number } } } = {};

    const incomeTypeId = this.transactionTypes.filter((type) => type.type === 'доходы').map((type) => type.id);

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const year = transactionDate.getFullYear().toString();
      const monthName = this.getMonthName(transactionDate.getMonth());
      const isIncome = incomeTypeId.includes(transaction.typeId);

      if (!groupedTransactions[year]) {
        groupedTransactions[year] = {};
      }

      if (!groupedTransactions[year][monthName]) {
        groupedTransactions[year][monthName] = { income: 0, expense: 0 };
      }

      const monthData = groupedTransactions[year][monthName];
      isIncome ? monthData.income += transaction.amount : monthData.expense += transaction.amount;
    });

    // Ensure every month is initialized for every year
    const allYears = [...new Set(transactions.map(transaction => new Date(transaction.createdAt).getFullYear()))];
    allYears.forEach(year => {
      if (!groupedTransactions[year]) {
        groupedTransactions[year] = {};
      }
      this.utilsService.getMonthNames().forEach(month => {
        if (!groupedTransactions[year][month]) {
          groupedTransactions[year][month] = { income: 0, expense: 0 };
        }
      });
    });

    return groupedTransactions;
  }


  getMonthName(monthIndex: number) {
    return this.utilsService.getMonthName(monthIndex);
  }

  createChart() {
    const groupedTransactions = this.isUpdate ? this.groupedTransactions : this.groupTransactionsByYear(this.transactions);
    const selectedYear = this.displayedYear.toString();
    const months = this.utilsService.getMonthNames();
    const dataIncome: number[] = [];
    const dataExpense: number[] = [];

    months.forEach((month) => {
      const monthData = groupedTransactions[selectedYear] ? groupedTransactions[selectedYear][month] : undefined;
      dataIncome.push(monthData?.income ?? 0);
      dataExpense.push(monthData?.expense ?? 0);
    });

    if (this.barchart) {
      if (this.barchart.data.datasets[0] && this.barchart.data.datasets[0].data) {
        this.barchart.data.datasets[0].data = dataIncome;
      }
      if (this.barchart.data.datasets[1] && this.barchart.data.datasets[1].data) {
        this.barchart.data.datasets[1].data = dataExpense;
      }
      this.barchart.update();
      return;
    }

    this.barchart = new Chart('MyBarChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          this.createDataSet('Доходы', dataIncome, 'rgba(75, 192, 192, 0.2)'),
          this.createDataSet('Расходы', dataExpense, 'rgba(255, 99, 132, 0.2)')
        ],
      },
    });

    this.showNoTransactionsMessage = this.isEmptyData();
  }


  createDataSet(transactionType: string, totalAmounts: number[], backgroundColor: string) {
    return {
      label: transactionType,
      data: totalAmounts,
      backgroundColor: backgroundColor
    }
  }

  switchYear(year: number) {
    this.displayedYear = year;
    this.updateChart();
  }

  updateChart() {
    this.isUpdate = true;
    this.destroyChart();
    this.getTransactions().subscribe((transactions: Transaction[]) => {
      const transactionsForYear = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getFullYear() === this.displayedYear;
      });

      this.groupedTransactions = this.groupTransactionsByYear(transactionsForYear);
      this.createChart();
    });
  }


  destroyChart() {
    if (this.barchart) {
      this.barchart.destroy();
      this.barchart = undefined;
    }
  }

  isEmptyData(): boolean {
    let isEmpty = true;
    const currentYear = new Date().getFullYear();
    const months = this.utilsService.getMonthNames();
    const groupedTransactions = this.groupTransactionsByYear(this.transactions);

    months.forEach((month) => {
      const monthData = groupedTransactions[currentYear.toString()][month];
      if (monthData && (monthData.income !== 0 || monthData.expense !== 0)) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }

}
