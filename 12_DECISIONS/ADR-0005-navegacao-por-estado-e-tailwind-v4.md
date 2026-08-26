---
doc: ADR-0005 — Navegação por estado e Tailwind v4 no MVP
area: 12_DECISIONS
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-12
---

# ADR-0005 — Navegação por estado e Tailwind v4 no MVP

**Estado:** Aceite  ·  **Data:** 2026-08-12

## Contexto
A SPEC (secção 4) permitia React Router ou navegação por estado. O MVP tem só
três vistas (Caminho, Perfil, Futsal) mais uma folha de exercício sobreposta,
sem necessidade de URLs profundos. O Tailwind saiu na versão 4, com tokens de
tema em CSS (`@theme`) e plugin oficial de Vite, sem `tailwind.config`.

## Decisão
- **Navegação por estado** (um `useState<View>` em `App.tsx`); o ecrã do
  exercício é uma folha (`position: absolute`) que sobe por cima, como no
  protótipo. Sem dependência de router.
- **Tailwind CSS v4** com os tokens do Design System declarados em `@theme`
  no `src/index.css` (pitch/panel/grass/lime/flare/chalk/muted/line + fontes
  Anton/Barlow).
- **Ícones PWA gerados por script** (`scripts/make-icons.mjs`, Node puro, sem
  dependências) — placeholder até o Nicolas decidir nome e identidade (Tarefa 1).

## Alternativas consideradas
- React Router: mais uma dependência sem benefício com três vistas; adotamos
  se/quando houver partilha de links ou mais profundidade (v2+).
- Tailwind v3 com `tailwind.config.js`: geração antiga; a v4 simplifica e é a
  atual.

## Consequências
Menos dependências e um mapeamento direto protótipo→app. Se a v2 precisar de
rotas (ex.: partilhar um exercício), migra-se o `View` para rotas sem tocar nos
ecrãs.
