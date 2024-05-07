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
  balance: number = 0;

  constructor(private financialGoalService: FinancialGoalService, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadFinancialGoals();
    this.loadUserBalanceAfterSettingGoals();
  }

  loadFinancialGoals(): void {
    this.financialGoalService.getFinancialGoals().subscribe(goals => this.financialGoals = goals);
  }

  loadUserBalanceAfterSettingGoals(): void {
    this.transactionService.getUserBalanceAfterSettinigGoals().subscribe(balance => this.balance = balance);
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
