import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, map, of, timer } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';
import { Lead, LeadResult } from '../models';

const PROJECT_SLUG = 'agency';

@Injectable({ providedIn: 'root' })
export class SupabaseLeadsService {
  private readonly supabase: SupabaseClient | null =
    environment.supabaseUrl && environment.supabaseAnonKey
      ? createClient(environment.supabaseUrl, environment.supabaseAnonKey)
      : null;

  submit(lead: Lead): Observable<LeadResult> {
    if (!this.supabase) {
      return this.demo(lead);
    }

    return from(
      this.supabase
        .from('leads')
        .insert({
          project_slug: PROJECT_SLUG,
          name: lead.name,
          email: lead.email,
          message: lead.message,
        })
        .select('id')
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          throw error ?? new Error('Falha ao gravar lead');
        }
        return { id: String(data['id']), demo: false } satisfies LeadResult;
      }),
      // Sem Supabase configurado/cols pendentes: modo demo local
      catchError(() => this.demo(lead)),
    );
  }

  private demo(lead: Lead): Observable<LeadResult> {
    return timer(600).pipe(
      map(() => {
        const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
        try {
          const key = 'atelier-north:leads';
          const current = JSON.parse(localStorage.getItem(key) ?? '[]') as Lead[];
          localStorage.setItem(key, JSON.stringify([...current, lead]));
        } catch {
          // localStorage indisponível (testes/privacidade) — segue mesmo assim
        }
        return { id, demo: true } satisfies LeadResult;
      }),
    );
  }
}
