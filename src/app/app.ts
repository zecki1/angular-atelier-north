import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SmoothScrollService } from './core/services/smooth-scroll.service';
import { Cursor } from './shared/components/cursor/cursor';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Preloader } from './shared/components/preloader/preloader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Preloader, Cursor, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    this.smoothScroll.init();
  }
}
