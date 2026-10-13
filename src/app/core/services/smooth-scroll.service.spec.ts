import { TestBed } from '@angular/core/testing';

import { SmoothScrollService } from './smooth-scroll.service';

describe('SmoothScrollService', () => {
  let service: SmoothScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmoothScrollService);
  });

  it('não inicializa Lenis no ambiente jsdom', () => {
    expect(() => service.init()).not.toThrow();
    // Segunda chamada também é segura (guard `initialized`/plataforma).
    expect(() => service.init()).not.toThrow();
  });

  it('stop/start são seguros antes de inicializar', () => {
    expect(() => service.stop()).not.toThrow();
    expect(() => service.start()).not.toThrow();
  });
});
