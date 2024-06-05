import { Component } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'financial-goal-form',
  templateUrl: './financial-goal-form.component.html',
  styleUrls: ['./financial-goal-form.component.scss']
})
export class FinancialGoalFormComponent {
  financialGoalForm: FormGroup;
  financialGoal?: FinancialGoal;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private financialGoalService: FinancialGoalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.financialGoalForm = this.fb.group({
      id: null,
      name: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0.01)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      monthCount: [0, Validators.required]
    });
  }

  /**
     * Создает новую финансовую цель.
     */
  createFinancialGoal(): void {
    const formData = this.financialGoalForm.value;

    const financialGoal: FinancialGoal = {
      name: formData.name,
      sum: formData.sum,
      startDate: formData.startDate,
      endDate: formData.endDate,
      monthCount: formData.monthCount,
      id: 0
    };

    this.financialGoalService.createFinancialGoal(financialGoal).subscribe(
      () => this.router.navigate(['/financial-goal-overview']),
      error => {
        this.errorMessage = error;
      }
    );
  }

  /**
    * Проверяет, является ли поле недопустимым.
    * @param field Имя поля формы.
    * @returns true, если поле недопустимо, в противном случае - false.
    */
  isFieldInvalid(field: string): boolean {
    const control = this.financialGoalForm.get(field);
    if (!control) {
      return false;
    }

    if (control.value === 0) {
      control.setErrors({ 'required': true });
    }
    return control.invalid && (control.dirty || control.touched);
  }
}
