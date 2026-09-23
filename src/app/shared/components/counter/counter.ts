import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input } from '@angular/core';

import { canAnimate, gsap, ScrollTrigger } from '../../../core/animation';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  template: `
    <div class="border-t border-white/10 pt-6">
      <p class="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-acid">
        <span data-num>0</span>{{ suffix() }}
      </p>
      <p class="mt-2 text-sm uppercase tracking-widest text-mute">{{ label() }}</p>
    </div>
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter implements AfterViewInit {
  readonly value = input.required<number>();
  readonly suffix = input('');
  readonly label = input.required<string>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private trigger?: ScrollTrigger;

  ngAfterViewInit(): void {
    const num = this.el.nativeElement.querySelector<HTMLElement>('[data-num]');
    if (!num) {
      return;
    }

    const draw = (value: number): void => {
      num.textContent = Math.round(value).toLocaleString('pt-BR');
    };

    if (!canAnimate()) {
      draw(this.value());
      return;
    }

    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: this.value(),
      duration: 1.8,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => draw(state.v),
    });
    gsap.set(num, { force3D: true });

    this.trigger = ScrollTrigger.create({
      trigger: this.el.nativeElement,
      start: 'top 88%',
      once: true,
      onEnter: () => tween.play(),
    });

    this.destroyRef.onDestroy(() => {
      this.trigger?.kill();
      tween.kill();
    });
  }
}