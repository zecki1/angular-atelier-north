import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  computed,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { canAnimate, gsap, ScrollTrigger } from '../../core/animation';
import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { PicsumService } from '../../core/services/picsum.service';
import { PreloaderService } from '../../core/services/preloader.service';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { Pagination } from '../../shared/components/pagination/pagination';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [ProjectCard, Pagination, RevealDirective],
  templateUrl: './work-page.html',
  styleUrl: './work-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPage implements AfterViewInit {
  private readonly json = inject(JsonPlaceholderService);
  private readonly picsum = inject(PicsumService);
  private readonly preloader = inject(PreloaderService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(EnvironmentInjector);

  readonly projects = toSignal(this.json.getProjects());

  readonly heroCover = this.picsum.url('atelier-trabalho', 1920, 1080, 'webp');

  readonly category = signal('Todos');
  readonly page = signal(1);
  readonly perPage = 6;
  readonly pageSize = computed(() => this.perPage);

  private coverTriggers: ScrollTrigger[] = [];

  readonly categories = computed(() => [
    'Todos',
    ...new Set((this.projects() ?? []).map((project) => project.category)),
  ]);

  readonly filtered = computed(() => {
    const all = this.projects() ?? [];
    return this.category() === 'Todos' ? all : all.filter((p) => p.category === this.category());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.perPage)),
  );

  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.perPage;
    return this.filtered().slice(start, start + this.perPage);
  });

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

  select(category: string): void {
    if (this.category() === category) {
      return;
    }
    this.category.set(category);
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(page);
  }
}
