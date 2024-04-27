import { Component, OnInit } from '@angular/core';
import { Limit } from '../../shared/models/limit.model';
import { UserData } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-limit-overview',
  templateUrl: './limit-overview.component.html',
  styleUrl: './limit-overview.component.scss'
})
export class LimitOverviewComponent implements OnInit{ 
  limits: Limit[] = []; 

  userData: UserData | null = null;
  subscription: Subscription | undefined;
  errorMessage: string = '';

  ngOnInit(): void {
  }

}
