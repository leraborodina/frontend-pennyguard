import { Component, OnInit } from '@angular/core';
import { FinancialGoal } from '../../shared/interfaces/financial-goal.interface';
import { FinancialGoalService } from '../../core/services/financial-goal.service';
import { Router } from '@angular/router';

/**
 * Компонент для отображения карточки финансовых целей.
 */
@Component({
  selector: 'financial-goal-card',
  templateUrl: './financial-goal-card.component.html',
  styleUrls: ['./financial-goal-card.component.scss']
})
export class FinancialGoalCardComponent implements OnInit {
  goals: FinancialGoal[] = [];
  errorMessage: string = '';

  constructor(
    private financialGoalService: FinancialGoalService,
    private router: Router
  ) { }

  /**
   * Вызывается при инициализации компонента.
   */
  ngOnInit(): void {
    this.getFinancialGoals();
  }

  /**
   * Получает список финансовых целей.
   */
  getFinancialGoals(): void {
    this.financialGoalService.getFinancialGoals().subscribe(
      (goals: FinancialGoal[]) => {
        this.goals = goals.slice(0, 3);
        console.log(this.goals)
      },
      (error) => {
        console.error('Ошибка при получении финансовых целей:', error);
        this.setErrorMessages(error);
      }
    );
  }

  /**
   * Перенаправляет на страницу создания финансовой цели.
   */
  navigateToCreateGoal(): void {
    this.router.navigate(['/financial-goal-form']);
  }

  /**
   * Перенаправляет на страницу со всеми финансовыми целями.
   */
  navigateToGoals(): void {
    this.router.navigate(['/app-financial-goal-overview']);
  }

  /**
   * Устанавливает сообщение об ошибке.
   * @param error Ошибка.
   */
  setErrorMessages(error: any): void {
    this.errorMessage = 'Ошибка при получении данных';
  }
}
