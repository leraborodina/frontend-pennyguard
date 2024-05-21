import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
 
import { Router } from '@angular/router';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.scss'],
})
export class TransactionEditComponent {
  dataSource: MatTableDataSource<Transaction>;
  displayedColumns: string[] = [
    'date',
    'category',
    'amount',
    'purpose',
    'regular',
    'transactionType',
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<TransactionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService,
    private router: Router,
  ) {
    const transactions = data.transactions.map((transaction: Transaction) => ({
      ...transaction,
      // Add editing flag
      editing: false,
    }));
    this.dataSource = new MatTableDataSource(transactions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(transaction: Transaction): void {
    // Toggle editing mode for the clicked row
    transaction.editing = !transaction.editing;
  }

  onApply(): void {
    console.log(this.dataSource.data);
    // Save changes and close the dialog
    this.transactionService.saveTransactions(this.dataSource.data).subscribe(
      (savedTransactions: Transaction[]) => {
        // Redirect to transaction overview page upon successful saving
        this.router.navigate(['/transaction-overview']);
        // Close the dialog
        this.dialogRef.close(savedTransactions);
      },
      (error) => {
        // Handle error if saving fails
        console.error('Error saving transactions:', error);
      },
    );
  }
  onCancel(): void {
    // Close the dialog without saving changes
    this.dialogRef.close();
  }

  isNullOrWhitespace(value: string): boolean {
    return value == null || value.trim() === '';
  }
}
