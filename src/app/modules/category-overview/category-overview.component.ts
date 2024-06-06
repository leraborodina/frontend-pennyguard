import { Component } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/interfaces/category.interface';
import { UtilsService } from '../../shared/services/utils.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'category-overview',
  templateUrl: './category-overview.component.html',
  styleUrl: './category-overview.component.scss'
})
export class CategoryOverviewComponent {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getUserCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  updateCategory(id: number) {
    this.router.navigate(['/category-form', id]);
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(category => category.id !== id);
    });
  }

  resolveTransactionType(typeId: number): string {
    return this.utilsService.getTransactionTypeNameById(typeId); 
  }
}
