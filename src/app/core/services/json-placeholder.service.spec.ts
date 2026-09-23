import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JsonPlaceholderService } from './json-placeholder.service';

describe('JsonPlaceholderService', () => {
  let service: JsonPlaceholderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(JsonPlaceholderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('monta projetos a partir de posts + usuários', () => {
    let projects: unknown[] = [];
    service.getProjects().subscribe((value) => (projects = value));

    const posts = http.expectOne('https://jsonplaceholder.typicode.com/posts');
    posts.flush([{ id: 1, userId: 1, title: 'título', body: 'corpo da notícia curta' }]);
    const users = http.expectOne('https://jsonplaceholder.typicode.com/users');
    users.flush([
      {
        id: 1,
        name: 'Fulano',
        username: 'fulano',
        email: 'fulano@exemplo.com',
        company: { name: 'Marca X', catchPhrase: 'p', bs: 'bs' },
      },
    ]);

    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      client: 'Marca X',
      category: 'Web',
      title: 'Rebrand Aurora',
      year: 2025,
    });
  });

  it('cai no snapshot mock quando a API falha', () => {
    let posts: unknown = [];
    service.getPosts().subscribe((value) => (posts = value));

    const api = http.expectOne('https://jsonplaceholder.typicode.com/posts');
    api.error(new ProgressEvent('network'));

    const mock = http.expectOne('mock/posts.json');
    mock.flush([{ id: 42, userId: 1, title: 'offline', body: 'corpo offline' }]);

    expect(posts).toEqual([{ id: 42, userId: 1, title: 'offline', body: 'corpo offline' }]);
  });

  it('deriva os clientes do marquee do campo company', () => {
    let clients: string[] = [];
    service.getClients().subscribe((value) => (clients = value));

    const users = http.expectOne('https://jsonplaceholder.typicode.com/users');
    users.flush([{ id: 1, name: 'A', username: 'a', email: 'a@b.c', company: { name: 'Loja Central', catchPhrase: 'p', bs: 'bs' } }]);

    expect(clients).toEqual(['Loja Central']);
  });
});