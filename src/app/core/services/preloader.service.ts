import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreloaderService {
  private readonly _ready = signal(false);

  readonly ready = this._ready.asReadonly();

  markReady(): void {
    this._ready.set(true);
  }
}
