import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Category } from '../../shared/models/category.model';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.scss']
})
export class TransactionChartComponent implements OnInit {
  private categories: Category [] = []; 
  private transactions: Transaction [] = [];
  public chart: any;
  public categoriesData: { name: string, percent: number, totalAmount: number }[] = [];

  constructor(
    private transactionService: TransactionService,
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.transactionService.getCategories().subscribe((categories: Category[]) => { 
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
      this.createChart();
      this.calculateCategoryData();
    },
    (error) => {
      console.error('Error fetching transactions:', error);
    });
  }

  createChart() {
    const data: number[] = [];
    const labels: string[] = [];
    const backgroundColors: string[] = ['#B0BEA9', '#91ACCA', '#D2BBA0', '#9F7E69', '#F2EFC7', '#B8B8FF', '#8D98A7', '#D0B6E2', '#FFD700', '#8A2BE2'];
  
    this.categories.forEach((category, index) => {

      const transactionsForCategory = this.transactions.filter(transaction => transaction.categoryId === category.id);
      
      const totalAmount = transactionsForCategory.reduce((total, transaction) => total + transaction.amount, 0);
      
      if (transactionsForCategory.length > 0) {
        labels.push(category.value);
        data.push(totalAmount);
      }
    });
  
    // Create the chart
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length)
        }]
      },
      options: {
        aspectRatio: 4,
      }
    });
  }
  
  calculateCategoryData() {
    const totalAmount = this.transactions.reduce((total, transaction) => total + transaction.amount, 0);
    console.log(totalAmount);
    this.categoriesData = this.categories.map(category => {
      const transactionsForCategory = this.transactions.filter(transaction => transaction.categoryId === category.id);
      const categoryTotalAmount = transactionsForCategory.reduce((total, transaction) => total + transaction.amount, 0);
      const percent = (categoryTotalAmount / totalAmount) * 100;
      return {
        name: category.value,
        percent: percent,
        totalAmount: categoryTotalAmount
      };
    });
  }  
}
