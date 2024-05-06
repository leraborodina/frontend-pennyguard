import { Component, Input } from '@angular/core';
import { FinancialGoalService } from '../../services/financial-goal.service';
import { TransactionService } from '../../services/transaction.service';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'savings-progress',
  templateUrl: './savings-progress.component.html',
  styleUrl: './savings-progress.component.scss'
})
export class SavingsProgressComponent {
  financialGoals: FinancialGoal[] = [];
  transactions: Transaction[] = [];

  constructor(private financialGoalService: FinancialGoalService, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadFinancialGoals();
    this.loadTransactions();

    console.log('goals: ', this.financialGoals);
    console.log('transactions: ', this.transactions);
  }

  loadFinancialGoals(): void {
    this.financialGoalService.getFinancialGoals().subscribe(goals => this.financialGoals = goals);
  }

  loadTransactions(): void {
    this.transactionService.getUserIncomes().subscribe(transactions => this.transactions = transactions);
  }

  getCurrentAmount(goalId: number): number {
    // Filter transactions with the type "income" and for the specific goal
    const goalTransactions = this.transactions;
    // Calculate the total amount from income transactions for the specific goal
    return goalTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getTotalGoal(goalId: number): number {
    // Find the financial goal by its ID
    const goal = this.financialGoals.find(goal => goal.id === goalId);
    return goal ? goal.sum : 0;
  }

  getPercentage(currentAmount: number, totalGoal: number): number {
    if (currentAmount === 0) {
      return 0;
    }
    return Math.min((currentAmount / totalGoal) * 100, 100);
  }
}
