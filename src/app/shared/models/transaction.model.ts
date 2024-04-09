export class Transaction {
  id: number | null = null;
  purpose: string = '';
  amount: number = 0.0;
  date: Date = new Date();
  regular: boolean = false;
  categoryId: number = 0;
  transactionTypeId: number = 0;
  editing: boolean = false; // Added editing property

  constructor(
    id: number | null,
    purpose: string,
    amount: number,
    date: Date,
    regular: boolean,
    selectedCategory: number,
    selectedType: number,
    editing: boolean // Added editing parameter
  ) {
    this.id = id;
    this.purpose = purpose;
    this.amount = amount;
    this.date = date;
    this.regular = regular;
    this.categoryId = selectedCategory;
    this.transactionTypeId = selectedType;
    this.editing = editing; // Initialize editing property
  }

  // Define an index signature
  [key: string]: number | string | Date | boolean | null;
}
