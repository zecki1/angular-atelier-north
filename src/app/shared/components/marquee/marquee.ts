import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [],
  template: `
    <div class="relative overflow-hidden border-y border-white/10 py-6 md:py-8">
      <div class="flex w-max animate-marquee" style="--marquee-duration: 32s">
        @for (item of items(); track $index) {
          <span
            class="flex items-center gap-8 pr-8 font-display text-2xl uppercase tracking-tight text-cream/80 md:text-4xl"
          >
            {{ item }}
            <span class="text-acid" aria-hidden="true">✦</span>
          </span>
        }
        @for (item of items(); track $index) {
          <span
            aria-hidden="true"
            class="flex items-center gap-8 pr-8 font-display text-2xl uppercase tracking-tight text-cream/80 md:text-4xl"
          >
            {{ item }}
            <span class="text-acid">✦</span>
          </span>
        }
      </div>
    </div>
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Marquee {
  readonly items = input<string[]>([]);
}