---
doc: Design System
area: 04_UX_UI
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# Design System — Direção "Jogo à Noite"

## Conceito
Um jogo de futebol à noite, sob os holofotes. Fundo verde-noite (não preto
genérico), cartões com tom de relva, e uma assinatura própria: **o caminho
desenhado como um quadro tático** — nós ligados por linhas de giz, como as setas
de movimento num quadro de jogadas.

## Cores (tokens)
| Token | Hex | Uso |
|---|---|---|
| `--pitch` | `#0C1712` | Fundo (relva à noite) |
| `--panel` | `#14231C` | Cartões / superfícies |
| `--grass` | `#22C55E` | Ação principal, concluído, sucesso |
| `--lime` | `#A3E635` | Energia / XP (usar com moderação) |
| `--flare` | `#F97316` | Chama da streak |
| `--chalk` | `#F4FBF6` | Texto principal (giz) |
| `--muted` | `#8AA79A` | Texto secundário |
| `--line` | `rgba(233,245,236,.14)` | Linhas de giz / divisórias |

## Tipografia
- **Display / números:** `Anton` — números tipo camisola de futebol (XP, streak,
  rating, títulos de fase). Usar com restrição, só onde tem de dar murro.
- **Corpo / UI:** `Barlow` (400–800) — grotesca desportiva, muito legível.

## Layout
Mobile-first, contentor ~430px. Barra de navegação inferior. O ecrã principal é o
**Caminho** (quadro tático vertical). Cada nó é um exercício, com estados
Concluído (relva + ✓), Atual (a pulsar + "COMEÇAR") e Bloqueado (esmaecido).

## Assinatura
As ligações entre nós desenhadas como **giz de quadro tático** (tracejado). É o
elemento que torna a app reconhecível e ancora-a no mundo do futebol.

## Regras
- Futebol é o principal; o **futsal** aparece discreto e secundário na navegação
  (mesmo quando ativo, o separador não ganha a cor de destaque).
- Estados vazios são convites à ação, não decoração.
- Movimento ao serviço da recompensa (celebração ao concluir), nunca a atrasar o treino.

## Protótipo
Ver `09_PROTOTYPES/Vertical_Slice/index.html` — implementa esta direção.
