import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  /**
   * Преобразует значение даты в указанный формат.
   * @param value Значение даты для преобразования.
   * @param format Формат, в который нужно преобразовать дату.
   * @returns Преобразованная дата в виде строки.
   */
  transform(value: any, format: string): any {
    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (Array.isArray(value) && value.length === 7) {
      date = new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[5], value[6]);
    } else if (typeof value === 'string') {
      // Попытка разбора строки как ISO-даты
      date = new Date(value);
    }

    if (date && !isNaN(date.getTime())) {
      // Преобразование даты в ISO-строку и затем использование DatePipe
      const isoString = date.toISOString();
      return this.datePipe.transform(isoString, format);
    }

    console.error('Неверное значение даты:', value);
    return ''; // Возвращаем пустую строку для недопустимых дат
  }
}
