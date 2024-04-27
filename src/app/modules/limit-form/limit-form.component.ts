import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { LimitType } from '../../shared/models/limit-type.model';
import { TransactionService } from '../../services/transaction.service';
import { LimitService } from '../../services/limit.service';
import { Limit } from '../../shared/models/limit.model';

@Component({
  selector: 'app-limit-form',
  templateUrl: './limit-form.component.html',
  styleUrl: './limit-form.component.scss'
})
export class LimitFormComponent implements OnInit{
  categories: Category[] = [];
  limitTypes: LimitType[] = [];

  userId: number = 0;
  categoryId: number = 0;
  createdAt: Date = new Date();
  limitType: string = "";
  limitValue: number = 0;

  constructor(
    private transactionService: TransactionService,
    private limitService: LimitService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getLimitTypes();
  }

  getCategories() {
    this.transactionService.getCategories().subscribe(
      (content: Category[]) => {
        this.categories = content;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      },
    );
  }

  getLimitTypes() {
    this.transactionService.getLimitTypes().subscribe(
      (content: LimitType[]) => {
        console.log(content);
        this.limitTypes = content;
      },
      (error) => {
        console.error('Error fetching limit types:', error);
      },
    );
  }

  onCategoryChange(event: any) {
    this.categoryId = event.target.value;
  }

  onLimitTypeChange(event: any){
    this.limitType = event.target.value;
  }

  createLimit(){
    // const formattedDateString: string | null = this.datePipe.transform(this.createdAt, 'yyyy-MM-dd HH:mm:ss');
    // const formattedDate = new Date(formattedDateString as string);
    // const limit = new Limit(
    //   0,
    //   this.userId,
    //   this.categoryId,
    //   formattedDate,
    //   this.limitType,
    //   this.limitValue
    // );

    // this.limitService.createLimit(limit).subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (error) => {
    //     console.error('Error creating limit:', error);
    //   }
    // )
  }
}
