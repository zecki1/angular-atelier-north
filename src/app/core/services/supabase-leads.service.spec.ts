import { firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { LeadResult } from '../models';
import { SupabaseLeadsService } from './supabase-leads.service';

describe('SupabaseLeadsService', () => {
  let service: SupabaseLeadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseLeadsService);
  });

  it('sem credenciais do Supabase, grava em modo demo', async () => {
    const result: LeadResult = await firstValueFrom(
      service.submit({ name: 'Ana', email: 'ana@exemplo.com', message: 'Quero um site novo.' }),
    );

    expect(result.demo).toBe(true);
    expect(result.id).toBeTruthy();
  });

  it('persiste o lead demo no localStorage quando disponível', async () => {
    localStorage.clear();
    await firstValueFrom(
      service.submit({ name: 'Ana', email: 'ana@exemplo.com', message: 'Quero um site novo.' }),
    );

    const saved = JSON.parse(localStorage.getItem('atelier-north:leads') ?? '[]') as unknown[];
    expect(saved).toHaveLength(1);
  });
});