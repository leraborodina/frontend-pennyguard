import { Injectable } from '@angular/core';
import { urls } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Category } from '../shared/models/category.model';
import { TransactionType } from '../shared/models/transaction-type.model';
import { Transaction } from '../shared/models/transaction.model';
import { User } from '../shared/models/user.model';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly transactionEndpoint = `${urls.baseUrl}/transactions`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  getCategories(): Observable<Category[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .get<Category[]>(`${this.transactionEndpoint}/categories`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in get categories request:', error);
          return throwError(error);
        }),
      );
  }

  getTransactionTypes(email: string): Observable<TransactionType[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });

    return this.http
      .get<
        TransactionType[]
      >(`${this.transactionEndpoint}/transactionTypes`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error in transaction type request:', error);
          return throwError(error);
        }),
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
        }),
      );
  }

  updateTransaction(transaction: Transaction, id: number | null): Observable<Transaction> {
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
        }),
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
        map(transactions => {
          return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }),
        catchError((error) => {
          console.error('Error in transaction overview request:', error);
          return throwError(error);
        }),
      );
}

getTransactionById(id: number): Observable<any>{
  const authToken = this.cookieService.get('authToken');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `${authToken}`
  });
  
  return this.http.get<Transaction>(`${this.transactionEndpoint}/${id}`, { headers });
} 

  deleteTransactionById(id: number | null): Observable<any>{
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${authToken}`
    });
    
    return this.http.delete(`${this.transactionEndpoint}/${id}`, { headers });
  } 
}
