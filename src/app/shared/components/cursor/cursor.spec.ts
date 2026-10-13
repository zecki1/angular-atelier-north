import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cursor } from './cursor';

describe('Cursor', () => {
  let fixture: ComponentFixture<Cursor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Cursor] }).compileComponents();
    fixture = TestBed.createComponent(Cursor);
    fixture.detectChanges();
  });

  it('não ativa o cursor custom sem ponteiro fino (jsdom)', () => {
    expect(fixture.componentInstance.active()).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-ring]')).toBeNull();
  });

  it('remove a classe global ao destruir', () => {
    expect(document.documentElement.classList.contains('cursor-active')).toBe(false);
    fixture.destroy();
    expect(document.documentElement.classList.contains('cursor-active')).toBe(false);
  });
});
