import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/userdata.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_DATA_KEY = 'user_data';

  constructor() {}

  setUserData(userData: UserData): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  getUserData(): UserData | null {
    const userDataString = localStorage.getItem(this.USER_DATA_KEY);
    return userDataString ? JSON.parse(userDataString) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
  }
}

export { UserData };
