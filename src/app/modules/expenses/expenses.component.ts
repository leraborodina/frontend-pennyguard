// expenses.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent {
  totalExpenses: number = 1500; // Replace with your actual total expenses
  plannedTotalExpenses: number = 2000; // Replace with your planned total expenses

  // Dummy data for bar chart
  barChartData = [
    { category: 'Groceries', amount: 300 },
    { category: 'Utilities', amount: 500 },
    { category: 'Dining Out', amount: 200 },
    // Add more categories as needed
  ];

  calculateBarHeight(amount: number): number {
    // Adjust the scale factor based on your data distribution
    const scaleFactor = 0.5;
    return amount * scaleFactor;
  }
}
