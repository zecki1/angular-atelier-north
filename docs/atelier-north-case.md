# Case study — Atelier North

## Contexto

Pilar **Showcase** do portfólio: um site de agência fictícia ("Atelier North — design que move marcas",
estúdio de São Paulo) construído para provar domínio de **motion e experiência**, o tipo de entrega
que separa um portfólio comum de uma referência Awwwards.

Stack: Angular 22 (standalone, signals, zoneless) + Tailwind 4 + GSAP/ScrollTrigger + Lenis, com
Supabase para os leads e APIs públicas (JSONPlaceholder, Picsum, Open-Meteo) para o conteúdo.

## Desafio

- Entregar sensação de **cinema/editorial** sem sacrificar acessibilidade nem precisar de backend próprio.
- Fazer o **scroll contar a história** (hero em camadas, showcase com pin, timeline), mantendo performance
  razoável e respeito a `prefers-reduced-motion`.
- Deixar a experiência viva **sem servidor** dedicado: leads com fallback local, conteúdo de APIs públicas,
  deploy estático de custo zero.

## Solução

- **Identidade:** palco escuro (`ink`) com acessos em verde-ácido (`acid`) e texto creme — contraste com
  intenção, tipografia `Syne` (display, caixa alta) + `Space Grotesk` (corpo).
- **Movimento:** preloader como ritual de entrada; `SplitText` em linhas no hero; showcase com `ScrollTrigger`
  pin; cursor custom só em `pointer: fine`; smooth scroll via Lenis; blocos revelam com a diretiva `appReveal`.
- **Degradação graciosa:** `canAnimate()` + `prefers-reduced-motion` zeram animações; cursor e smooth scroll
  são removidos em dispositivos sem ponteiro fino.
- **Sem backend próprio:** formulário cai em modo demo quando o Supabase não está configurado; o site sempre
  funciona.
- **Qualidade:** ESLint + angular-eslint, 69 testes unitários (Vitest), E2E com Playwright (smoke + axe +
  screenshots), Lighthouse CI e bots locais (navegação humana + análise de erro).
- **Deploy:** GitHub Pages (projeto público), com `--base-href` de project site e fallback SPA via `404.html`.

## Métricas

| Métrica | Resultado |
|---------|-----------|
| Testes unitários | 69/69 (22 arquivos) |
| Cobertura | 72,5% statements · 72,2% branches · 69,1% lines |
| E2E (Playwright) | 12/12 (smoke, axe, screenshots) |
| Acessibilidade (axe) | 0 violações graves/críticas nas 4 páginas |
| Lighthouse | Perf 70 · A11y 100 · Boas práticas 96 · SEO 100 |
| Bundle inicial | 460 kB (≈133 kB transfer) |

## O que aprendi

- Movimento é **decisão**, não enfeite: cada animação deste site responde "o que ela comunica?".
- Os guards (`canAnimate`/`isPointerFine`) mostraram que "bonito" e "acessível" não são opostos — dá para
  ter o ritual visual e ainda zerar tudo para quem prefere movimento reduzido.
- Testar código de animação em jsdom exige caminhos alternativos; separar a *decisão* (guard) do *efeito*
  (GSAP) deixou a lógica testável.
- Lenis + GSAP custam ~300 ms de JS: performance passou a ser um trade-off **documentado**, não um acidente.

## Links

- Demo: https://zecki1.github.io/angular-atelier-north/
- Repo: https://github.com/zecki1/angular-atelier-north
