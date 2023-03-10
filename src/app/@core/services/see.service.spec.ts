/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SeeService } from './see.service';

describe('Service: See', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeeService]
    });
  });

  it('should ...', inject([SeeService], (service: SeeService) => {
    expect(service).toBeTruthy();
  }));
});
