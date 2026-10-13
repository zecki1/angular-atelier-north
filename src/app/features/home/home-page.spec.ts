import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: JsonPlaceholderService,
          useValue: {
            getProjects: () =>
              of([
                {
                  id: 1,
                  title: 'Rebrand Aurora',
                  excerpt: 'e1',
                  category: 'Marca',
                  client: 'Aurora',
                  image: 'i1',
                  year: 2025,
                },
              ]),
            getClients: () => of(['Aurora', 'Globex']),
            getTestimonials: () => of([{ id: 1, name: 'Cliente', body: 'Ótimo trabalho' }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('monta a imagem de capa do hero em WebP', () => {
    expect(fixture.componentInstance.heroCover).toContain('picsum.photos');
    expect(fixture.componentInstance.heroCover).toContain('.webp');
  });

  it('usa o estado "ready" do preloader no hero', () => {
    expect(fixture.componentInstance.heroReady()).toBe(false);
  });

  it('renderiza os clientes do marquee', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Globex');
  });
});
