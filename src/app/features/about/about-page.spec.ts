import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [
        provideRouter([]),
        {
          provide: JsonPlaceholderService,
          useValue: {
            getTeam: () =>
              of([{ id: 1, name: 'Ana Lima', role: 'Direção criativa', image: 'i1' }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('expõe os quatro indicadores da agência', () => {
    expect(fixture.componentInstance.stats).toHaveLength(4);
    expect(fixture.componentInstance.stats[0].value).toBe(120);
  });

  it('monta a linha do tempo de 2019 a 2026', () => {
    const years = fixture.componentInstance.timeline.map((item) => item.year);
    expect(years).toEqual(['2019', '2020', '2022', '2024', '2026']);
  });

  it('exibe um membro da equipe vindo do serviço', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Ana Lima');
  });
});
