import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, timeout } from 'rxjs';

import { Comment, Post, Project, TeamMember, Testimonial, User } from '../models';
import { PicsumService } from './picsum.service';

const CATEGORIES = ['Marca', 'Web', 'Motion', 'Produto'] as const;

const PROJECT_TITLES = [
  'Rebrand Aurora',
  'E-commerce Vértice',
  'Campanha Solstício',
  'App Órbita',
  'Identidade Lume',
  'Motion Pulse Festival',
  'Plataforma Horizon',
  'Direção de arte Marea',
  'Design system Prisma',
  'Site institucional Campo',
  'Launch Nova Estrada',
  'Editorial Contraste',
  'Portal Nexo',
  'Branding Kilômetro Zero',
  'Experience Flow',
  'Naming Vaga-lumes',
] as const;

const TEAM_ROLES = [
  'Direção criativa',
  'Design de interação',
  'Motion & 3D',
  'Desenvolvimento',
  'Estratégia',
  'Ilustração',
] as const;

@Injectable({ providedIn: 'root' })
export class JsonPlaceholderService {
  private readonly http = inject(HttpClient);
  private readonly picsum = inject(PicsumService);

  private readonly base = 'https://jsonplaceholder.typicode.com';

  getPosts(): Observable<Post[]> {
    return this.request<Post[]>('posts', `${this.base}/posts`);
  }

  getUsers(): Observable<User[]> {
    return this.request<User[]>('users', `${this.base}/users`);
  }

  getComments(): Observable<Comment[]> {
    return this.request<Comment[]>('comments', `${this.base}/comments`);
  }

  getProjects(): Observable<Project[]> {
    return forkJoin({ posts: this.getPosts(), users: this.getUsers() }).pipe(
      map(({ posts, users }) => posts.map((post) => this.toProject(post, users))),
    );
  }

  getClients(): Observable<string[]> {
    return this.getUsers().pipe(map((users) => users.map((user) => user.company.name)));
  }

  getTeam(): Observable<TeamMember[]> {
    return this.getUsers().pipe(
      map((users) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          role: TEAM_ROLES[(user.id - 1) % TEAM_ROLES.length],
          image: this.picsum.url(`north-team-${user.username}`, 600, 750),
        })),
      ),
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.getComments().pipe(
      map((comments) =>
        comments.slice(0, 6).map((comment) => ({ id: comment.id, name: comment.name, body: comment.body })),
      ),
    );
  }

  private toProject(post: Post, users: User[]): Project {
    const client = users[(post.id - 1) % users.length]?.company.name ?? 'Cliente';
    const excerpt = post.body.length > 110 ? `${post.body.slice(0, 110).trimEnd()}…` : post.body;

    return {
      id: post.id,
      title: PROJECT_TITLES[(post.id - 1) % PROJECT_TITLES.length],
      excerpt,
      category: CATEGORIES[post.id % CATEGORIES.length],
      client,
      image: this.picsum.url(`atelier-north-${post.id}`, 1200, 900),
      year: 2026 - (post.id % 6),
    };
  }

  /** API pública primeiro; se falhar (rate limit/offline), cai no snapshot estático. */
  private request<T>(name: string, url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      timeout({ first: 6000 }),
      catchError(() => this.http.get<T>(`mock/${name}.json`)),
      catchError(() => of([] as unknown as T)),
    );
  }
}
