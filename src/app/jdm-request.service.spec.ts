import { TestBed } from '@angular/core/testing';

import { JdmRequestService } from './jdm-request.service';

describe('JdmRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JdmRequestService = TestBed.get(JdmRequestService);
    expect(service).toBeTruthy();
  });
});
