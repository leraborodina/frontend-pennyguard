export class Category {
  id: number;
  value: string;
percent: any;
totalAmount: any;

  constructor(id: number, name: string) {
    this.id = id;
    this.value = name;
  }
}
