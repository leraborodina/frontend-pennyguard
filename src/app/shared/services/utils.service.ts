import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { CategoryService } from '../../core/services/category.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { TransactionService } from '../../core/services/transaction.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private transactionTypes: BehaviorSubject<TransactionType[]> = new BehaviorSubject<TransactionType[]>([]);

  private monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];

  constructor(private datePipe: DatePipe, private categoryService: CategoryService, private transactionService: TransactionService) {
    this.loadCategories();
    this.loadTransactionTypes();
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => this.categories.next(categories),
      (error) => console.error('Error loading categories:', error)
    );
  }

  getCategoryNameById(categoryId: number): string {
    const categories = this.categories.getValue();
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unbekannte Kategorie';
  }

  getCategories(): Observable<Category[]> {
    return this.categories.asObservable();
  }

  private loadTransactionTypes(): void {
    this.transactionService.getTransactionTypes().subscribe(
      (types) => this.transactionTypes.next(types),
      (error) => console.error('Error loading transaction types:', error)
    );
  }

  getTransactionTypeNameById(typeId: number): string {
    const transactionTypes = this.transactionTypes.getValue();
    const type = transactionTypes.find(type => type.id === typeId);
    return type ? type.type : 'Unbekannte Kategorie';
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    return this.transactionTypes.asObservable();
  }

  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  getMonthNames(): string[] {
    return this.monthNames;
  }

  formatDateToLocalDateTimeString(date: Date): string {
    const formattedDate: string | null = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss');
    return formattedDate || '';
  }

  formatStringToLocalDateTimeString(date: string): string {
    const formattedDate: string | null = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss');
    return formattedDate || '';
  }
}
