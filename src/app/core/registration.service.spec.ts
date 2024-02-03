import { TestBed } from '@angular/core/testing';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registrationService = TestBed.inject(RegistrationService);
  });

  it('should be created', () => {
    expect(registrationService).toBeTruthy();
  });
});
