import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
    <nav class="flex items-center justify-center gap-2" aria-label="Paginação">
      <button
        type="button"
        class="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-acid hover:text-acid disabled:pointer-events-none disabled:opacity-30"
        (click)="go(page() - 1)"
        [disabled]="page() <= 1"
        aria-label="Página anterior"
      >
        ←
      </button>

      @for (p of window(); track p) {
        <button
          type="button"
          class="h-11 min-w-11 rounded-full border px-3 text-sm transition-colors"
          [class.border-acid]="p === page()"
          [class.bg-acid]="p === page()"
          [class.text-ink]="p === page()"
          [class.border-white/15]="p !== page()"
          [class.text-cream/70]="p !== page()"
          [class.hover:text-acid]="p !== page()"
          [attr.aria-current]="p === page() ? 'page' : null"
          (click)="go(p)"
        >
          {{ p }}
        </button>
      }

      <button
        type="button"
        class="rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-acid hover:text-acid disabled:pointer-events-none disabled:opacity-30"
        (click)="go(page() + 1)"
        [disabled]="page() >= totalPages()"
        aria-label="Próxima página"
      >
        →
      </button>
    </nav>
  `,
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly pageChange = output<number>();

  readonly window = computed<number[]>(() => {
    const current = this.page();
    const total = Math.max(1, this.totalPages());
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  go(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }
    this.pageChange.emit(page);
  }
}