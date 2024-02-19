import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/transaction.model';
import { TransactionService } from '../../core/transaction.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { UserData, UserService } from '../../shared/user.service';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss']
})
export class TransactionOverviewComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService, private userService: UserService, private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.getTransactions();
  }
  
  getTransactions(){
    const token = this.cookieService.get('authToken');
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.sub;
    this.transactionService.getTransactionsByUserId(userId).subscribe(
      (content: Transaction[]) => {
        this.transactions = content;
        this.transactions.forEach(c => {console.log(c);})
      }
      ,(error) => {
        console.error('Error fetching transactions:', error);
      }
    )
  }  
}
