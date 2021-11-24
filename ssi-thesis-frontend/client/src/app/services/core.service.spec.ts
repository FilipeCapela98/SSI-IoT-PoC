import { TestBed } from '@angular/core/testing';
import { coreService } from './core.service';

describe('coreService', () => {
  let service: coreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(coreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
