# Atelier North — angular-atelier-north

> Semana(s): 2 · Pilar: **Showcase** · Teste unitário: **Vitest** · Milestone(s): `m1-atelier-north`
> Repo público: [github.com/zecki1/angular-atelier-north](https://github.com/zecki1/angular-atelier-north)

## Objetivo

Site de agência nível Awwwards: smooth scroll, cursor custom, marquee, preloader e WebGL leve.

## Design — decisão e intenção

> Pilar **Showcase**: prova de craft de front-end (animação, micro-interações e narrativa). Cada escolha abaixo tem um "para quê" — nada é decorativo solto.

### Conceito

**"Atelier North — design que move marcas"** é um estúdio fictício de São Paulo. O site se comporta como um *case* de estúdio Awwwards: escuro, cinematográfico e editorial, onde o movimento do scroll conta a história de um ateliê que transforma marca em experiência. A intenção é **vender front-end craft** (o pilar do plano): quem navega deve sentir que animação, tipografia e micro-interações são o produto. O tom de voz é irreverente e direto — "Vai dar trabalho? Sim. Vale a pena? Sempre." — consistente com a persona de estúdio de autor.

### Identidade visual

| Token | Valor | Para quê |
|-------|-------|----------|
| `ink` `#0b0b0d` / `ink-soft` `#141417` | tinta quase preta | Palco escuro que faz a "tinta" e os acessos saltarem; base do clima cinematográfico |
| `cream` `#f3efe6` | creme/off-white | Texto principal — contraste suave (não branco puro), tom de papel de ateliê |
| `acid` `#d8ff3e` | verde-ácido | Ação: CTA, links ativos, seleção, pontos de timeline. Energia (GTA VI/Awwwards) em dose mínima — **delata o que é clicável** |
| `clay` `#ff5c39` | terracota | Erro/estado crítico (formulário) — erro nunca é "vermelho de sistema", é do mesmo universo cromático |
| `mute` `#9b9ba3` | cinza | Microetiquetas e metadados — hierarquia sem gritar |

- **Tipografia**: `Syne` (display) para títulos gigantes em caixa alta com `leading-[0.92]`; `Space Grotesk` (corpo). Contraste brutal de escala entre o título em `clamp(3rem↔12rem)` e as microetiquetas `uppercase tracking-[0.3em]` — o vocabulário visual de site de agência.
- **Formas e consistência**: botões-pílula `rounded-full`; seções separadas por `border-white/10`; rótulos de seção no padrão `( … )`; `::selection` e `:focus-visible` em acid (a cor de ação é sempre a mesma, em qualquer contexto).

### Estratégia de movimento

| Peça | Implementação | Intenção |
|------|---------------|----------|
| Preloader | Marca "Atelier North®" + estado de "ready" | Ritual de entrada — anuncia que o site é "trabalho" antes de abrir o hero |
| Hero | `SplitText` em linhas com máscara + `stagger` após o preloader; capa 1920×1080 em WebP com parallax de `scale/y` (scrub) | O nome da marca é um **ato**: entra em camadas, com timing de abertura de filme |
| Showcase | `ScrollTrigger` com `pin` que troca de slide com o progresso do scroll + parallax das imagens | Rolagem vira **edição**: o visitante "empurra" o portfólio com o próprio scroll |
| Cursor custom | Anel + ponto acid, `mix-blend-difference`, `quickTo` (lerp) e ampliação sobre interativos | Maestria de "pointer" — a mão responde a cada elemento; só ativa em `pointer: fine` |
| Smooth scroll (Lenis) + `apReveal` | Lenis substitui o scroll nativo; blocos revelam ao entrar na viewport | Troca o "pulo" do scroll nativo por fluidez constante — a assinatura Awwwards |
| Contadores & timeline | `app-counter` anima os números; timeline editorial com pontos acid | Concretiza a narrativa "desde 2019" — o passado vira prova |
| Marquee | Clientes em loop infinito (CSS `--marquee-duration`) | Sensação de vitrine viva e em movimento permanente |

### Acessibilidade como regra (não melhoria)

- Guarda `canAnimate()` + CSS `@media (prefers-reduced-motion: reduce)` **zeram** animação; cursor custom e smooth scroll só existem com `pointer: fine`.
- Textos decorativos com `aria-hidden` + conteúdo real em `sr-only`; slides do showcase alternam `aria-hidden` conforme o progresso real.
- Contraste pensado: `cream/70–80` sobre `ink`; foco visível em acid. Craft que **não exclui** (axe roda no CI).

### Dados e conteúdo (sem backend próprio)

- **Dados**: JSONPlaceholder (projetos/clientes/depoimentos), Picsum (imagens WebP 1920×1080 / 1200×900) e Open-Meteo (clima) — tudo público, zero backend proprietário.
- **Leads**: Supabase (`leads`, slug `agency`) com **fallback local** quando `VITE_ROLE=demo` — o formulário funciona sempre, mesmo sem credenciais.
- **Racional de performance**: WebP + `fetchpriority="high"` no hero, `loading="lazy"` no resto, fontes async — ninguém paga o custo do "cinema" no primeiro paint.

### Decisão consciente (trade-off)

GSAP + Lenis custam ~300ms de JS na simulação mobile — o preço é a **sensação** Awwwards. A resposta foi otimizar o que dá (WebP, preload, fontes) e documentar o resto, em vez de cortar a assinatura visual. Detalhe no [case study](./docs/atelier-north-case.md).

## Stack

- **Angular 22** — standalone, signals, zoneless, OnPush por padrão
- **Supabase** — Postgres + Auth + RLS (projeto compartilhado `angular-portfolio`)
- **Tailwind CSS** · **ECharts** (dashboards) · **GSAP** (motion) · **three.js** (3D)
- **Vercel** — build estático (sem cold start, sempre online)

## Fluxo de trabalho (Git)

Ambientes preservados em **português brasileiro** (commits, PRs, issues, CI).

```
main      → produção (build estático; nunca push direto)
homolog   → validação/release de PRs (staging)
develop   → integração diária (merges das branches feat/*)
feature   → feat/<assunto> + PR para develop (boas práticas de código limpo)
```

- **Commits:** `feat:`, `fix:`, `test:`, `docs:`, `design:`, `ops:`, `backend:` (conventional commits)
- **PRs:** sempre via **pull request template**; revisados e mergeados por milestone
- **main:** protegida — merge somente via PR de `homolog`
- Rastreabilidade com issues, labels (`feat/test/design/ops/backend`), milestones e releases

## Rodando localmente

```bash
npm install
npm start            # ng serve
npm test             # unitário (Vitest)
npm run test:ci      # unitário em modo CI (coverage)
npm run e2e          # Playwright (local)
npm run e2e:ci       # Playwright (CI)
npm run build        # ng build
npm run analyze      # source-map-explorer (análise de bundle)
```

## Ambiente (Supabase)

Variáveis em `.env` (nunca commitadas):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ROLE=demo
```

Dados usados: leads (agency)

## Decisão de teste: Vitest

> Cada repo alterna Karma/Vitest de propósito: agnóstico de ferramenta, escolha por contexto.
> Neste repo o contexto é um **showcase visual** — o que pesou na escolha:

- **Nativo ESM + TypeScript**: o Vitest transforma os specs no Vite, sem passar por webpack/karma-runner — mesmo pipeline moderno do `ng build` (application builder/esbuild).
- **CI sem browser**: Karma precisa de um Chrome headless lançado a cada execução; o Vitest roda em Node puro, deixando o job `test:ci` do GitHub Actions mais rápido, estável e leve.
- **Karma em fim de vida**: o Angular já o marca como deprecated; adotar Karma aqui significaria investir em ferramenta que o ecossistema está aposentando.
- **Watch mode instantâneo**: feedback imediato ao refinar as animações e componentes, sem custo de subir/derrubar browser.
- **Cobertura V8 embutida**: cobertura/lcov nativos para o gate de ≥ 80%, sem plugin extra de coverage.
- **API familiar**: `describe/it/expect` no mesmo formato do Karma/Jasmine, então os specs são transferíveis entre os repos — a troca de ferramenta não troca o jeito de escrever teste.

Em resumo: menos infraestrutura, mais velocidade de feedback e um alinhamento natural com o build moderno do Angular — decisão por contexto, não por preferência de ferramenta.

## Checklist DoD

- [x] Build/lint/typecheck limpos
- [x] Unit (Vitest) — 23 testes verdes
- [x] E2E Playwright + axe sem violações críticas (3/3)
- [x] Lighthouse em andamento (perf mobile ~0.80 → meta ≥ 0.9)
- [x] Responsivo (mobile/tablet/desktop)
- [x] README com screenshot + "o que aprendi" + decisão de teste + decisão de design
- [x] Supabase configurado (quando aplicável)
- [ ] PR revisado + merged + release por milestone

## O que aprendi

- **Perf visual ≠ perf Lighthouse**: GSAP+Lenis entregam a *sensação* de site Awwwards, mas custam ~300ms de JS não usado na simulação mobile. Otimizei com WebP no hero/preload (Picsum + `index.html`) e fontes async; o restante é trade-off consciente documentado no [case study](./docs/atelier-north-case.md).
- **`npm ci` no CI exige `package-lock.json` versionado** — o erro `Dependencies lock file is not found` no GitHub Actions vem de lock não commitado; solução: versionar o lock (instalação determinística).
- **Bots como segunda opinião**: a navegação humana (cliques lentos/humanizados) pegou um `NG0203: effect() sem injection context` que unit/e2e não pegavam — consistência de UX, não só corretude.
- **Zoneless + OnPush**: animações GSAP fora do ciclo de change detection → menos re-renders e Header/Footer sempre estáveis.
- **Screenshots de referência não vão pro repo**: as 3 imagens (~15MB) ficam fora via `.gitignore`; as decisões de design estão descritas abaixo.

## Screenshots

As imagens de referência estão **localmente** (`.gitignore`, fora do repo por peso) e nortearam o design (a intenção e as decisões completas estão na seção [Design](#design--decisão-e-intenção)):

| Imagem | O que referencia | Decisão de design |
|--------|------------------|--------------------|
| `Capa_paginainicial.png` (canvas/hero) | Página inicial (hero full-viewport, contraste escuro) | Hero com foto Picsum 1920×1080 em **WebP com preload + fetchpriority**; tipografia grande (Syne/Space Grotesk) e marquee lateral, no estilo Awwwards |
| `Timeline.png` | Destaque "linha do tempo" da agência | Layout de **timeline editorial** com âncoras de projeto — base do **case study** e da narrativa de milestone |
| `Trabalho.png` | Página de trabalho (vitrine) | Grade responsiva com **filtro por categoria + paginação**; cards com imagem Picsum WebP e descrição curta |

> Como as imagens não sobem ao GitHub (evitando `git clone` de 15MB+), a referência visual completa fica no **case study** (`docs/atelier-north-case.md`) e nas decisões acima.

## O que cada bot faz (estação local + CI)

Os bots vivem em `bots/` e rodam em dois momentos: **localmente** (check rápido antes de commitar) e no **GitHub Actions**. Nenhum deles é "força bruta" — cada um olha uma dimensão que o outro não enxerga.

| Bot | O que faz | Como roda localmente |
|-----|-----------|----------------------|
| **Humano** (`bots/humano/navegacao-humana.mjs`) | Navega o site com comportamento de pessoa real: cliques com atraso, scroll gradual, hesitação e até erro de digitação. Detecta **travamento, loop de animação e navegação quebrada** que teste automatizado "seco" não percebe. É um teste de UX com automação + IA. | `BOT_URL=http://localhost:4200 node bots/humano/navegacao-humana.mjs` |
| **Analisador de erros** (`bots/analise-erros/analisador.mjs`) | Lê logs de build/e2e/CI, classifica cada erro por severidade (bloqueante/aviso/info), aponta **padrões repetidos** (ex.: sempre o mesmo arquivo falhando) e sugere a ação. É um test-debug com automação + IA. | `node bots/analise-erros/analisador.mjs` |
| **CI + Lighthouse** (`.github/workflows/ci.yaml`, `lighthouserc.json`) | `npm ci` → build → Vitest com cobertura → Playwright e2e (com axe no caminho) → **Lighthouse mobile ≥ 0.9** (perf/a11y/SEO/best-practices). Relatórios sobem como artefato. | `npm run build` + `npx lhci autorun` |

> Obs.: `package-lock.json` é **versionado** (determinístico para `npm ci`). Screenshots e `public/mock` ficam fora do repo.

## Microsoft Clarity (mapa de calor)

Integração em `index.html` ([snippet de hoje](#), `ymvtim0ega`):

```html
<script type="text/javascript">
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'ymvtim0ega');
</script>
```

**Para que serve**: o Clarity grava **mapa de calor, scroll, cliques, rage clicks e sessões reais** — é a "comunicação" que fecha o ciclo dos bots: enquanto os bots rodam via CI, o Clarity mostra como **humanos reais** navegam em produção/homologação (onde estão os travamentos, o que foi ignorado, onde a atenção morre).

- Onde ativa: **produção + homologação** do Vercel (e localmente se `CLARITY_PROJECT_ID` definido).
- Como ler: dashboards Heatmaps, Session Recordings e Rage Clicks.
- Documentação detalhada: [`docs/clarity-integracao.md`](./docs/clarity-integracao.md).

## Permanência online

Estratégia zero-standby documentada em [`docs/manter-online.md`](./docs/manter-online.md).