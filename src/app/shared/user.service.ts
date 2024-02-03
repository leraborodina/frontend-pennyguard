import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);

  constructor(private cookieService: CookieService) { }

  /**
   * Set user data in both cookies and the BehaviorSubject.
   * @param userData - The user data to be set.
   */
  setUserData(userData: UserData): void {
    // Set user email in cookie for persistence
    this.cookieService.set('userEmail', userData.email);
    
    // Update the BehaviorSubject with new user data
    this.userDataSubject.next(userData);
  }

  /**
   * Get the current user data as an observable.
   * @returns Observable<UserData | null> - An observable emitting user data changes.
   */
  getUserData(): Observable<UserData | null> {
    return this.userDataSubject.asObservable();
  }

  /**
   * Get the current user data synchronously.
   * @returns UserData | null - The current user data.
   */
  getCurrentUserData(): UserData | null {
    return this.userDataSubject.value;
  }

  /**
   * Clear user data, e.g., on logout.
   */
  clearUserData(): void {
    // Clear user email cookie
    this.cookieService.delete('userEmail');
    
    // Clear the BehaviorSubject by emitting null
    this.userDataSubject.next(null);
  }
}

/**
 * Interface representing user data.
 */
export interface UserData {
  email: string;
  // Add other user-related fields as needed
}
