import { TestBed } from '@angular/core/testing';

import { PicsumService } from './picsum.service';

describe('PicsumService', () => {
  let service: PicsumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicsumService);
  });

  it('monta URL com seed estável', () => {
    expect(service.url('projeto-a', 1200, 900)).toBe('https://picsum.photos/seed/projeto-a/1200/900');
  });

  it('encodea seed com caracteres especiais', () => {
    expect(service.url('marca x/y', 100, 100)).toBe('https://picsum.photos/seed/marca%20x%2Fy/100/100');
  });
});