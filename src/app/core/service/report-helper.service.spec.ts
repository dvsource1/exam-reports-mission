import { TestBed } from '@angular/core/testing';

import { ReportHelperService } from './report-helper.service';

describe('ReportHelperService', () => {
  let service: ReportHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
