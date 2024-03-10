import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/transaction.service';
import { UserData, UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  userData: UserData | null = null;
  transactionContent: string = '';
  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];

  purpose: string = '';
  amount: number = 0.0;
  date: Date = new Date();
  regulary: boolean = false;
  selectedCategory: number = 0;
  selectedType: number = 0;
  userId: number = 0;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    // Get the user data directly
    this.userData = this.userService.getUserData();
    // Fetch categories and transaction types
    this.getCategories();
    this.getTransactionTypes();
  }
  
  getTransactionTypes() {
    const userEmail = this.userData?.email ?? this.cookieService.get('userEmail');

    this.transactionService.getTransactionTypes(userEmail).subscribe(
      (content: TransactionType[]) => {
        this.transactionTypes = content;
      },
      (error) => {
        console.error('Error fetching transaction types:', error);
      },
    );
  }

  getCategories() {
    const userEmail = this.userData?.email ?? this.cookieService.get('userEmail');

    this.transactionService.getCategories(userEmail).subscribe(
      (content: Category[]) => {
        this.categories = content;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      },
    );
  }

  createTransaction() {
    const token = this.cookieService.get('authToken');
    const decodedToken: any = {}; // Implement decoding logic
    this.userId = decodedToken.sub;
    const transaction = new Transaction(
      this.userId,
      this.purpose,
      this.amount,
      this.date,
      this.regulary,
      this.selectedCategory,
      this.selectedType,
    );

    this.transactionService.createTransaction(transaction).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error creating transaction:', error);
      }
    );
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  onTransactionTypeChange(event: any) {
    this.selectedType = event.target.value;
  }
}
