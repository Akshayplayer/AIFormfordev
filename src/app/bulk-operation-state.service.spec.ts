import { TestBed } from '@angular/core/testing';

import { BulkOperationStateService } from './bulk-operation-state.service';

describe('BulkOperationStateService', () => {
  let service: BulkOperationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkOperationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
