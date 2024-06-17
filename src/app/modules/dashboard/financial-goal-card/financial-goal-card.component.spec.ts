import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialGoalCardComponent } from './financial-goal-card.component';

describe('FinancialGoalCardComponent', () => {
  let component: FinancialGoalCardComponent;
  let fixture: ComponentFixture<FinancialGoalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialGoalCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialGoalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
