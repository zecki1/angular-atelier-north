import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Project } from '../../../core/models';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <article apReveal class="group" data-cursor="media">
      <div class="relative aspect-[4/3] overflow-hidden bg-white/5">
        <img
          [src]="project().image"
          [alt]="project().title"
          [width]="1200"
          [height]="900"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span
          class="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-widest text-cream backdrop-blur-sm"
        >
          {{ project().category }}
        </span>
      </div>
      <div class="flex items-baseline justify-between gap-4 pt-4">
        <h2 class="font-display text-xl transition-colors group-hover:text-acid md:text-2xl">
          {{ project().title }}
        </h2>
        <span class="shrink-0 text-sm text-mute">{{ project().year }}</span>
      </div>
      <p class="mt-1 text-sm text-mute">
        {{ project().client }} — {{ project().excerpt }}
      </p>
    </article>
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
