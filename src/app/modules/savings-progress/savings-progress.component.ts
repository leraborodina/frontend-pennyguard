import { Component, Input, OnInit } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'savings-progress',
  templateUrl: './savings-progress.component.html',
  styleUrls: ['./savings-progress.component.scss']
})
export class SavingsProgressComponent implements OnInit {
  @Input() financialGoals: FinancialGoal[] = [];
  @Input() balance: number = 0;

  constructor(private financialGoalService: FinancialGoalService, private transactionService: TransactionService, private router: Router) { }

  navigateToCreateGoal() {
    this.router.navigate(['/create-goal']);
  }

  ngOnInit(): void {
    this.loadFinancialGoals();
    this.loadUserBalanceAfterSettingGoals();
  }

  loadFinancialGoals(): void {
    this.financialGoalService.getFinancialGoals().subscribe(goals => {
      this.financialGoals = goals
      console.log(this.financialGoals)
    });
  }

  loadUserBalanceAfterSettingGoals(): void {
    this.transactionService.getUserBalanceAfterSettinigGoals().subscribe(balance => {
      this.balance = balance
    });
  }

  getTotalGoal(goalId: number): number {
    const goal = this.financialGoals.find(goal => goal.id === goalId);
    return goal ? goal.sum : 0;
  }

  calculateProgressPercentage(goal: FinancialGoal): number {
    const totalGoal = this.getTotalGoal(goal.id);

    if (totalGoal === 0 || this.balance <= 0) {
      return 0;
    }

    const result = Math.min((this.balance / totalGoal) * 100, 100);
    return Math.round(result);
  }

  noFinancialGoals(): boolean {
    return this.financialGoals.length === 0;
  }

  deleteGoal(id: number): void {
    this.financialGoalService.deleteGoalById(id).subscribe(
      () => {
        this.financialGoals = this.financialGoals.filter(goal => goal.id !== id);
        this.loadUserBalanceAfterSettingGoals();
        console.log(`Goal with id ${id} deleted successfully`);
      },
      (error) => {
        console.error(`Error deleting goal with id ${id}:`, error);
      }
    );
  }
}
