import { Component, OnInit } from '@angular/core';
import { LimitService } from '../../core/services/category-limit.service';
import { Limit } from '../../shared/interfaces/limit.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-limits',
  templateUrl: './category-limits.component.html',
  styleUrls: ['./category-limits.component.scss'],
})
export class CategoryLimitsComponent implements OnInit {
  limits: Limit[] = [];
  categories: Category[] = [];
  errorMessage: string = '';

  constructor(private limitService: LimitService, private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.getLimits();
    this.getCategories();
  }

  getLimits() {
    this.limitService.getLimits().subscribe(
      (limits: Limit[]) => {
        this.limits = limits.slice(0, 3);
      },
      (error: any) => {
        console.error('Error fetching category limits:', error);
        this.setErrorMessages(error);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
        this.setErrorMessages(error);
      }
    );
  }

  getCategoryName(categoryId?: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unbekannt';
  }

  navigateToCreateLimit(): void {
    this.router.navigate(['/limit-form']);
  }

  setErrorMessages(error: any): void {
    this.errorMessage = 'Fehler beim Abrufen der Daten';
  }
}
