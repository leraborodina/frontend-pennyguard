import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialGoalOverviewComponent } from './financial-goal-overview.component';

describe('FinancialGoalOverviewComponent', () => {
  let component: FinancialGoalOverviewComponent;
  let fixture: ComponentFixture<FinancialGoalOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialGoalOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialGoalOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
