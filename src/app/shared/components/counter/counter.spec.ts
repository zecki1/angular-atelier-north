import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Counter } from './counter';

describe('Counter', () => {
  let fixture: ComponentFixture<Counter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Counter] }).compileComponents();
    fixture = TestBed.createComponent(Counter);
  });

  it('escreve o valor formatado em pt-BR quando não há animação', () => {
    fixture.componentRef.setInput('value', 1200);
    fixture.componentRef.setInput('suffix', '+');
    fixture.componentRef.setInput('label', 'Projetos');
    fixture.detectChanges();

    const num = fixture.nativeElement.querySelector('[data-num]');
    expect(num.textContent).toBe('1.200');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('+');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Projetos');
  });
});
