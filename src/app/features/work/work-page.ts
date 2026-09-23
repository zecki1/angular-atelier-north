import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { Pagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [ProjectCard, Pagination],
  templateUrl: './work-page.html',
  styleUrl: './work-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPage {
  private readonly json = inject(JsonPlaceholderService);

  readonly projects = toSignal(this.json.getProjects());

  readonly category = signal('Todos');
  readonly page = signal(1);
  readonly perPage = 6;
  readonly pageSize = computed(() => this.perPage);

  readonly categories = computed(() => [
    'Todos',
    ...new Set((this.projects() ?? []).map((project) => project.category)),
  ]);

  readonly filtered = computed(() => {
    const all = this.projects() ?? [];
    return this.category() === 'Todos' ? all : all.filter((p) => p.category === this.category());
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.perPage)));

  readonly paged = computed(() => {
    const start = (this.page() - 1) * this.perPage;
    return this.filtered().slice(start, start + this.perPage);
  });

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