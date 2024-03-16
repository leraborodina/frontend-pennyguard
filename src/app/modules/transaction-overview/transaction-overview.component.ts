import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../shared/models/category.model';
import { UserData, UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss'],
})
export class TransactionOverviewComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  userData: UserData | null = null;
  subscription: Subscription | undefined;

  errorMessage: string = '';

  // Form controls for filtering
  searchControl = new FormControl('');
  categoriesControl = new FormControl('');
  transactionTypeControl = new FormControl('');
  minAmountControl = new FormControl('', Validators.min(0));
  maxAmountControl = new FormControl('');
  minDateControl = new FormControl('');

  maxDate = new Date(); // Initialize maxDate to today's date
  maxDateControl = new FormControl({value: '', max: this.maxDate});

  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  dataSource = new MatTableDataSource<Transaction>();
  categories:  Category[] = [];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.getCategories();
    this.verifyTokenAndFetchTransactions();
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

  verifyTokenAndFetchTransactions() {
    if (this.authService.checkTokenExpiration()) {
      // Token is valid, proceed to fetch transactions
      this.getTransactions();
    } else {
      console.log('Token is expired or invalid. Redirecting to login page...');
      this.router.navigate(['/login']);
    }
  }

  getTransactions() {
    this.subscription = this.transactionService
      .getTransactionsByUserId()
      .subscribe({
        next: (userTransactions: Transaction[]) => {
          this.transactions = userTransactions;
          this.dataSource.data = userTransactions;
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
          this.setErrorMessages(error);
        },
      });
  }

  setErrorMessages(error: any): void {
    switch (error?.status) {
      case 404:
        this.errorMessage =
          'Resource not found. Please check your request and try again.';
        break;
      case 401:
        this.errorMessage = 'Unauthorized. Please login again to continue.';
        break;
      case 500:
        this.errorMessage = 'Internal server error. Please try again later.';
        break;
      default:
        this.errorMessage = 'An error occurred. Please try again later.';
        break;
    }

    // Show error message using MatSnackBar
    this.showErrorMessage(this.errorMessage);
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration for which the snackbar will be displayed
      panelClass: ['error-snackbar'], // Add custom CSS class for styling
    });
  }

  applyFilters(): void {
    let filteredTransactions = this.transactions;
  
    // Filter by search query
    const searchValue = this.searchControl.value?.trim().toLowerCase();
    if (searchValue && searchValue !== '') {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.purpose.toLowerCase().includes(searchValue)
      );
    }
  
    // Filter by category
    const selectedCategory = this.categoriesControl.value;
    // if (selectedCategory) {
    //   filteredTransactions = filteredTransactions.filter(transaction =>
    //     transaction.categoryId === selectedCategory
    //   );
    // }
  
    // Filter by transaction type
    const selectedTransactionType = this.transactionTypeControl.value;
    // if (selectedTransactionType) {
    //   filteredTransactions = filteredTransactions.filter(transaction =>
    //     transaction.type === selectedTransactionType
    //   );
    // }
  
    // Filter by amount range
    const minAmountValue = this.minAmountControl.value;
    const minAmount = parseFloat(minAmountValue !== null ? minAmountValue : '0');
    const maxAmount = parseFloat(this.maxAmountControl.value || Number.MAX_VALUE.toString());
    if (!isNaN(minAmount) && !isNaN(maxAmount) && minAmount > 0) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.amount >= minAmount && transaction.amount <= maxAmount
      );
    }
  
  
    // Filter by date range
 

  
    this.filteredTransactions = filteredTransactions;
    this.dataSource.data = filteredTransactions;
  }
  

  deleteTransaction(transactionId: string): void {
    // Call the transaction service to delete the transaction
    // This implementation is an example, replace it with your actual delete logic
    // this.transactionService.deleteTransaction(transactionId).subscribe(
    //   (response) => {
    //     // Remove the deleted transaction from the local array
    //     this.transactions = this.transactions.filter((transaction) => transaction.id !== transactionId);
    //     this.applyFilters(); // Re-apply filters after deletion
    //     this.showSuccessMessage('Transaction deleted successfully.');
    //   },
    //   (error) => {
    //     console.error('Error deleting transaction:', error);
    //     this.setErrorMessages(error);
    //   }
    // );
  }

  viewTransaction(transactionId: string): void {
    // Navigate to the transaction details page
    // You can implement this method based on your application's routing structure
    this.router.navigate(['/transactions', transactionId]);
  }

  
  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }
}
