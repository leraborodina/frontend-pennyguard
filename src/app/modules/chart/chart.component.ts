import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import Chart from 'chart.js/auto';

import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Category } from '../../shared/interfaces/category.interface';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.displayedChartMonth = currentDate.getMonth() + 1;
    this.displayedChartYear = currentDate.getFullYear();
    this.initializeChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private async initializeChart(): Promise<void> {
    try {
      await this.fetchData();
      this.createChart();
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }

  private async fetchData(): Promise<void> {
    const [categories, transactions] = await lastValueFrom(
      forkJoin({
        categories: this.categoryService.getCategories(),
        transactions: this.transactionService.getUserExpences(),
      }).pipe(map(({ categories, transactions }) => [categories, transactions]))
    );

    this.categories = categories;
    this.transactions = transactions;
    this.minTransactionDate = new Date(
      Math.min(...this.transactions.map(transaction => new Date(transaction.createdAt).getTime()))
    );
  }

  private isTransactionFromCurrentMonthAndYear(createdAt: Date): boolean {
    return (
      createdAt.getMonth() + 1 === this.displayedChartMonth &&
      createdAt.getFullYear() === this.displayedChartYear
    );
  }

  private createChart(): void {
    this.chart?.destroy();

    const filteredCategories: string[] = [];
    const totalAmountsByCategory: number[] = [];

    this.categories.forEach(category => {
      const totalAmount = this.transactions
        .filter(transaction =>
          category.id === transaction.categoryId &&
          this.isTransactionFromCurrentMonthAndYear(new Date(transaction.createdAt))
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

      if (totalAmount > 0) {
        filteredCategories.push(category.name);
        totalAmountsByCategory.push(totalAmount);
      }
    });

    if (totalAmountsByCategory.length === 0) {
      this.showNoTransactionsMessage = true;
      return;
    }

    this.showNoTransactionsMessage = false;
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
    this.displayedChartYear = this.displayedChartMonth === 12 ? this.displayedChartYear - 1 : this.displayedChartYear;
    await this.showChartOrMessage();
  }

  async nextMonth(): Promise<void> {
    this.displayedChartMonth = this.displayedChartMonth === 12 ? 1 : this.displayedChartMonth + 1;
    this.displayedChartYear = this.displayedChartMonth === 1 ? this.displayedChartYear + 1 : this.displayedChartYear;
    await this.showChartOrMessage();
  }

  private async showChartOrMessage(): Promise<void> {
    await this.fetchData();
    this.areTransactionsAvailable(this.displayedChartMonth, this.displayedChartYear)
      ? this.createChart()
      : this.showNoTransactionsMessage = true;
  }

  private areTransactionsAvailable(month: number, year: number): boolean {
    return this.transactions.some(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return (
        transactionDate.getMonth() + 1 === month &&
        transactionDate.getFullYear() === year
      );
    });
  }

  isNextDisabled(): boolean {
    const currentDate = new Date();
    return (
      this.displayedChartMonth === currentDate.getMonth() + 1 &&
      this.displayedChartYear === currentDate.getFullYear()
    );
  }

  isPreviousDisabled(): boolean {
    return (
      this.displayedChartMonth === this.minTransactionDate.getMonth() + 1 &&
      this.displayedChartYear === this.minTransactionDate.getFullYear()
    );
  }

  navigateToCharts() {
    this.router.navigate(['/app-transaction-analysis']);
  }
}
