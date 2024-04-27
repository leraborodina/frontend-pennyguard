import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { UserData, UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Category } from '../../shared/models/category.model';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorHandlerService } from '../../services/global-error-handler.service.service';
import { Transaction } from '../../shared/models/transaction.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  userData: UserData | null = null;
  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];
  transaction: Transaction = {} as Transaction;

  purpose: string = '';
  createdAt: any;
  amount!: number;
  regular: boolean = false;
  categoryId!: number;
  typeId!: number;

  date: string = '';  
  time: string = '';

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private userService: UserService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private globalErrorHandlingService: GlobalErrorHandlerService
  ) { }
  
  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.getCategories();
    this.getTransactionTypes();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getTransaction(id);
      }
    });
  }
  
  getTransaction(id: number) {
    this.transactionService.getTransactionById(id).subscribe(
      (transaction: Transaction) => {
        this.transaction = this.transactionService.mapTransactionFromBackend(transaction);
 
        console.log(this.transaction)
        this.purpose = this.transaction.purpose;
        this.amount = this.transaction.amount;
        this.regular = this.transaction.regular;
        this.categoryId = this.transaction.categoryId;
        this.typeId = this.transaction.typeId;

        const [formattedDate, formattedTime] = this.transaction.createdAt.split(' ');

        const [day, month, year] = formattedDate.split('.');
        const isoFormattedDate = `${year}-${month}-${day}`;

        this.date = isoFormattedDate;
        this.time = formattedTime;
      },
      (error) => {
        console.error('Error fetching transaction:', error);
      }
    );
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
    this.categoryService.getCategories().subscribe(
      (content: Category[]) => {
        this.categories = content;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      },
    );
  }

  createOrUpdate(){
    if (!this.transaction.id) {
      this.createTransaction();
    } else {
      this.updateTransaction();
    }
  }

  createTransaction() {
    // Combine date and time strings into a single Date object
    const dateTimeString = `${this.date}T${this.time}`;
    const formattedDateTime = new Date(dateTimeString);
  
    // Create the transaction object
    const transaction: Transaction = {
      purpose: this.purpose,
      amount: this.amount,
      createdAt: formattedDateTime.toISOString(), // Format date to ISO string
      regular: this.regular,
      categoryId: this.categoryId,
      typeId: this.typeId
    }
  
    // Call the service to create the transaction
    this.transactionService.createTransaction(transaction).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error('Error creating transaction:', error);
        this.globalErrorHandlingService.handleError(error);
      }
    );
  }


  updateTransaction() {
    console.log(this.transaction);
    this.transactionService.updateTransaction(this.transaction).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/transaction-overview']);
      },
      (error) => {
        console.error('Error updating transaction:', error);
      }
    );
  }

  onCategoryChange(event: any) {
    this.transaction.categoryId = event.target.value;
  }

  onTransactionTypeChange(event: any) {
    this.transaction.typeId = event.target.value;
  }
}
