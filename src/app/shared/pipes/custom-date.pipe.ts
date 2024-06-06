import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(value: any, format: string): any {
    let date: Date | null = null;

    if (value instanceof Date) {
      date = value;
    } else if (Array.isArray(value) && value.length >= 3) {
      const [year, month, day] = value;
      date = new Date(year, month - 1, day);
    } else if (typeof value === 'string') {
      date = new Date(value);
    }

    if (date && !isNaN(date.getTime())) {
      return this.datePipe.transform(date, format);
    }

    console.error('Invalid date value:', value);
    return '';
  }
}
