import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloaderService } from '../../../core/services/preloader.service';
import { Preloader } from './preloader';

describe('Preloader', () => {
  let fixture: ComponentFixture<Preloader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Preloader] }).compileComponents();
    fixture = TestBed.createComponent(Preloader);
  });

  it('fica oculto sem animação (jsdom) e marca o preloader como pronto', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.hidden()).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-preloader]')).toBeNull();

    const service = TestBed.inject(PreloaderService);
    expect(service.ready()).toBe(true);
  });
});
