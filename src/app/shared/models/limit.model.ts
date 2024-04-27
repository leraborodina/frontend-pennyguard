export class Limit {
    id: number | null = null;
    userId: number = 0;
    categoryId: number = 0;
    createdAt: Date = new Date();
    limitType: string = "";
    limitValue: number = 0; 

    constructor(
        id: number | null,
        userId: number,
        categoryId: number,
        createdAt: Date,
        limitType: string,
        limitValue: number
    ){
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.createdAt = createdAt;
        this.limitType = limitType;
        this.limitValue = limitValue;
    }
}