import { AfterViewInit, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

import { gsap, canAnimate, ScrollTrigger } from '../../core/animation';

@Directive({
  selector: '[apReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    if (!canAnimate()) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(this.el.nativeElement, {
        y: 48,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: this.el.nativeElement, start: 'top 88%', once: true },
      });
    });

    this.destroyRef.onDestroy(() => {
      ctx.revert();
      ScrollTrigger.refresh();
    });
  }
}