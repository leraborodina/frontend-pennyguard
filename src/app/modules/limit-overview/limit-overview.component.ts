// src/app/components/limit-overview/limit-overview.component.ts
import { Component, OnInit } from '@angular/core';
import { Limit } from '../../shared/interfaces/limit.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';
import { LimitService } from '../../core/services/category-limit.service';

@Component({
  selector: 'app-limit-overview',
  templateUrl: './limit-overview.component.html',
  styleUrls: ['./limit-overview.component.scss'],
})
export class LimitOverviewComponent implements OnInit {
  limits: Limit[] = [];
  categories: Category[] = [];
  errorMessage: string = '';

  constructor(
    private limitService: LimitService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLimits();
    this.getCategories();
  }

  getLimits() {
    this.limitService.getLimits().subscribe(
      (limits: Limit[]) => {
        this.limits = limits;
      },
      (error: any) => {
        console.error('Ошибка при получении лимитов:', error);
        this.errorMessage = 'Ошибка при получении лимитов';
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Ошибка при получении категорий:', error);
        this.errorMessage = 'Ошибка при получении категорий';
      }
    );
  }

  getCategoryName(categoryId?: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Неизвестно';
  }

  deleteLimit(limitId: number | undefined): void {
    console.log(limitId)
    if (limitId !== undefined) {
      this.limitService.deleteLimit(limitId).subscribe(
        () => {
          this.limits = this.limits.filter(limit => limit.id !== limitId);
        },
        (error: any) => {
          console.error('Ошибка при удалении лимита:', error);
          this.errorMessage = 'Ошибка при удалении лимита';
        }
      );
    }
  }

  updateLimit(limitId?: number): void {
    this.router.navigate(['/limit-form', limitId]);
  }

  navigateToCreateLimit(): void {
    this.router.navigate(['/limit-form']);
  }
}
