import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OpenMeteoService } from '../../../core/services/open-meteo.service';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        provideRouter([]),
        { provide: OpenMeteoService, useValue: { getCurrent: () => of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
  });

  it('renderiza o menu e o e-mail de contato', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Trabalho');
    expect(fixture.nativeElement.querySelector('a[href="mailto:ola@ateliernorth.studio"]')).toBeTruthy();
  });

  it('não inicia o relógio no ambiente de teste (jsdom)', () => {
    expect(fixture.componentInstance.clock()).toBe('');
    expect(fixture.componentInstance.weather()).toBeNull();
  });
});
