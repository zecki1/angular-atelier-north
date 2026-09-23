import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PicsumService {
  url(seed: string, width: number, height: number, format: 'jpg' | 'webp' = 'jpg'): string {
    const ext = format === 'webp' ? '.webp' : '';
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}${ext}`;
  }
}
