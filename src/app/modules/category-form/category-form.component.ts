import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { UtilsService } from '../../shared/services/utils.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
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

  ngOnInit(): void {
    this.utilsService.getTransactionTypes().subscribe(
      (types: TransactionType[]) => {
        this.transactionTypes = types;
      },
      (error: any) => console.error('Ошибка при загрузке типов транзакций:', error)
    );

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.categoryService.getCategoryById(+id);
        }
        throw new Error('ID not provided');
      })
    ).subscribe(category => {
      this.category = category;

      this.categoryForm.patchValue({
        name: this.category.name,
        typeId: this.category.typeId
      });
    });
  }

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

  updateCategory() {
    const formData = this.categoryForm.value;
    console.log(formData)

    const category: Category = {
      ...this.category,
      ...formData
    };

    this.categoryService.updateCategory(category).subscribe(
      (response) => {
        this.router.navigate(['/category-overview']);
      },
      (error) => {
        console.error('Error updating transaction:', error);
      },
    );
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
      console.log(category);
      this.categoryService.createCategory(category).subscribe(
        () => this.router.navigate(['/categories']),
        (error) => {
          console.log(error.status == 409)
          if (error.status == 409) { // HTTP 409: Conflict - Duplicate key violation
            this.errorMessage = 'Категория уже существует.';
          } else if (error.status == 400) { // HTTP 400: Bad Request
            this.errorMessage = error.error; // Display the specific error message
          } else if (error.status == 500) { // HTTP 500: Internal Server Error
            this.errorMessage = 'Внутренняя ошибка сервера';
          } else {
            console.error('Ошибка при создании категории:', error);
            this.errorMessage = 'Неизвестная ошибка';
          }
        }
      );
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }


  isFieldInvalid(field: string): boolean {
    const control = this.categoryForm.get(field);
    return !!control && (control.invalid && (control.dirty || control.touched));
  }
}
