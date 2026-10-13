import { TestBed } from '@angular/core/testing';

import { PreloaderService } from './preloader.service';

describe('PreloaderService', () => {
  let service: PreloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreloaderService);
  });

  it('começa como não pronto', () => {
    expect(service.ready()).toBe(false);
  });

  it('marca como pronto e permanece pronto', () => {
    service.markReady();
    expect(service.ready()).toBe(true);
    service.markReady();
    expect(service.ready()).toBe(true);
  });
});
