import { TestBed } from '@angular/core/testing';

import { ErrorNotificationServiceService } from './error-notification.service.service';

describe('ErrorNotificationServiceService', () => {
  let service: ErrorNotificationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorNotificationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
