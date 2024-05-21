import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  transactionForm: FormGroup;

  categories$!: Observable<Category[]>;
  transactionTypes$!: Observable<TransactionType[]>;
  transaction?: Transaction;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionForm = this.fb.group({
      purpose: ['', Validators.required],
      amount: ['', [Validators.required, this.validateAmount]],
      createdAt: ['', [Validators.required, this.validateDate]],
      regular: [false],
      categoryId: [0, Validators.required],
      typeId: [0, Validators.required],
    });

    this.setMaxDate();
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
    this.transactionTypes$ = this.transactionService.getTransactionTypes();

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.transactionService.getTransactionById(+id);
        }
        throw new Error('ID not provided');
      })
    ).subscribe(transaction => {
      this.transaction = transaction;
      this.transactionForm.patchValue({
        purpose: this.transaction.purpose,
        amount: this.transaction.amount,
        createdAt: transaction.createdAt.split('T')[0],
        regular: this.transaction.regular,
        categoryId: this.transaction.categoryId,
        typeId: this.transaction.typeId
      });
    });
  }

  createOrUpdate(): void {
    if (!this.transactionForm.valid) {
      this.transactionForm.markAllAsTouched();
    } else {
      if (this.transaction) {
        this.updateTransaction();
      } else {
        this.createTransaction();
      }
    }
  }

  createTransaction() {
    const formData = this.transactionForm.value;
    const formattedDateTime = this.formatDateTime(formData.createdAt);

    const transaction: Transaction = {
      purpose: formData.purpose,
      amount: formData.amount,
      createdAt: formattedDateTime,
      regular: formData.regular,
      categoryId: formData.categoryId,
      typeId: formData.typeId,
    };

    this.transactionService.createTransaction(transaction).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/transaction-overview']);
      },
      (error) => {
        console.error('Error creating transaction:', error);
      },
    );
  }

  updateTransaction() {
    const formData = this.transactionForm.value;
    const formattedDateTime = this.formatDateTime(formData.createdAt);

    const transaction: Transaction = {
      ...this.transaction,
      ...formData,
      createdAt: formattedDateTime,
    };

    this.transactionService.updateTransaction(transaction, transaction.id).subscribe(
      (response) => {
        this.router.navigate(['/transaction-overview']);
      },
      (error) => {
        console.error('Error updating transaction:', error);
      },
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!control && (control.invalid && (control.dirty || control.touched));
  }

  isFieldTouched(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!control && (control.dirty || control.touched);
  }

  isRequired(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!control && !!control.errors?.['required'];
  }

  isFutureDate(): boolean {
    const control = this.transactionForm.get('createdAt');
    const selectedDate = new Date(control?.value);
    const today = new Date();
    return selectedDate > today;
  }

  validateDate(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();

    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) {
      return { invalidDate: true };
    }

    return null;
  }

  validateAmount(control: AbstractControl): { [key: string]: boolean } | null {
    const amount = parseFloat(control.value);

    if (isNaN(amount)) {
      return null;
    }

    if (amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(control.value)) {
      return { invalidAmount: true };
    }

    return null;
  }

  private formatDateTime(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private setMaxDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.maxDate = `${year}-${month}-${day}`;
  }
}
