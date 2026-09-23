import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OpenMeteoService } from './open-meteo.service';

describe('OpenMeteoService', () => {
  let service: OpenMeteoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OpenMeteoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('mapeia a resposta para o clima atual', () => {
    let weather: unknown;
    service.getCurrent().subscribe((value) => (weather = value));

    const req = http.expectOne((request) => request.url.includes('api.open-meteo.com'));
    req.flush({ current: { temperature_2m: 24.6, weather_code: 2 } });

    expect(weather).toEqual({ temperature: 25, description: 'Parcialmente nublado', city: 'São Paulo' });
  });

  it('retorna null em falha (fallback)', () => {
    let weather: unknown = 'não-null';
    service.getCurrent().subscribe((value) => (weather = value));

    const req = http.expectOne((request) => request.url.includes('api.open-meteo.com'));
    req.error(new ProgressEvent('network'));

    expect(weather).toBeNull();
  });

  it('rotula os códigos de tempo', () => {
    expect(service.label(0)).toBe('Céu limpo');
    expect(service.label(3)).toBe('Parcialmente nublado');
    expect(service.label(80)).toBe('Chuva');
    expect(service.label(95)).toBe('Tempestade');
  });
});