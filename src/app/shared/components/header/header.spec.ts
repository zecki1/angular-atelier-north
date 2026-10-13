import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let header: Header;
  let router: Router;
  const smoothScroll = { stop: vi.fn(), start: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([{ path: 'work', children: [] }]),
        { provide: SmoothScrollService, useValue: smoothScroll },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    header = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('expõe os quatro links de navegação', () => {
    expect(header.links.map((link) => link.path)).toEqual(['/', '/work', '/about', '/contact']);
  });

  it('@HostListener marca scrolled quando a página rola', () => {
    header.onScroll();
    expect(header.scrolled()).toBe(false);

    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    header.onScroll();
    expect(header.scrolled()).toBe(true);
  });

  it('abre o menu mobile e pausa o smooth scroll', () => {
    header.toggleMenu();
    expect(header.menuOpen()).toBe(true);
    expect(smoothScroll.stop).toHaveBeenCalled();
  });

  it('fecha o menu mobile e retoma o smooth scroll', () => {
    header.toggleMenu();
    header.toggleMenu();
    expect(header.menuOpen()).toBe(false);
    expect(smoothScroll.start).toHaveBeenCalled();
  });

  it('closeMenu só age quando o menu está aberto', () => {
    header.closeMenu();
    expect(smoothScroll.start).not.toHaveBeenCalled();

    header.toggleMenu();
    header.closeMenu();
    expect(header.menuOpen()).toBe(false);
    expect(smoothScroll.start).toHaveBeenCalledTimes(1);
  });

  it('fecha o menu ao navegar', async () => {
    header.toggleMenu();
    await router.navigateByUrl('/work');
    expect(header.menuOpen()).toBe(false);
  });
});
