import { Injectable } from '@angular/core';
import { urls } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../shared/category.model';
import { TransactionType } from '../shared/transaction-type.model';
import { Transaction } from '../shared/transaction.model';
import { User } from '../shared/user.model';
@Injectable({
    providedIn: 'root'})

export class TransactionService{

  private readonly transactionEndpoint = `${urls.baseUrl}/transactions`;
  
  constructor (private http: HttpClient, private cookieService: CookieService) { }

  getCategories(email: string): Observable<Category[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-User-Email': email
    })

    return this.http.get<Category[]>(`${this.transactionEndpoint}/categories`, { headers }).pipe(
      catchError(error => {
        console.error('Error in dashboard request:', error);
        return throwError(error);
      })
    );
  }

  getTransactionTypes(email: string): Observable<TransactionType[]> {
    const authToken = this.cookieService.get('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-User-Email': email
    })

    return this.http.get<TransactionType[]>(`${this.transactionEndpoint}/transactionTypes`, { headers }).pipe(
      catchError(error => {
        console.error('Error in transaction type request:', error);
        return throwError(error);
      })
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction>{
    return this.http.post<Transaction>(this.transactionEndpoint, transaction).pipe(
        catchError(error => {
          console.error('Error in transaction create request:', error);
          return throwError(error);
      })
    );
  }

  getTransactionsByUserId(userId: number): Observable<Transaction[]>{
    return this.http.get<Transaction[]>(`${this.transactionEndpoint}/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error in transaction overview request:', error);
        return throwError(error);
      }
    )
    );
  }
}