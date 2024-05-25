import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';
import { Limit } from '../../shared/interfaces/limit.interface';
import { CategoryService } from '../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LimitService } from '../../core/services/category-limit.service';

@Component({
  selector: 'app-limit-form',
  templateUrl: './limit-form.component.html',
  styleUrls: ['./limit-form.component.scss'],
})
export class LimitFormComponent implements OnInit {
  limitForm: FormGroup;

  categories$!: Observable<Category[]>;
  limit?: Limit;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private limitService: LimitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.limitForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      salaryDay: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
      categoryId: [0, Validators.required],
    });

    this.setMaxDate();
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.limitService.getLimitById(+id);
        }
        throw new Error('ID not provided');
      })
    ).subscribe(limit => {
      this.limit = limit;
      this.limitForm.patchValue({
        amount: this.limit?.amount,
        salaryDay: this.limit?.salaryDay,
        categoryId: this.limit?.categoryId,
      });
    });
  }

  createOrUpdate(): void {
    if (!this.limitForm.valid) {
      this.limitForm.markAllAsTouched();
    } else {
      if (this.limit) {
        this.updateLimit();
      } else {
        this.createLimit();
      }
    }
  }

  createLimit() {
    const formData = this.limitForm.value;

    const limit: Limit = {
      amount: formData.amount,
      salaryDay: formData.salaryDay,
      categoryId: formData.categoryId,
    };

    this.limitService.createLimit(limit).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/limit-overview']);
      },
      (error) => {
        console.error('Error creating limit:', error);
      },
    );
  }

  updateLimit() {
    const formData = this.limitForm.value;

    const limit: Limit = {
      ...this.limit,
      ...formData,
    };

    this.limitService.updateLimit(limit).subscribe(
      (response) => {
        this.router.navigate(['/limit-overview']);
      },
      (error) => {
        console.error('Error updating limit:', error);
      },
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.limitForm.get(field);
    return !!control && (control.invalid && (control.dirty || control.touched));
  }

  isRequired(field: string): boolean {
    const control = this.limitForm.get(field);
    return !!control && !!control.errors?.['required'];
  }

  private setMaxDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.maxDate = `${year}-${month}-${day}`;
  }
}
