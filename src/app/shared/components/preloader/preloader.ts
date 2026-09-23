import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

import { canAnimate, gsap } from '../../../core/animation';
import { PreloaderService } from '../../../core/services/preloader.service';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [],
  template: `
    @if (!hidden()) {
      <div data-preloader class="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 md:px-10">
        <div class="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-mute">
          <span class="font-display text-base tracking-normal text-cream">Atelier North®</span>
          <span>Carregando</span>
        </div>

        <div class="flex flex-col gap-6">
          <div class="h-px w-full bg-white/15">
            <div data-bar class="h-px origin-left scale-x-0 bg-acid"></div>
          </div>
          <div class="flex items-end justify-between">
            <span data-pct class="font-display text-[clamp(3rem,14vw,10rem)] leading-none text-cream">0%</span>
            <span class="mb-3 hidden text-sm text-mute md:block">Design · Tecnologia · Movimento</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Preloader implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly preloader = inject(PreloaderService);

  readonly hidden = signal(!canAnimate());

  ngAfterViewInit(): void {
    if (this.hidden()) {
      this.preloader.markReady();
      return;
    }

    const pct = this.el.nativeElement.querySelector<HTMLElement>('[data-pct]');
    const bar = this.el.nativeElement.querySelector<HTMLElement>('[data-bar]');
    const overlay = this.el.nativeElement.querySelector<HTMLElement>('[data-preloader]');
    const state = { v: 0 };

    const tl = gsap.timeline({ onComplete: () => this.finish() });
    tl.to(
      state,
      {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (pct) {
            pct.textContent = `${Math.round(state.v)}%`;
          }
        },
      },
      0,
    )
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(overlay, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.15');
  }

  private finish(): void {
    this.preloader.markReady();
    this.hidden.set(true);
  }
}