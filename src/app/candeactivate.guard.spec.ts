import { TestBed, async, inject } from '@angular/core/testing';

import { CandeactivateGuard } from './candeactivate.guard';

describe('CandeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandeactivateGuard]
    });
  });

  it('should ...', inject([CandeactivateGuard], (guard: CandeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});

