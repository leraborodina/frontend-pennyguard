import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../shared/models/category.model';
import { Transaction } from '../../shared/models/transaction.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit{

  public chart: any;
  private categories: Category [] = []; 
  private transactions: Transaction [] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
  ) { }

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
      this.createChart();
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

      const transactionsForCategory = this.transactions.filter(transaction => transaction.categoryId === category.id && transaction.typeId == 1);
      
      const totalAmount = transactionsForCategory.reduce((total, transaction) => total + transaction.amount, 0);
      
      if (transactionsForCategory.length > 0) {
        labels.push(category.name);
        data.push(totalAmount);
      }
    });
  
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
        aspectRatio: 1.2,
      }     
    });    
  }
}
