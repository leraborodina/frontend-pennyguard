import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";

export class Transaction {
    userId: number = 0;
    purpose: string = '';
    amount: number = 0.0;
    date: Date = new Date;
    regular: boolean = false;
    categoryId: number = 0;
    transactionTypeId: number = 0;

    constructor( userId: number, purpose: string, amount: number, date: Date, regulary: boolean, selectedCategory: number, selectedType: number){
        this.userId = userId;
        this.purpose = purpose;
        this.amount = amount;
        this.date = date;
        this.regular = regulary;
        this.categoryId = selectedCategory;
        this.transactionTypeId = selectedType; 
    }
  }
  