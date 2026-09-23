import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

/**
 * Microsoft Clarity — ativa somente quando CLARITY_PROJECT_ID está definido
 * (produção/homologação do Vercel). Fora dos builds de CI/Lighthouse por padrão.
 */
function loadClarity(projectId: string): void {
  const global = window as unknown as { clarity?: (...args: unknown[]) => void };
  global.clarity =
    global.clarity ??
    function (...args: unknown[]) {
      ((global.clarity as unknown as { q?: unknown[] }).q ??= []).push(args);
    };
  const tag = document.createElement('script');
  tag.type = 'text/javascript';
  tag.async = true;
  tag.src = 'https://www.clarity.ms/tag/' + projectId;
  document.head.appendChild(tag);
}

if (environment.clarityProjectId) {
  loadClarity(environment.clarityProjectId);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
