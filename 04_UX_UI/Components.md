---
doc: Componentes
area: 04_UX_UI
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Componentes

Catálogo (implementado no protótipo; base para o código React).

- **TopBar** — nome + chips de streak e XP.
- **PhaseBanner** — fase atual + contador (x/12).
- **PathNode** — estados: done (verde+✓), current (a pulsar + "COMEÇAR"), locked (🔒). Conector de giz.
- **DrillScreen** — vídeo (placeholder), descrição, CueBox, Timer, botão Concluir.
- **CueBox** — dica-chave destacada (lima).
- **Timer (ring)** — anel SVG com contagem decrescente + Iniciar/Parar.
- **PlayerCard** — rating + atributos (F2).
- **StatTile** — número grande + label.
- **BottomNav** — Caminho / Perfil / Futsal (futsal discreto).
- **Celebrate** — overlay com +XP, streak e confetti.

Cada componente pequeno e testável (convenção em `CONTRIBUTING.md`).
