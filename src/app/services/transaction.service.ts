import { Injectable } from '@angular/core';
import { urls } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TransactionType } from '../shared/models/transaction-type.model';
import { Transaction } from '../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly transactionEndpoint = `${urls.baseUrl}/transactions`;
  private readonly uploadEndpoint = `${urls.baseUrl}/upload`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  getTransactionTypes(email: string): Observable<TransactionType[]> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .get<TransactionType[]>(`${this.transactionEndpoint}/transactionTypes`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in transaction type request:', error);
          return throwError(error);
        })
      );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });

    return this.http
      .post<Transaction>(this.transactionEndpoint, transaction, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in transaction create request:', error);
          return throwError(error);
        })
      );
  }

  saveTransactions(transactions: Transaction[]): Observable<Transaction[]> {
    const requests: Observable<Transaction>[] = [];
    transactions.forEach(transaction => {
      if (transaction.id) {
        requests.push(this.updateTransaction(transaction, transaction.id));
      } else {
        requests.push(this.createTransaction(transaction));
      }
    });
    return forkJoin(requests);
  }

  updateTransaction(transaction: Transaction, id?: number): Observable<Transaction> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });

    return this.http
      .put<Transaction>(`${this.transactionEndpoint}/${id}`, transaction, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in transaction update request:', error);
          return throwError(error);
        })
      );
  }

  getTransactionsByUserId(): Observable<Transaction[]> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });

    return this.http
      .get<Transaction[]>(`${this.transactionEndpoint}/user/`, { headers })
      .pipe(
        map((transactions: Transaction[]) => {
          return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }),
        catchError((error) => {
          console.error('Error in transaction overview request:', error);
          return throwError(error);
        })
      );
  }

  getTransactionById(id?: number): Observable<Transaction> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });

    return this.http.get<Transaction>(`${this.transactionEndpoint}/${id}`, { headers });
  }

  deleteTransactionById(id?: number): Observable<any> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });

    return this.http.delete(`${this.transactionEndpoint}/${id}`, { headers });
  }

  uploadPDF(pdfFile: File): Observable<Transaction[]> {
    const authToken = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `${authToken}`
    });

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    return this.http.post<any>(`${this.uploadEndpoint}/pdf`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Error uploading file:', error);
        return throwError(error);
      })
    );
  }

  mapTransactionFromBackend(transaction: any): Transaction {
    // Convert Unix timestamp to Date object
    const date = new Date(transaction.createdAt * 1000); // Convert Unix timestamp to milliseconds
    // Format the date to the desired format: "yyyy-MM-dd HH:mm:ss"
    const formattedCreatedAt = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
  
    // Map the properties to the Transaction interface
    return {
      id: transaction.id,
      purpose: transaction.purpose,
      amount: transaction.amount,
      createdAt: formattedCreatedAt,
      regular: transaction.regular,
      categoryId: transaction.categoryId,
      typeId: transaction.typeId
    };
  }
  
}
