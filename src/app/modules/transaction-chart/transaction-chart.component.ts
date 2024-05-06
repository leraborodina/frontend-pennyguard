import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Category } from '../../shared/models/category.model';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../shared/models/transaction.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss']
})
export class TransactionChartComponent implements OnInit {

  gridColumns = 4;

  cards = [
    { cols: 1, rows: 2, id: 'doughnut' },
    { cols: 3, rows: 2, id: 'barchart' },
    { cols: 2, rows: 2, id: 'progress1' },
    { cols: 2, rows: 2, id: 'progress2' },
  ];

  private categories: Category [] = []; 
  private transactions: Transaction [] = [];
  public categoriesData: { name: string, percent: number, totalAmount: number }[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private breakpointObserver: BreakpointObserver
  ) { 
    this.observeScreenSize();
  }

  observeScreenSize(): void {
    this.breakpointObserver.observe([
      '(max-width: 500px)',
      '(max-width: 750px)',
      '(max-width: 1000px)'
    ]).subscribe(result => this.assignGrid(result.matches));
  }

  assignGrid(matches: boolean): void {
    if (!matches) return;

    switch (true) {
      case this.breakpointObserver.isMatched('(max-width: 500px)'):
        this.gridColumns = 2;
        break;
      case this.breakpointObserver.isMatched('(max-width: 750px)'):
        this.gridColumns = 3;
        break;
      case this.breakpointObserver.isMatched('(max-width: 1000px)'):
        this.gridColumns = 4;
        break;
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories: Category[]) => { 
      this.categories = categories;
      this.getTransactions();
    },
    (error) => {
      console.error('Error fetching categories:', error);
    });
  }

  getTransactions() {
    this.transactionService.getTransactionsByUserId().subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
    },
    (error) => {
      console.error('Error fetching transactions:', error);
    });
  }
}
