import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Project } from '../../../core/models';
import { ProjectCard } from './project-card';

const projeto: Project = {
  id: 7,
  title: 'Rebrand Aurora',
  excerpt: 'Reposicionamento de marca para o setor de energia.',
  category: 'Marca',
  client: 'Aurora Energia',
  image: 'https://picsum.photos/seed/aurora/1200/900',
  year: 2024,
};

describe('ProjectCard', () => {
  let fixture: ComponentFixture<ProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProjectCard] }).compileComponents();
    fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', projeto);
    fixture.detectChanges();
  });

  it('mostra título, cliente e ano do projeto', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Rebrand Aurora');
    expect(text).toContain('Aurora Energia');
    expect(text).toContain('2024');
  });

  it('usa a imagem com alt acessível', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(projeto.image);
    expect(img.getAttribute('alt')).toBe('Rebrand Aurora');
    expect(img.getAttribute('loading')).toBe('lazy');
  });
});
