import { Component, OnInit } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';


@Component({
  selector: 'financial-goal-form',
  templateUrl: './financial-goal-form.component.html',
  styleUrl: './financial-goal-form.component.scss'
})
export class FinancialGoalFormComponent implements OnInit {

  financialGoal: FinancialGoal = {
    id: 0,
    name: '',
    sum: 0,
    endDate: 0
  };

  constructor(private financialGoalService: FinancialGoalService) { }

  ngOnInit(): void {
  }

  createFinancialGoal(): void {
    this.financialGoalService.createFinancialGoal(this.financialGoal)
      .subscribe(() => {
        // Reset form or show success message
        console.log('Financial goal created successfully');
      }, (error: unknown) => {
        console.error('Error creating financial goal:', error);
      });
  }
}
