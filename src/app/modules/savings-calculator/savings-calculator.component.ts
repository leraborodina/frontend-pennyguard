// savings-calculator.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'savings-calculator',
  templateUrl: './savings-calculator.component.html',
  styleUrls: ['./savings-calculator.component.scss']
})
export class SavingsCalculatorComponent {
  futureValue: number = 0;
  numberOfMonths: number = 0;
  monthlySavings: number = 0;
  minMonths: number = 2;

  calculateMonthlySavings(): void {
    if (this.isValidInput()) {
      this.monthlySavings = this.futureValue / this.numberOfMonths;
    }
  }

  isValidInput(): boolean {
    return this.futureValue > 0 && this.numberOfMonths >= this.minMonths;
  }
}
