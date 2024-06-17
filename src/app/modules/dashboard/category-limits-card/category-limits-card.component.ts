import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LimitService } from '../../../core/services/category-limit.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/interfaces/category.interface';
import { Limit } from '../../../shared/interfaces/limit.interface';
 

/**
 * Компонент для отображения последних лимитов по категориям.
 */
@Component({
  selector: 'category-limits-card',
  templateUrl: './category-limits-card.component.html',
  styleUrls: ['./category-limits-card.component.scss'],
})
export class CategoryLimitsCardComponent implements OnInit {
  limits: Limit[] = [];
  categories: Category[] = [];
  errorMessage: string = '';

  constructor(
    private limitService: LimitService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  /**
   * Вызывается при инициализации компонента.
   */
  ngOnInit(): void {
    this.getLimits();
    this.getCategories();
  }

  /**
   * Получает лимиты категорий.
   */
  getLimits() {
    this.limitService.getLimits().subscribe(
      (limits: Limit[]) => {
        this.limits = limits.slice(0, 3);
      },
      (error: any) => {
        console.error('Ошибка получения лимитов по категориям:', error);
        this.setErrorMessages(error);
      }
    );
  }

  /**
   * Получает категории.
   */
  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Ошибка получения категорий:', error);
        this.setErrorMessages(error);
      }
    );
  }

  /**
   * Возвращает имя категории по ее идентификатору.
   * @param categoryId Идентификатор категории.
   * @returns Имя категории или "Неизвестно", если категория не найдена.
   */
  getCategoryName(categoryId?: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Неизвестно';
  }

  /**
   * Перенаправляет на страницу создания нового лимита.
   */
  navigateToCreateLimit(): void {
    this.router.navigate(['/limit-form']);
  }

  /**
   * Перенаправляет на страницу обзора всех лимитов.
   */
  navigateTLimits(): void {
    this.router.navigate(['/limit-overview']);
  }

  /**
   * Устанавливает сообщение об ошибке.
   * @param error Объект ошибки.
   */
  setErrorMessages(error: any): void {
    this.errorMessage = 'Ошибка получения данных';
  }
}
