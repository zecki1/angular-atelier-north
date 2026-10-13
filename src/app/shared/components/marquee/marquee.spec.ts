import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marquee } from './marquee';

describe('Marquee', () => {
  let fixture: ComponentFixture<Marquee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Marquee] }).compileComponents();
    fixture = TestBed.createComponent(Marquee);
  });

  it('duplica os itens para o loop infinito', () => {
    fixture.componentRef.setInput('items', ['Acme', 'Globex']);
    fixture.detectChanges();

    const spans = fixture.nativeElement.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(4);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Acme');
  });

  it('oculta a segunda cópia dos leitores de tela', () => {
    fixture.componentRef.setInput('items', ['Acme']);
    fixture.detectChanges();

    const hidden = fixture.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(hidden.length).toBeGreaterThanOrEqual(1);
  });
});
