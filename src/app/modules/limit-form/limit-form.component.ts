import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';
import { Limit } from '../../shared/interfaces/limit.interface';
import { CategoryService } from '../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LimitService } from '../../core/services/category-limit.service';

@Component({
  selector: 'limit-form',
  templateUrl: './limit-form.component.html',
  styleUrls: ['./limit-form.component.scss'],
})
export class LimitFormComponent implements OnInit {
  limitForm: FormGroup;
  categories$?: Observable<Category[]>;
  limit?: Limit;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private limitService: LimitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.limitForm = this.fb.group({
      id: null,
      amount: ['', [Validators.required, Validators.min(0.01)]],
      startDay: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      categoryId: [0, Validators.required],
    });
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    // Получение и загрузка лимита по ID, если таковой передан в параметрах маршрута
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.limitService.getLimitById(+id);
        }
        return [];
      })
    ).subscribe(limit => {
      this.limit = limit;

      // Заполнение формы данными лимита
      this.limitForm.patchValue({
        id: this.limit?.id,
        amount: this.limit?.amount,
        startDay: this.limit?.startDay,
        categoryId: this.limit?.categoryId,
      });
    });
  }

  /**
   * Создает новый лимит или обновляет существующий в зависимости от валидности формы.
   */
  createOrUpdate(): void {
    if (this.limitForm.invalid) {
      this.limitForm.markAllAsTouched();
      return;
    }

    if (this.limit) {
      this.updateLimit();
    } else {
      this.createLimit();
    }
  }

  /**
   * Создает новый лимит.
   */
  createLimit() {
    const formData = this.limitForm.value;

    const limit: Limit = {
      amount: formData.amount,
      startDay: formData.startDay,
      categoryId: formData.categoryId,
    };

    this.limitService.createLimit(limit).subscribe(
      () => this.router.navigate(['/limit-overview']),
      error => {
        this.errorMessage = error;
      },
    );
  }

  /**
   * Обновляет существующий лимит.
   */
  updateLimit() {
    const formData = this.limitForm.value;

    const limit: Limit = {
      id: formData.id,
      amount: formData.amount,
      startDay: formData.startDay,
      categoryId: formData.categoryId,
    };

    this.limitService.updateLimit(limit).subscribe(
      () => this.router.navigate(['/limit-overview']),
      error => {
        console.error('Ошибка при обновлении лимита:', error);
      },
    );
  }

  /**
   * Проверяет, является ли поле недопустимым.
   * @param field Имя поля формы.
   * @returns true, если поле недопустимо, в противном случае - false.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.limitForm.get(field);
    if (!control) {
      return false;
    }

    if (control.value === 0) {
      control.setErrors({ 'required': true });
    }
    return control.invalid && (control.dirty || control.touched);
  }
}
