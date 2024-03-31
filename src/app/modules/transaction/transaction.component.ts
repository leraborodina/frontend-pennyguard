import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { UserData, UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { TransactionType } from '../../shared/models/transaction-type.model';
import { Transaction } from '../../shared/models/transaction.model';
import { ActivatedRoute, Route, Router } from '@angular/router';

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
  isEditing: boolean = false;
  transactionId: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the user data directly
    this.userData = this.userService.getUserData();
    // Fetch categories and transaction types
    this.getCategories();
    this.getTransactionTypes();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.transactionId = id;
        console.log('Transaction ID:', this.transactionId);
        // Здесь вы можете выполнить действия с полученным идентификатором, например, загрузить данные транзакции для редактирования
      }
    });
    if (this.transactionId !== null) {
      this.getTransaction(this.transactionId);
    }
  }

  getTransaction(id: number) {
    // Получаем данные о редактируемой транзакции
    this.transactionService.getTransactionById(id).subscribe(
      (transaction: Transaction) => {
        // Заполняем форму данными редактируемой транзакции
        this.purpose = transaction.purpose;
        this.amount = transaction.amount;
        this.date = transaction.date;
        this.regulary = transaction.regular;
        this.selectedCategory = transaction.categoryId;
        this.selectedType = transaction.transactionTypeId;
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
    this.transactionService.getCategories().subscribe(
      (content: Category[]) => {
        this.categories = content;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      },
    );
  }

  createOrUpdate(){
    if(this.transactionId == null){
      console.log("if")
      this.createTransaction();
    } else{
      console.log("else", this.transactionId)
      this.updateTransaction();
    }
  }

  createTransaction() {
    const transaction = new Transaction(
      0,
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

  updateTransaction() {
    const transaction = new Transaction(
      this.transactionId,
      this.purpose,
      this.amount,
      this.date,
      this.regulary,
      this.selectedCategory,
      this.selectedType,
    );
      console.log(transaction);
    this.transactionService.updateTransaction(transaction, this.transactionId).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/transaction-overview'])
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
