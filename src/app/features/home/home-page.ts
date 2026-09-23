import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  effect,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { canAnimate, gsap, ScrollTrigger, SplitText } from '../../core/animation';
import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { PicsumService } from '../../core/services/picsum.service';
import { PreloaderService } from '../../core/services/preloader.service';
import { Marquee } from '../../shared/components/marquee/marquee';
import { Showcase } from '../../shared/components/showcase/showcase';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, Marquee, Showcase, RevealDirective],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements AfterViewInit {
  private readonly json = inject(JsonPlaceholderService);
  private readonly picsum = inject(PicsumService);
  private readonly preloader = inject(PreloaderService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(EnvironmentInjector);

  readonly heroReady = this.preloader.ready;
  readonly heroCover = this.picsum.url('atelier-hero', 1920, 1080, 'webp');

  readonly projects = toSignal(this.json.getProjects());
  readonly clients = toSignal(this.json.getClients(), { initialValue: [] });
  readonly testimonials = toSignal(this.json.getTestimonials(), { initialValue: [] });

  private coverTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (!canAnimate()) {
      return;
    }

    const cover = this.el.nativeElement.querySelector<HTMLElement>('[data-cover]');
    if (cover) {
      const section = cover.closest('section');
      const tween = gsap.fromTo(
        cover,
        { scale: 1.12, yPercent: -8 },
        {
          scale: 1.05,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        },
      );
      if (tween.scrollTrigger) {
        this.coverTriggers.push(tween.scrollTrigger);
      }
    }

    const hero = this.el.nativeElement.querySelector<HTMLElement>('[data-hero]');
    if (!hero) {
      return;
    }

    const split = new SplitText(hero, { type: 'lines', mask: 'lines' });
    gsap.set(split.lines, { yPercent: 120 });

    let played = false;
    const stop = runInInjectionContext(this.injector, () =>
      effect(() => {
        if (played || !this.preloader.ready()) {
          return;
        }
        played = true;
        if (cover) {
          gsap.to(cover, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' });
        }
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
        });
      }),
    );

    this.destroyRef.onDestroy(() => {
      stop.destroy();
      this.coverTriggers.forEach((trigger) => trigger.kill());
      this.coverTriggers = [];
      if (cover) {
        gsap.killTweensOf(cover);
      }
    });
  }
}
