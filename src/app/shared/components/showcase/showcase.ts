import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { canAnimate, gsap, ScrollTrigger } from '../../../core/animation';
import { Project } from '../../../core/models';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative">
      <div class="mx-auto mb-10 flex max-w-7xl items-end justify-between px-6 md:px-10">
        <div>
          <p class="mb-3 text-xs uppercase tracking-[0.25em] text-mute">( Seleção )</p>
          <h2 class="font-display text-4xl md:text-6xl">Projetos em destaque</h2>
          <a
            routerLink="/work"
            class="mt-6 inline-block text-sm uppercase tracking-widest text-acid underline md:hidden"
            >Todos os trabalhos →</a
          >
        </div>
        <a
          routerLink="/work"
          class="hidden text-sm uppercase tracking-widest text-acid transition-opacity hover:opacity-70 md:block"
          >Todos os trabalhos →</a
        >
      </div>

      <div data-pin class="relative h-svh overflow-hidden">
        <p
          class="absolute left-6 top-6 z-20 font-display text-sm text-cream/50 md:left-16"
          aria-hidden="true"
          data-counter
        >
          01 — {{ pad(slides().length) }}
        </p>
        <p class="absolute right-6 top-6 z-20 hidden text-xs uppercase tracking-[0.3em] text-mute md:right-16 md:block">
          Role para explorar ↓
        </p>

        @for (project of slides(); track project.id; let i = $index) {
          <article
            data-slide
            class="absolute inset-0 grid items-end gap-8 px-6 pb-10 md:grid-cols-2 md:items-center md:px-16 md:pb-0"
            [class.hidden]="!animated && i > 0"
            [attr.aria-hidden]="i === 0 ? 'false' : 'true'"
            [style.zIndex]="slides().length - i"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-mute">{{ project.category }}</p>
              <h3 class="mt-3 max-w-[14ch] font-display text-4xl uppercase leading-[0.95] md:text-6xl">
                {{ project.title }}
              </h3>
              <p class="mt-4 text-sm uppercase tracking-widest text-cream/60">
                {{ project.client }} — {{ project.year }}
              </p>
              <p class="mt-6 hidden max-w-md text-lg leading-relaxed text-cream/70 md:block">{{ project.excerpt }}</p>
            </div>

            <figure class="relative aspect-[4/3] w-full overflow-hidden md:aspect-square md:max-h-[68svh]">
              <img
                [src]="project.image"
                [alt]="project.title"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Showcase implements AfterViewInit {
  readonly projects = input<Project[]>([]);

  readonly slides = computed(() => this.projects().slice(0, 4));

  readonly animated = canAnimate();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private triggers: ScrollTrigger[] = [];
  private current = -1;

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  ngAfterViewInit(): void {
    const pin = this.el.nativeElement.querySelector<HTMLElement>('[data-pin]');
    const counter = this.el.nativeElement.querySelector<HTMLElement>('[data-counter]');
    const slides = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('[data-slide]'));
    const count = slides.length;

    if (!this.animated || !pin || !counter || count === 0) {
      return;
    }

    const step = 1 / Math.max(1, count - 1);

    slides.forEach((slide, i) => {
      if (i > 0) {
        gsap.set(slide, { autoAlpha: 0, yPercent: 8 });
      }
    });

    const update = (progress: number): void => {
      const target = Math.max(0, Math.min(count - 1, Math.round(progress / step)));
      if (target === this.current) {
        return;
      }
      this.current = target;

      slides.forEach((slide, i) => {
        const active = i === target;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        if (active) {
          gsap.to(slide, { autoAlpha: 1, yPercent: 0, duration: 0.55, ease: 'power2.out' });
        } else {
          gsap.to(slide, {
            autoAlpha: 0,
            yPercent: i < target ? -8 : 12,
            duration: 0.55,
            ease: 'power2.inOut',
          });
        }
      });

      counter.textContent = `${this.pad(target + 1)} — ${this.pad(count)}`;
    };

    const pinTrigger = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${(count - 1) * 100}%`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => update(self.progress),
    });
    this.triggers.push(pinTrigger);

    const parallax = gsap.timeline({
      scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom top', scrub: true },
    });
    parallax.fromTo(
      pin.querySelectorAll<HTMLElement>('[data-slide] img'),
      { yPercent: -6, scale: 1.1 },
      { yPercent: 6, scale: 1.14, ease: 'none', stagger: 0 },
      0,
    );
    if (parallax.scrollTrigger) {
      this.triggers.push(parallax.scrollTrigger);
    }

    this.destroyRef.onDestroy(() => {
      this.triggers.forEach((trigger) => trigger.kill());
      gsap.killTweensOf(slides);
    });
  }
}