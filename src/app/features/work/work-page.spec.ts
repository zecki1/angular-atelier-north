import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Project } from '../../core/models';
import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { WorkPage } from './work-page';

const projects: Project[] = [
  { id: 1, title: 'Um', excerpt: 'e1', category: 'Web', client: 'A', image: 'i1', year: 2025 },
  { id: 2, title: 'Dois', excerpt: 'e2', category: 'Web', client: 'B', image: 'i2', year: 2025 },
  { id: 3, title: 'Três', excerpt: 'e3', category: 'Motion', client: 'C', image: 'i3', year: 2025 },
];

describe('WorkPage', () => {
  let fixture: ComponentFixture<WorkPage>;
  let page: WorkPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkPage],
      providers: [
        {
          provide: JsonPlaceholderService,
          useValue: { getProjects: () => of(projects) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('lista todas as categorias incluindo "Todos"', () => {
    expect(page.categories()).toEqual(['Todos', 'Web', 'Motion']);
  });

  it('filtra projetos por categoria', () => {
    page.select('Motion');
    expect(page.filtered().map((p) => p.id)).toEqual([3]);
  });

  it('volta para "Todos"', () => {
    page.select('Motion');
    page.select('Todos');
    expect(page.filtered()).toHaveLength(3);
  });

  it('não altera nada ao reselecionar a categoria atual', () => {
    page.select('Web');
    page.setPage(2);
    page.select('Web');
    expect(page.page()).toBe(2);
  });

  it('reseta para a página 1 ao trocar de categoria', () => {
    page.setPage(2);
    page.select('Motion');
    expect(page.page()).toBe(1);
  });

  it('pagina os resultados por 6', () => {
    expect(page.pageSize()).toBe(6);
    expect(page.totalPages()).toBe(1);
  });
});
