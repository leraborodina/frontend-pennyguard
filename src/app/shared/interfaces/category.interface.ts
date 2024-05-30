export interface Category {
  id: number;
  name: string;
  isDefault?: boolean;
  userId?: number;
  typeId: number;
}