import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialGoalService } from '../../../core/services/financial-goal.service';
import { FinancialGoal } from '../../../shared/interfaces/financial-goal.interface';

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
      name: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0.01)]],
      monthCount: [0, Validators.required]
    });
  }

  createFinancialGoal(): void {
    if (this.financialGoalForm.valid) {
      const formData = this.financialGoalForm.value;

      const financialGoal: FinancialGoal = {
        id: 0,
        name: formData.name,
        sum: formData.sum,
        startDate: '',
        endDate: '',
        monthCount: formData.monthCount,
      };

      this.financialGoalService.createFinancialGoal(financialGoal).subscribe(
        () => this.router.navigate(['/financial-goal-overview']),
        error => {
          this.errorMessage = error;
        }
      );
    } else {
      console.log('invalid')
      this.financialGoalForm.markAllAsTouched();
    }
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
