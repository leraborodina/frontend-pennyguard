import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsOverviewComponent } from './notifications-overview.component';

describe('NotificationsOverviewComponent', () => {
  let component: NotificationsOverviewComponent;
  let fixture: ComponentFixture<NotificationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
