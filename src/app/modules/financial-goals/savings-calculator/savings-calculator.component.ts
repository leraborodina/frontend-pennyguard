import { Component } from '@angular/core';

@Component({
  selector: 'savings-calculator',
  templateUrl: './savings-calculator.component.html',
  styleUrls: ['./savings-calculator.component.scss']
})
export class SavingsCalculatorComponent {
  savingsSum: number | null = null;
  months: number | null = null;
  monthlyRate: number | null = null;

  /**
  * Расчитывает месячную норму накоплений.
  */
  calculateMonthlyRate() {
    if (this.savingsSum !== null && this.months !== null && this.months > 0) {
      this.monthlyRate = this.savingsSum / this.months;
    } else {
      this.monthlyRate = null;
    }
  }
}
