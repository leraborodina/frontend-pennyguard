import { Component } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';

@Component({
  selector: 'financial-goal-form',
  templateUrl: './financial-goal-form.component.html',
  styleUrls: ['./financial-goal-form.component.scss']
})
export class FinancialGoalFormComponent {
  financialGoal: FinancialGoal = {
    id: 0,
    name: '',
    sum: 0,
    startDate: '',
    endDate: '',
    monthCount: 0
  };

  message: string | null = null;
  messageType: 'error' | 'warning' | 'success' = 'error';

  constructor(private financialGoalService: FinancialGoalService) { }

  createFinancialGoal(): void {
    console.log(this.financialGoal)
    this.financialGoalService.createFinancialGoal(this.financialGoal)
      .subscribe(
        () => {
          // Reset form and set success message
          this.message = 'Цель успешно создана';
          this.messageType = 'success';
        },
        (error: unknown) => {
          // Set error message
          this.message = 'Ошибка при создании цели';
          console.error('Error creating financial goal:', error);
        }
      );
  }
}
