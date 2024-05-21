import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/interfaces/category.interface';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import Chart from 'chart.js/auto';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chart: Chart<"doughnut"> | undefined;
  categories: Category[] = [];
  transactions: Transaction[] = [];
  minTransactionDate = new Date();
  displayedChartMonth!: number;
  displayedChartYear!: number;
  showNoTransactionsMessage!: boolean;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.displayedChartMonth = currentDate.getMonth() + 1;
    this.displayedChartYear = currentDate.getFullYear();
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  async initializeChart(): Promise<void> {
    try {
      await this.fetchData();
      this.createChart();
    } catch (error) {
      console.error('Error initializing chart: ', error);
    }
  }


  async fetchData(): Promise<void> {
    const [categories, transactions] = await lastValueFrom(
      forkJoin({
        categories: this.categoryService.getCategories(),
        transactions: this.transactionService.getUserExpences(),
      }).pipe(
        map(({ categories, transactions }) => [categories, transactions])
      )
    );

    this.categories = categories;

    this.transactions = transactions;

    // Finding the minimum date
    const minDate = this.transactions.reduce((min, transaction) => {
      return transaction.createdAt < min ? transaction.createdAt : min;
    }, this.transactions[0]?.createdAt);

    // Convert minDate to Date object if it's a string
    this.minTransactionDate = new Date(minDate);
  }


  isTransactionFromCurrentMonthAndYear(createdAt: Date): boolean {
    const transactionMonth = createdAt.getMonth() + 1;
    const transactionYear = createdAt.getFullYear();

    return (
      transactionMonth === this.displayedChartMonth &&
      transactionYear === this.displayedChartYear
    );
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const filteredCategories: string[] = [];
    const totalAmountsByCategory: number[] = [];

    this.categories.forEach(category => {
      const filteredTransactions = this.transactions.filter(transaction =>
        category.id === transaction.categoryId &&
        this.isTransactionFromCurrentMonthAndYear(new Date(transaction.createdAt))
      );

      if (filteredTransactions.length > 0) {
        const totalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        filteredCategories.push(category.name);
        totalAmountsByCategory.push(totalAmount);
      }
    });

    if (totalAmountsByCategory.length === 0) {
      this.showNoTransactionsMessage = true;
      return;
    } else {
      this.showNoTransactionsMessage = false;
    }

    this.changeDetector.detectChanges();

    const backgroundColors: string[] = [
      '#B0BEA9',
      '#91ACCA',
      '#D2BBA0',
      '#9F7E69',
      '#F2EFC7',
      '#B8B8FF',
      '#8D98A7',
      '#D0B6E2',
      '#FFD700',
      '#8A2BE2',
    ];

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: filteredCategories,
        datasets: [{
          data: totalAmountsByCategory,
          backgroundColor: backgroundColors.slice(0, totalAmountsByCategory.length),
        }],
      },
      options: {
        aspectRatio: 1.2,
      },
    });
  }

  getMonthName(month: number): string {
    const months = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    return months[month - 1];
  }

  async previousMonth(): Promise<void> {
    this.displayedChartMonth = this.displayedChartMonth === 1 ? 12 : this.displayedChartMonth - 1;
    this.displayedChartYear = this.displayedChartMonth === 1 ? this.displayedChartYear - 1 : this.displayedChartYear;
    this.showChartOrMessage();
  }

  async nextMonth(): Promise<void> {
    this.displayedChartMonth = this.displayedChartMonth === 12 ? 1 : this.displayedChartMonth + 1;
    this.displayedChartYear = this.displayedChartMonth === 12 ? this.displayedChartYear + 1 : this.displayedChartYear;
    this.showChartOrMessage();
  }

  private async showChartOrMessage() {
    await this.fetchData();

    if (this.areTransactionsAvailable(this.displayedChartMonth, this.displayedChartYear)) {
      this.createChart();
    } else {
      this.showNoTransactionsMessage = true;
    }
  }

  private areTransactionsAvailable(month: number, year: number): boolean {
    return this.transactions.some((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return (
        transactionDate.getMonth() + 1 === month &&
        transactionDate.getFullYear() === year
      );
    });
  }


  isNextDisabled(): boolean {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    return (
      this.displayedChartMonth === currentMonth &&
      this.displayedChartYear === currentYear
    );
  }

  isPreviousDisabled(): boolean {
    const minMonth = this.minTransactionDate.getMonth() + 1;
    const minYear = this.minTransactionDate.getFullYear();

    return (
      minMonth === this.displayedChartMonth &&
      minYear === this.displayedChartYear
    );
  }
}
