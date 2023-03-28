/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppDrawerService } from './app-drawer.service';

describe('Service: AppDrawer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppDrawerService]
    });
  });

  it('should ...', inject([AppDrawerService], (service: AppDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
