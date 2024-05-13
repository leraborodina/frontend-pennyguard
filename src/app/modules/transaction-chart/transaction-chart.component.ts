import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from '../../shared/models/category.model';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../shared/models/transaction.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss'],
})
export class TransactionChartComponent implements OnInit {
  gridColumns = 3;

  cards = [
    { cols: 1, rows: 4, id: 'doughnut' },
    { cols: 2, rows: 2, id: 'barchart' },
    { cols: 1, rows: 2, id: 'progress1' },
    { cols: 1, rows: 2, id: 'progress2' },
  ];

  categories: Category[] = [];
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getTransactions();
    this.observeScreenSize();
  }

  observeScreenSize(): void {
    this.breakpointObserver
      .observe([
        '(max-width: 560px)',
        '(max-width: 800px)',
        '(max-width: 1000px)',
      ])
      .subscribe((result) => {
        if (result.matches) {
          switch (true) {
            case this.breakpointObserver.isMatched('(max-width: 560px)'):
              this.gridColumns = 1;
              this.cards = [
                { cols: 1.5, rows: 3, id: 'doughnut' },
                { cols: 1.5, rows: 2, id: 'barchart' },
                { cols: 1.5, rows: 2, id: 'progress1' },
                { cols: 1.5, rows: 2, id: 'progress2' },
              ];
              break;
            case this.breakpointObserver.isMatched('(max-width: 800px)'):
              this.gridColumns = 2;
              this.cards = [
                { cols: 3, rows: 4, id: 'doughnut' },
                { cols: 3, rows: 2, id: 'barchart' },
                { cols: 3, rows: 2, id: 'progress1' },
                { cols: 3, rows: 2, id: 'progress2' },
              ];
              break;
            case this.breakpointObserver.isMatched('(max-width: 1000px)'):
              this.gridColumns = 3;
              this.cards = [
                { cols: 1, rows: 4, id: 'doughnut' },
                { cols: 2, rows: 2, id: 'barchart' },
                { cols: 1, rows: 2, id: 'progress1' },
                { cols: 1, rows: 2, id: 'progress2' },
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
      case this.breakpointObserver.isMatched('(max-width: 560px)'):
        this.gridColumns = 2;
        break;
      case this.breakpointObserver.isMatched('(max-width: 800px)'):
        this.gridColumns = 3;
        break;
    }
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.getTransactions();
      },
      (error) => {
        console.error('Error fetching categories:', error);
      },
    );
  }

  getTransactions() {
    this.transactionService.getTransactionsByUserId().subscribe(
      (transactions: Transaction[]) => {
        this.transactions = transactions;
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      },
    );
  }
}
