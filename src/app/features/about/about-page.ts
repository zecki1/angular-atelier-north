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

import { canAnimate, gsap, ScrollTrigger } from '../../core/animation';
import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { PicsumService } from '../../core/services/picsum.service';
import { PreloaderService } from '../../core/services/preloader.service';
import { Counter } from '../../shared/components/counter/counter';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, Counter, RevealDirective],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements AfterViewInit {
  private readonly json = inject(JsonPlaceholderService);
  private readonly picsum = inject(PicsumService);
  private readonly preloader = inject(PreloaderService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(EnvironmentInjector);

  readonly team = toSignal(this.json.getTeam(), { initialValue: [] });

  readonly heroCover = this.picsum.url('atelier-sobre', 1920, 1080, 'webp');

  private coverTriggers: ScrollTrigger[] = [];

  readonly stats = [
    { value: 120, suffix: '+', label: 'Projetos entregues' },
    { value: 48, suffix: '', label: 'Clientes no mundo' },
    { value: 12, suffix: '', label: 'Prêmios e menções' },
    { value: 7, suffix: ' anos', label: 'De caminhada' },
  ];

  readonly timeline: TimelineItem[] = [
    {
      year: '2019',
      title: 'Fundação',
      text: 'Dois sócios, uma mesa e um propósito: design com alma técnica.',
    },
    {
      year: '2020',
      title: 'Primeiros projetos',
      text: 'Identidades e sites para marcas locais de moda e gastronomia.',
    },
    {
      year: '2022',
      title: 'Formato de estúdio',
      text: 'Estrutura de produto: design, motion e desenvolvimento sob o mesmo teto.',
    },
    {
      year: '2024',
      title: 'Clientes internacionais',
      text: 'Embaixada de projetos na Europa e na América Latina.',
    },
    {
      year: '2026',
      title: 'Hoje',
      text: 'Craft em movimento: sites de impacto, produtos digitais e parcerias de longo prazo.',
    },
  ];

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
      gsap.set(cover, { autoAlpha: 0 });

      let played = false;
      const stop = runInInjectionContext(this.injector, () =>
        effect(() => {
          if (played || !this.preloader.ready()) {
            return;
          }
          played = true;
          gsap.to(cover, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' });
        }),
      );

      this.destroyRef.onDestroy(() => {
        stop.destroy();
        this.coverTriggers.forEach((trigger) => trigger.kill());
        this.coverTriggers = [];
        gsap.killTweensOf(cover);
      });
    }
  }
}
