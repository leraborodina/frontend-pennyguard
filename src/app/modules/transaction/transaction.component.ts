import { Component, OnInit} from '@angular/core';
import { TransactionService } from '../../core/transaction.service';
import { UserData, UserService } from '../../shared/user.service';
import { AuthService } from '../../core/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, take } from 'rxjs';
import { Category } from '../../shared/category.model';
import { TransactionType } from '../../shared/transaction-type.model';
import { Transaction } from '../../shared/transaction.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})

export class TransactionComponent implements OnInit {

  userData$!: Observable<UserData | null>;
  transactionContent: string = '';
  categories: Category[] = [];
  transactionTypes: TransactionType[] = [];

  purpose: string = '';
  amount: number = 0.0;
  date: Date = new Date;
  regulary: boolean = false;
  selectedCategory: number = 0;
  selectedType: number = 0;
  userId: number = 0;

  constructor(private transactionService: TransactionService, private userService: UserService, private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.userData$ = this.userService.getUserData();
    this.getCategories();
    this.getTransactionTypes();
  }

  getTransactionTypes() {
    this.userData$.pipe(take(1)).subscribe((userData: UserData | null) => {
      const userEmail = userData ? userData.email : this.cookieService.get('userEmail');

      this.transactionService.getTransactionTypes(userEmail).subscribe(
        (content: TransactionType[]) => {
          this.transactionTypes = content;                   
          this.transactionTypes.forEach(c => {console.log(c);})
        },
        (error) => {
          console.error('Error fetching transaction types:', error);
        }
      );
    });
  }

  getCategories() {
    this.userData$.pipe(take(1)).subscribe((userData: UserData | null) => {
      const userEmail = userData ? userData.email : this.cookieService.get('userEmail');

      this.transactionService.getCategories(userEmail).subscribe(
        (content: Category[]) => {
          this.categories = content;         
          this.categories.forEach(c => {console.log(c);})
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
    });
  }

  createTransaction() {
    const token = this.cookieService.get('authToken');
    const decodedToken: any = jwtDecode(token);
    this.userId = decodedToken.sub;
    const transaction = new Transaction(this.userId, this.purpose, this.amount, this.date, this.regulary, this.selectedCategory, this.selectedType);
    console.log(transaction);
    this.transactionService.createTransaction(transaction).subscribe(response => {
      console.log(response)
    });
  }

  onCategoryChange(event: any) {
      this.selectedCategory = event.target.value;
      console.log(this.selectedCategory);
  }

  onTransactionTypeChange(event: any){
    this.selectedType = event.target.value;
    console.log(this.selectedType);
  }
}
