import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Компонент формы транзакции.
 */
@Component({
  selector: 'transaction-form',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  categories$?: Observable<Category[]>;
  transactionTypes$?: Observable<TransactionType[]>;
  transaction?: Transaction;
  maxDate: string = '';
  maxTime: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Инициализация формы транзакции
    this.transactionForm = this.fb.group({
      purpose: ['', Validators.required],
      amount: ['', [Validators.required, this.validateAmount]],
      createdAt: ['', [Validators.required, this.validateDate]],
      createdAtTime: ['', Validators.required],
      regular: [false],
      categoryId: [0, Validators.required],
      typeId: [0, Validators.required],
    });

    // Установка максимальной даты и времени
    this.setMaxDate();
    this.setMaxTime();
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    // Получение списка категорий и типов транзакций
    this.categories$ = this.categoryService.getCategories();
    this.transactionTypes$ = this.transactionService.getTransactionTypes();

    // Получение транзакции по идентификатору, если он предоставлен
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.transactionService.getTransactionById(+id);
        }
        return [];
      })
    ).subscribe(transaction => {
      // Заполнение формы данными транзакции
      this.transaction = transaction;
      const [date, time] = transaction.createdAt.split('T');
      this.transactionForm.patchValue({
        purpose: transaction.purpose,
        amount: transaction.amount,
        createdAt: date,
        createdAtTime: time.slice(0, 5),
        regular: transaction.regular,
        categoryId: transaction.categoryId,
        typeId: transaction.typeId
      });
    });
  }

  /**
   * Создает или обновляет транзакцию в зависимости от наличия данных.
   */
  createOrUpdate(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.transaction) {
      this.updateTransaction();
    } else {
      this.createTransaction();
    }
  }

  /**
   * Создает новую транзакцию.
   */
  private createTransaction() {
    const formData = this.transactionForm.value;
    const formattedDateTime = this.formatDateTime(formData.createdAt, formData.createdAtTime);

    const transaction: Transaction = {
      purpose: formData.purpose,
      amount: formData.amount,
      createdAt: formattedDateTime,
      regular: formData.regular,
      categoryId: formData.categoryId,
      typeId: formData.typeId,
    };

    // Отправка запроса на создание транзакции
    this.transactionService.createTransaction(transaction).subscribe(
      () => {
        this.router.navigate(['/transaction-overview']);
      },
      (error) => {
        console.error('Ошибка при создании транзакции:', error);
      },
    );
  }

  /**
   * Обновляет существующую транзакцию.
   */
  private updateTransaction() {
    const formData = this.transactionForm.value;
    const formattedDateTime = this.formatDateTime(formData.createdAt, formData.createdAtTime);

    const transaction: Transaction = {
      ...this.transaction,
      ...formData,
      createdAt: formattedDateTime,
    };

    // Отправка запроса на обновление транзакции
    this.transactionService.updateTransaction(transaction, transaction.id).subscribe(
      () => {
        this.router.navigate(['/transaction-overview']);
      },
      (error) => {
        console.error('Ошибка при обновлении транзакции:', error);
      },
    );
  }

  /**
   * Проверяет, является ли поле недопустимым.
   * @param field Имя поля формы.
   * @returns true, если поле недопустимо, в противном случае - false.
   */
  isFieldInvalid(field: string): boolean {
    const control = this.transactionForm.get(field);
    if (!control) {
      return false;
    }
     
    if (control.value === 0) {
      control.setErrors({ 'required': true });
    }
    return control.invalid && (control.dirty || control.touched);
  }


  /**
   * Проверяет, было ли поле касание.
   * @param field Имя поля формы
   * @returns true, если поле было касание, в противном случае - false.
   */
  isFieldTouched(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!control && (control.dirty || control.touched);
  }

  /**
   * Проверяет, является ли поле обязательным.
   * @param field Имя поля формы.
   * @returns true, если поле обязательно, в противном случае - false.
   */
  isRequired(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!control && !!control.errors?.['required'];
  }

  /**
   * Проверяет, является ли выбранная дата будущей.
   * @returns true, если выбранная дата находится в будущем, в противном случае - false.
   */
  isFutureDate(): boolean {
    const control = this.transactionForm.get('createdAt');
    const selectedDate = new Date(control?.value);
    const today = new Date();
    return selectedDate > today;
  }

  /**
   * Проверяет допустимость введенной даты.
   * @param control Контроль, представляющий поле даты.
   * @returns Объект с ключом ошибки, если дата недопустима, в противном случае - null.
   */
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

  /**
   * Проверяет допустимость введенной суммы.
   * @param control Контроль, представляющий поле суммы.
   * @returns Объект с ключом ошибки, если сумма недопустима, в противном случае - null.
   */
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

  /**
   * Форматирует дату и время в строку.
   * @param date Дата.
   * @param time Время.
   * @returns Отформатированная строка даты и времени.
   */
  private formatDateTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  /**
   * Устанавливает максимальное значение для поля выбора даты.
   */
  setMaxDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.maxDate = `${year}-${month}-${day}`;
  }

  /**
   * Устанавливает максимальное значение для поля выбора времени.
   */
  setMaxTime(): void {
    const control = this.transactionForm.get('createdAt');
    const selectedDate = new Date(control?.value);
    const today = new Date();

    if (selectedDate.toDateString() === today.toDateString()) {
      const hours = ('0' + today.getHours()).slice(-2);
      const minutes = ('0' + today.getMinutes()).slice(-2);
      this.maxTime = `${hours}:${minutes}`;
    } else {
      this.maxTime = '23:59';
    }
  }

  /**
   * Проверяет, является ли выбранное время будущим.
   * @returns true, если выбранное время находится в будущем, в противном случае - false.
   */
  isFutureTime(): boolean {
    const controlDate = this.transactionForm.get('createdAt');
    const controlTime = this.transactionForm.get('createdAtTime');
    const selectedDate = new Date(controlDate?.value);
    const today = new Date();

    if (selectedDate.toDateString() === today.toDateString()) {
      const selectedTime = controlTime?.value;
      const currentTime = `${('0' + today.getHours()).slice(-2)}:${('0' + today.getMinutes()).slice(-2)}`;
      return selectedTime > currentTime;
    }
    return false;
  }
}

