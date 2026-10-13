import { canAnimate, isPointerFine } from './animation';

/** Simula um ambiente "browser real" trocando o userAgent e o matchMedia. */
function comBrowser(ua: string, matches: (query: string) => boolean): () => void {
  const originalUa = navigator.userAgent;
  const originalMatchMedia = window.matchMedia;
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
  window.matchMedia = ((query: string) => ({ matches: matches(query) })) as typeof window.matchMedia;

  return () => {
    Object.defineProperty(navigator, 'userAgent', { value: originalUa, configurable: true });
    window.matchMedia = originalMatchMedia;
  };
}

describe('animation (guards)', () => {
  it('desliga animação fora de um browser real (jsdom)', () => {
    expect(navigator.userAgent).toContain('jsdom');
    expect(canAnimate()).toBe(false);
  });

  it('não habilita cursor custom quando a animação está desligada', () => {
    expect(isPointerFine()).toBe(false);
  });

  it('habilita animação em browser sem reduced-motion', () => {
    const restore = comBrowser('Mozilla/5.0', () => false);
    try {
      expect(canAnimate()).toBe(true);
    } finally {
      restore();
    }
  });

  it('desliga animação quando o usuário pede reduced-motion', () => {
    const restore = comBrowser('Mozilla/5.0', (query) => query.includes('reduced-motion'));
    try {
      expect(canAnimate()).toBe(false);
    } finally {
      restore();
    }
  });

  it('desliga animação quando matchMedia não existe', () => {
    const originalUa = navigator.userAgent;
    const original = window.matchMedia;
    Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0', configurable: true });
    // @ts-expect-error — cenário sem matchMedia
    delete window.matchMedia;
    try {
      expect(canAnimate()).toBe(false);
    } finally {
      window.matchMedia = original;
      Object.defineProperty(navigator, 'userAgent', { value: originalUa, configurable: true });
    }
  });

  it('só libera cursor custom com ponteiro fino', () => {
    const restore = comBrowser('Mozilla/5.0', (query) => query.includes('pointer: fine'));
    try {
      expect(isPointerFine()).toBe(true);
    } finally {
      restore();
    }
  });
});
