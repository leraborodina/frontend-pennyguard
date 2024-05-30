import { Component } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/interfaces/category.interface';
import { UtilsService } from '../../shared/services/utils.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-category-overview',
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

  updateCategory(category: Category) {
    this.router.navigate(['/category-form', category.id]);
  }

  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      // Assuming you want to remove the deleted category from the UI
      this.categories = this.categories.filter(c => c.id !== category.id);
    });
  }

  resolveTransactionType(typeId: number): string {
    return this.utilsService.getTransactionTypeNameById(typeId); // Use UtilsService method
  }
}
