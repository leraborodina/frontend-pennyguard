import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsProgressComponent } from './savings-progress.component';

describe('SavingsProgressComponent', () => {
  let component: SavingsProgressComponent;
  let fixture: ComponentFixture<SavingsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingsProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
