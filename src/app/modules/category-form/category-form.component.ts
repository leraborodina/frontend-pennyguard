import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { UtilsService } from '../../shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../shared/interfaces/category.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  transactionTypes: TransactionType[] = [];
  category?: Category;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private utilsService: UtilsService,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      typeId: ['', Validators.required],
    });
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    // Загрузка типов транзакций при инициализации компонента
    this.utilsService.getTransactionTypes().subscribe(
      (types: TransactionType[]) => {
        this.transactionTypes = types;
      },
      (error: any) => console.error('Ошибка при загрузке типов транзакций:', error)
    );

    // Получение и загрузка категории по ID, если таковая передана в параметрах маршрута
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.categoryService.getCategoryById(+id);
        }
        return [];
      })
    ).subscribe(category => {
      this.category = category;

      // Заполнение формы данными категории
      this.categoryForm.patchValue({
        name: this.category.name,
        typeId: this.category.typeId
      });
    });
  }

  /**
   * Создает новую категорию или обновляет существующую в зависимости от валидности формы.
   */
  createOrUpdate(): void {
    if (!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
    } else {
      if (this.category) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    }
  }

  /**
   * Обновляет существующую категорию.
   */
  updateCategory() {
    const formData = this.categoryForm.value;

    const category: Category = {
      ...this.category,
      ...formData
    };

    this.categoryService.updateCategory(category).subscribe(
      () => this.router.navigate(['/category-overview']),
      (error) => {
        console.error('Error updating transaction:', error);
      },
    );
  }

  /**
   * Создает новую категорию.
   */
  createCategory(): void {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;

      this.categoryService.createCategory(category).subscribe(
        () => this.router.navigate(['/category-overview']),
        (error) => {
          this.errorMessage = error;
        }
      );
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  /**
   * Проверяет, является ли поле недопустимым.
   * @param field Имя поля формы.
   * @returns true, если поле недопустимо, в противном случае - false.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.categoryForm.get(field);
    return !!control && (control.invalid && (control.dirty || control.touched));
  }
}
