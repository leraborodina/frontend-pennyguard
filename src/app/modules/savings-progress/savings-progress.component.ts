import { Component, Input, OnInit } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'savings-progress',
  templateUrl: './savings-progress.component.html',
  styleUrls: ['./savings-progress.component.scss']
})
export class SavingsProgressComponent implements OnInit {
  @Input() financialGoals: FinancialGoal[] = [];
  @Input() balance: number = 0;

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
    const goal = this.financialGoals.find(goal => goal.id === goalId);
    return goal ? goal.sum : 0;
  }

  calculateProgressPercentage(goal: FinancialGoal): number {
    const totalGoal = this.getTotalGoal(goal.id);
    if (totalGoal === 0) {
      return 0;
    }
    return Math.min((this.balance / totalGoal) * 100, 100);
  }

  noFinancialGoals(): boolean {
    return this.financialGoals.length === 0;
  }
}
