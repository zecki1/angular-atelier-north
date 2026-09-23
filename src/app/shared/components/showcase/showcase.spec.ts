import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Project } from '../../../core/models';
import { Showcase } from './showcase';

const projects: Project[] = [
  { id: 1, title: 'Um', excerpt: 'e1', category: 'Web', client: 'A', image: 'https://picsum.photos/seed/a/800/600', year: 2025 },
  { id: 2, title: 'Dois', excerpt: 'e2', category: 'Web', client: 'B', image: 'https://picsum.photos/seed/b/800/600', year: 2025 },
  { id: 3, title: 'Três', excerpt: 'e3', category: 'Web', client: 'C', image: 'https://picsum.photos/seed/c/800/600', year: 2025 },
];

describe('Showcase', () => {
  let fixture: ComponentFixture<Showcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Showcase], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(Showcase);
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();
  });

  it('renderiza os slides de projetos', () => {
    const slides = fixture.nativeElement.querySelectorAll('[data-slide]');
    expect(slides.length).toBe(3);
    expect(slides[0].textContent).toContain('Um');
  });

  it('expõe a primeira como visível para leitores de tela', () => {
    const slides = fixture.nativeElement.querySelectorAll('[data-slide]');
    expect(slides[0].getAttribute('aria-hidden')).toBe('false');
  });

  it('oculta os demais slides quando não há animação (jsdom)', () => {
    const slides = fixture.nativeElement.querySelectorAll('[data-slide]');
    expect(slides[1].classList.contains('hidden')).toBe(true);
  });

  it('limita a apresentação a 4 projetos', () => {
    fixture.componentRef.setInput('projects', [...projects, ...projects, ...projects]);
    fixture.detectChanges();
    expect(fixture.componentInstance.slides()).toHaveLength(4);
  });
});