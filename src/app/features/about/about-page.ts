import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { JsonPlaceholderService } from '../../core/services/json-placeholder.service';
import { Counter } from '../../shared/components/counter/counter';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, Counter, RevealDirective],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  private readonly json = inject(JsonPlaceholderService);

  readonly team = toSignal(this.json.getTeam(), { initialValue: [] });

  readonly stats = [
    { value: 120, suffix: '+', label: 'Projetos entregues' },
    { value: 48, suffix: '', label: 'Clientes no mundo' },
    { value: 12, suffix: '', label: 'Prêmios e menções' },
    { value: 7, suffix: ' anos', label: 'De caminhada' },
  ];

  readonly timeline: TimelineItem[] = [
    {
      year: '2019',
      title: 'Fundação',
      text: 'Dois sócios, uma mesa e um propósito: design com alma técnica.',
    },
    {
      year: '2020',
      title: 'Primeiros projetos',
      text: 'Identidades e sites para marcas locais de moda e gastronomia.',
    },
    {
      year: '2022',
      title: 'Formato de estúdio',
      text: 'Estrutura de produto: design, motion e desenvolvimento sob o mesmo teto.',
    },
    {
      year: '2024',
      title: 'Clientes internacionais',
      text: 'Embaixada de projetos na Europa e na América Latina.',
    },
    {
      year: '2026',
      title: 'Hoje',
      text: 'Craft em movimento: sites de impacto, produtos digitais e parcerias de longo prazo.',
    },
  ];
}