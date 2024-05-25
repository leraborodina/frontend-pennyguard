import { Component, OnInit } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-goal-card',
  templateUrl: './financial-goal-card.component.html',
  styleUrl: './financial-goal-card.component.scss'
})
export class FinancialGoalCardComponent implements OnInit {
  goals: FinancialGoal[] = [];
  errorMessage: string = '';

  constructor(
    private financialGoalService: FinancialGoalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFinancialGoals();
  }

  getFinancialGoals() {
    this.financialGoalService.getFinancialGoals().subscribe(
      (goals: FinancialGoal[]) => {
        this.goals = goals.slice(0, 3);
      },
      (error) => {
        console.error('Error fetching financial goals:', error);
        this.setErrorMessages(error);
      }
    );
  }

  navigateToCreateGoal(): void {
    this.router.navigate(['/app-financial-goal-overview']);
  }

  setErrorMessages(error: any): void {
    this.errorMessage = 'Fehler beim Abrufen der Daten';
  }
}
