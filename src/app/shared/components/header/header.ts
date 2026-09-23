import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-[60] border-transparent transition-all duration-500"
      [class.bg-ink/85]="scrolled()"
      [class.backdrop-blur-md]="scrolled()"
      [class.border-b]="scrolled()"
      [class.border-white/10]="scrolled()"
      [class.py-8]="!scrolled()"
      [class.py-4]="scrolled()"
    >
      <div class="flex items-center justify-between px-6 md:px-10">
        <a routerLink="/" class="font-display text-lg md:text-xl" aria-label="Atelier North — início" routerLinkActive="text-acid" [routerLinkActiveOptions]="{ exact: true }">
          Atelier <span class="text-acid">North</span><span class="align-super text-[10px] text-mute">®</span>
        </a>

        <nav class="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="text-acid"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              class="text-sm uppercase tracking-widest text-cream/70 transition-colors hover:text-cream"
            >
              {{ link.label }}
            </a>
          }
          <a
            routerLink="/contact"
            class="rounded-full border border-acid px-4 py-2 text-sm uppercase tracking-widest text-acid transition-colors hover:bg-acid hover:text-ink"
          >
            Iniciar projeto
          </a>
        </nav>

        <button
          type="button"
          class="flex h-10 w-10 flex-col items-end justify-center gap-1.5 md:hidden"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="menu-mobile"
          (click)="toggleMenu()"
        >
          <span class="sr-only">{{ menuOpen() ? 'Fechar menu' : 'Abrir menu' }}</span>
          <span class="h-px w-7 bg-cream transition-all duration-300" [class.translate-y-[7px]]="menuOpen()" [class.rotate-45]="menuOpen()"></span>
          <span class="h-px w-5 bg-cream transition-all duration-300" [class.opacity-0]="menuOpen()"></span>
        </button>
      </div>
    </header>

    @if (menuOpen()) {
      <div id="menu-mobile" class="fixed inset-0 z-[55] flex flex-col justify-center bg-ink/95 px-6 backdrop-blur-xl md:hidden">
        <nav class="flex flex-col gap-2" aria-label="Navegação mobile">
          @for (link of links; track link.path) {
            <a
              [routerLink]="link.path"
              class="font-display py-3 text-5xl font-bold uppercase leading-none text-cream/90 transition-colors hover:text-acid"
              (click)="closeMenu()"
            >
              {{ link.label }}
            </a>
          }
          <a
            routerLink="/contact"
            class="mt-6 w-fit rounded-full bg-acid px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink"
            (click)="closeMenu()"
          >
            Iniciar projeto
          </a>
        </nav>
      </div>
    }
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly router = inject(Router);
  private readonly smoothScroll = inject(SmoothScrollService);

  readonly links: NavItem[] = [
    { path: '/', label: 'Início' },
    { path: '/work', label: 'Trabalho' },
    { path: '/about', label: 'Sobre' },
    { path: '/contact', label: 'Contato' },
  ];

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(typeof window !== 'undefined' && window.scrollY > 24);
  }

  toggleMenu(): void {
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    next ? this.smoothScroll.stop() : this.smoothScroll.start();
  }

  closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.smoothScroll.start();
    }
  }
}