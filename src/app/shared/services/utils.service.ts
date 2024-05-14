import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private monthNames = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ];
  
  constructor() {}

  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  getMonthNames(): string[]{
    return this.monthNames;    
  }
}