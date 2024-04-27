import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTransactionsComponent } from './last-transactions.component';

describe('LastTransactionsComponent', () => {
  let component: LastTransactionsComponent;
  let fixture: ComponentFixture<LastTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
