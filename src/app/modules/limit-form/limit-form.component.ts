import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/interfaces/category.interface';
import { LimitService } from '../../core/services/category-limit.service';
import { Limit } from '../../shared/interfaces/limit.interface'; // Import Limit interface
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-limit-form',
  templateUrl: './limit-form.component.html',
  styleUrls: ['./limit-form.component.scss'],
})
export class LimitFormComponent implements OnInit {
  categories: Category[] = [];
  limit: Limit = {
    amount: 0.0,
    salaryDay: 1,
  };

  constructor(
    private limitService: LimitService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (content: Category[]) => (this.categories = content),
      (error) => console.error('Error fetching categories:', error),
    );
  }

  onCategoryChange(event: any): void {
    this.limit.categoryId = event.target.value;
  }

  createLimit(): void {
    this.limitService.createLimit(this.limit).subscribe(
      (response) => console.log(response),
      (error) => console.error('Error creating limit:', error),
    );
  }
}
