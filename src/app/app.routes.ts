import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Atelier North — Estúdio de design e tecnologia',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'work',
    title: 'Trabalho — Atelier North',
    loadComponent: () => import('./features/work/work-page').then((m) => m.WorkPage),
  },
  {
    path: 'about',
    title: 'Sobre — Atelier North',
    loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
  },
  {
    path: 'contact',
    title: 'Contato — Atelier North',
    loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
  },
  { path: '**', redirectTo: '' },
];
