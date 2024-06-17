import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialGoalFormComponent } from './financial-goal-form.component';

describe('FinancialGoalFormComponent', () => {
  let component: FinancialGoalFormComponent;
  let fixture: ComponentFixture<FinancialGoalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialGoalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialGoalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
