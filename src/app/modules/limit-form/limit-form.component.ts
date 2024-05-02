import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { LimitService } from '../../services/limit.service';
import { Limit } from '../../shared/models/limit.model'; // Import Limit interface
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-limit-form',
  templateUrl: './limit-form.component.html',
  styleUrls: ['./limit-form.component.scss']
})
export class LimitFormComponent implements OnInit {
  categories: Category[] = [];
  limit: Limit = {
    amount: 0.00,
    salaryDay: 1
  };

  constructor(
    private limitService: LimitService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (content: Category[]) => this.categories = content,
      (error) => console.error('Error fetching categories:', error)
    );
  }

  onCategoryChange(event: any): void {
    this.limit.categoryId = event.target.value; 
  }

  createLimit(): void {
    this.limitService.createLimit(this.limit).subscribe( 
      (response) => console.log(response),
      (error) => console.error('Error creating limit:', error)
    );
  }
}
