import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../interfaces/userdata.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject: BehaviorSubject<string | undefined>;
  private readonly USER_DATA_KEY = 'user_data';

  constructor() {
    const storedUserData = this.getUserData();
    const initialUsername = storedUserData ? `${storedUserData.firstname} ${storedUserData.lastname}` : undefined;
    this.usernameSubject = new BehaviorSubject<string | undefined>(initialUsername);
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
    const userData = this.getUserData() || {} as UserData;
    userData.firstname = username.split(' ')[0];
    userData.lastname = username.split(' ')[1];
    this.setUserData(userData);
  }

  getUsername(): Observable<string | undefined> {
    return this.usernameSubject.asObservable();
  }

  setUserData(userData: UserData): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  getUserData(): UserData | null {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    return userDataString ? JSON.parse(userDataString) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    this.usernameSubject.next(undefined);
  }
}

export { UserData };
