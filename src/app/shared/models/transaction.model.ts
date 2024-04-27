export interface Transaction {
  id?: number;
  purpose: string;
  amount: number;
  createdAt: string;  
  regular: boolean;
  categoryId: number;
  typeId: number;
  editing?: boolean;
}
