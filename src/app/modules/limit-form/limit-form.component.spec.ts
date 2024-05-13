import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitFormComponent } from './limit-form.component';

describe('LimitFormComponent', () => {
  let component: LimitFormComponent;
  let fixture: ComponentFixture<LimitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LimitFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LimitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
