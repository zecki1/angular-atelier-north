import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';

import { gsap, isPointerFine } from '../../../core/animation';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [],
  template: `
    @if (active()) {
      <div class="pointer-events-none fixed left-0 top-0 z-[95]" aria-hidden="true">
        <div
          data-ring
          class="-ml-5 -mt-5 h-10 w-10 rounded-full border border-cream/60 mix-blend-difference"
        ></div>
        <div data-dot class="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-acid"></div>
      </div>
    }
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cursor implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly active = signal(false);

  private onMove = (event: PointerEvent): void => {
    this.ringX(event.clientX);
    this.ringY(event.clientY);
    this.dotX(event.clientX);
    this.dotY(event.clientY);
  };

  private onOver = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    const interactive = target?.closest?.('a, button, [data-cursor], input, textarea, [role="button"]');
    gsap.to(this.ringEl, { scale: interactive ? 1.9 : 1, duration: 0.3, overwrite: 'auto' });
  };

  private ringX!: (value: number) => void;
  private ringY!: (value: number) => void;
  private dotX!: (value: number) => void;
  private dotY!: (value: number) => void;
  private ringEl!: HTMLElement;

  ngAfterViewInit(): void {
    if (!isPointerFine()) {
      return;
    }

    const ring = this.el.nativeElement.querySelector<HTMLElement>('[data-ring]');
    const dot = this.el.nativeElement.querySelector<HTMLElement>('[data-dot]');
    if (!ring || !dot) {
      return;
    }

    this.active.set(true);
    this.ringEl = ring;
    document.documentElement.classList.add('cursor-active');

    this.ringX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
    this.ringY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
    this.dotX = gsap.quickTo(dot, 'x', { duration: 0.14, ease: 'power3' });
    this.dotY = gsap.quickTo(dot, 'y', { duration: 0.14, ease: 'power3' });

    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerover', this.onOver, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerover', this.onOver);
    document.documentElement.classList.remove('cursor-active');
  }
}