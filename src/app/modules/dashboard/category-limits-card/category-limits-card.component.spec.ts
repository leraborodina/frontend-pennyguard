import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryLimitsCardComponent } from './category-limits-card.component';

describe('CategoryLimitsComponent', () => {
  let component: CategoryLimitsCardComponent;
  let fixture: ComponentFixture<CategoryLimitsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryLimitsCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryLimitsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
