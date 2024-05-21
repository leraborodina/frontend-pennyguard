import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Transaction } from '../../shared/interfaces/transaction.interface';
import { UserData } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { TransactionService } from '../../core/services/transaction.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  constructor() {}
}
