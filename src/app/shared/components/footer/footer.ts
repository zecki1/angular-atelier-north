import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OpenMeteoService } from '../../../core/services/open-meteo.service';
import { WeatherCurrent } from '../../../core/models';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-white/10 bg-ink-soft">
      <div class="px-6 py-16 md:px-10 md:py-20">
        <div class="grid gap-12 md:grid-cols-12">
          <div class="md:col-span-5">
            <p class="font-display text-4xl leading-tight md:text-5xl">
              Vamos criar algo<br />realmente memorável<span class="text-acid">.</span>
            </p>
            <a
              href="mailto:ola@ateliernorth.studio"
              class="mt-6 inline-block text-lg text-acid underline decoration-acid/40 underline-offset-4 hover:decoration-acid"
            >
              ola&#64;ateliernorth.studio
            </a>
          </div>

          <nav class="md:col-span-2" aria-label="Menu do rodapé">
            <p class="mb-4 text-xs uppercase tracking-[0.25em] text-mute">Menu</p>
            <ul class="space-y-2">
              @for (link of links; track link.path) {
                <li>
                  <a [routerLink]="link.path" class="text-cream/80 transition-colors hover:text-acid">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </nav>

          <div class="md:col-span-5">
            <p class="mb-4 text-xs uppercase tracking-[0.25em] text-mute">Onde estamos</p>
            <p class="text-cream/80">São Paulo — Brasil</p>
            <p class="mt-1 text-cream/60">Hora local: {{ clock() }}</p>

            @if (weather(); as w) {
              <p class="mt-4 border-t border-white/10 pt-4 text-cream/80">
                {{ w.city }} — {{ w.description }}, {{ w.temperature }}°C
              </p>
            }
          </div>
        </div>

        <div class="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-mute">
          <span>© 2026 Atelier North. Todos os direitos reservados.</span>
          <span>Dados abertos: Open-Meteo · JSONPlaceholder · Picsum</span>
        </div>
      </div>
    </footer>
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly weatherService = inject(OpenMeteoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly links: NavItem[] = [
    { path: '/', label: 'Início' },
    { path: '/work', label: 'Trabalho' },
    { path: '/about', label: 'Sobre' },
    { path: '/contact', label: 'Contato' },
  ];

  readonly weather = signal<WeatherCurrent | null>(null);
  readonly clock = signal('');

  constructor() {
    if (isJsdom()) {
      return;
    }

    this.weatherService.getCurrent().subscribe({
      next: (value) => this.weather.set(value),
    });

    const tick = (): void => {
      this.clock.set(
        new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 20_000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}

function isJsdom(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom');
}