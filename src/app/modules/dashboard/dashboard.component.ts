import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  
  gridColumns = 3;
  
  cards = [
    { title: 'Доходы', cols: 1, rows: 1 },
    { title: 'Расходы', cols: 1, rows: 1 },
    { title: 'Лимиты', cols: 1, rows: 2 },
    { title: 'Последние транзакции', cols: 1, rows: 3 },
    { title: 'Анализ', cols: 1, rows: 3 },
    { title: 'Цели', cols: 1, rows: 2 },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.observeScreenSize();
  }

  observeScreenSize(): void {
    this.breakpointObserver.observe([
      '(max-width: 500px)',
      '(max-width: 750px)',
      '(max-width: 1000px)'
    ]).subscribe(result => this.assignGrid(result.matches));
  }

  assignGrid(matches: boolean): void {
    if (!matches) return;

    switch (true) {
      case this.breakpointObserver.isMatched('(max-width: 500px)'):
        this.gridColumns = 1;
        break;
      case this.breakpointObserver.isMatched('(max-width: 750px)'):
        this.gridColumns = 2;
        break;
      case this.breakpointObserver.isMatched('(max-width: 1000px)'):
        this.gridColumns = 3;
        break;
    }
  }
} 