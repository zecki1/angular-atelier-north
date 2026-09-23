import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, timeout } from 'rxjs';

import { WeatherCurrent } from '../models';

const LATITUDE = '-23.5505';
const LONGITUDE = '-46.6333';

interface ForecastResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

@Injectable({ providedIn: 'root' })
export class OpenMeteoService {
  private readonly http = inject(HttpClient);

  getCurrent(): Observable<WeatherCurrent | null> {
    const params = new HttpParams()
      .set('latitude', LATITUDE)
      .set('longitude', LONGITUDE)
      .set('current', 'temperature_2m,weather_code')
      .set('timezone', 'America/Sao_Paulo');

    return this.http
      .get<ForecastResponse>('https://api.open-meteo.com/v1/forecast', { params })
      .pipe(
        timeout({ first: 5000 }),
        map((res) => ({
          temperature: Math.round(res.current.temperature_2m),
          description: this.label(res.current.weather_code),
          city: 'São Paulo',
        })),
        catchError(() => of(null)),
      );
  }

  label(code: number): string {
    if (code === 0) return 'Céu limpo';
    if (code <= 3) return 'Parcialmente nublado';
    if (code === 45 || code === 48) return 'Nevoeiro';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Chuva';
    if (code >= 71 && code <= 77) return 'Neve';
    if (code >= 85 && code <= 86) return 'Nevasca';
    if (code >= 95) return 'Tempestade';
    return 'Tempo estável';
  }
}
