import { Component, OnInit } from '@angular/core';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import Chart from 'chart.js/auto';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '../../shared/services/utils.service';
import { is } from 'date-fns/locale';

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

  constructor(
    private transactionService: TransactionService,
    private utilsService: UtilsService,
  ) {}

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

  groupTransactionsByYear(transactionsForYear: Transaction[]) {
    const groupedTransactions: { [key: string]: { [key: string]: { income: number; expense: number } } } = {};

    const incomeTypeId = this.transactionTypes.filter((type) => type.type === 'доходы').map((type) => type.id);

    transactionsForYear.forEach((transaction) => {
      const transactionsDate = new Date(parseInt(transaction.createdAt) * 1000);
      const year = transactionsDate.getFullYear().toString();

      const monthName = this.getMonthName(transactionsDate.getMonth());
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
    return groupedTransactions;
  }

  getMonthName(monthIndex: number) {
    return this.utilsService.getMonthName(monthIndex);
  }

  createChart() {
    const groupedTransactions = this.isUpdate ? this.groupedTransactions : this.groupTransactionsByYear(this.transactions);
    const currentYear = new Date().getFullYear();
    const months = this.utilsService.getMonthNames();
    const dataIncome: number[] = [];
    const dataExpense: number[] = [];

    months.forEach((month) => {
      const monthData = groupedTransactions[currentYear.toString()][month];
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
  }

  createDataSet(transactionType: string, totalAmounts: number[], backgroundColor: string){
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
    this.getTransactions().subscribe((transactions: Transaction[]) => {
      const transactionsForYear = transactions.filter(transaction => {
        const transactionDate = new Date(parseInt(transaction.createdAt) * 1000);
        return transactionDate.getFullYear() === this.displayedYear;
      });

      this.groupedTransactions = this.groupTransactionsByYear(transactionsForYear);
      this.createChart();
    });
  }
}
