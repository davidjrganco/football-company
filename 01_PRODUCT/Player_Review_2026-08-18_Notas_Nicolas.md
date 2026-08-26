---
doc: Player Review — Notas manuscritas do Nicolas (Fase 2)
area: 01_PRODUCT
estado: Em análise
responsavel: Fundadores
atualizado: 2026-08-18
---

# Player Review — Notas manuscritas do Nicolas

> Transcrição fiel das duas páginas de notas entregues pelo Nicolas (2026-08-18),
> depois de usar o MVP. Fonte para o âmbito da Fase 2. Originais com o David.

## Página 1 — "Tarefa 2" (sistema de cartão/rating)

- Rating **de 1 a 99**.
- "Com vários treinos e ao longo deles, ganhas um certo nível e quando alcança o
  necessário sobe de nível — tanto o geral como alguns dos atributos."
- "Começa em 40 o geral e cada atributo também com 40, e a cada nível avançado
  sobe consoante os treinos feitos."
- Esboço de cartão: **"40 ST · André"**, título **"Jogador Nacional"**,
  **"Obj: chegar à seleção distrital"**.
- **9 atributos** (todos a 40 no esboço): Controlo · Passe · Domínio · Remate ·
  Físico · Resistência · Defesa · IQ de jogo · Velocidade.

## Página 2 — cartão-exemplo e programas de treino

Cartão aspiracional (esquerda):
- "Diogo · LW · 75 OVR" — Pace 82, Dribbling 78, Shooting 80, Pass 76,
  Physical 83, Defending 57 — e **"74 DAY STREAK"**.

Ecrã de exercício (esquerda, "Inside-Outside"):
- "Vídeo do exercício: **3 × 55 segundos, descanso: 30**".
- "How to make it: 1 — keep the ball next to your feet with lots of touches;
  2 — use the inside then the outside with both feet; 3 — vai aumentando a
  velocidade gradualmente."
- **Dificuldade em 5 estrelas** (esboço com 2 de 5 preenchidas). Botão **START**.
- "Quando acaba: **Set completed, +40 XP**, e **automaticamente passa para o
  próximo**."

"Programa Treinos" (direita) — desafios multi-dia:
- **7 Day Ball Mastery** — 7 dias · 20–30 min/dia · START
- **Speed and Agility** — 14 dias · 25 min/dia · SEE PROGRAM
- **Finishing** — 30 dias · 30 min/dia · "do these 1 month finishing and watch
  your goals multiply" · WATCH PROGRAM
- **Weak Foot** — 27 dias · 20 min/dia · "ao acabar este desafio ganha mais um
  nível de Pé fraco"
- "Focus: Ball control"

## Leitura de produto (Fundadores)

1. **Cartão configurável e vivo** — nome/posição/objetivo editáveis (o esboço usa
   "André · ST", não "Nicolas"); 9 atributos que começam a 40 e sobem com os
   treinos *da competência certa*; metas de subida ("quando alcança o
   necessário").
2. **Programas multi-dia** — vários caminhos paralelos com duração (7/14/27/30
   dias) e minutos/dia, com recompensa de atributo no fim do desafio (ex.: Pé
   fraco +1 nível).
3. **Exercício mais rico** — séries × tempo com descanso, passos numerados
   ("How to"), auto-avançar no fim da série, dificuldade em 5 estrelas.
4. Os valores (XP 40 vs 30, estrelas 5 vs dificuldade 1–3) confirmam que tudo
   deve continuar a vir do `drills.json` — o formato dos dados precisa de crescer
   (séries, descanso, passos, atributos-alvo, programas).

## Próximo passo

Atualizar `SPEC.md` (v2 / Fase 2) + `drills.json` (novo esquema) e apresentar
plano ao David antes de código, conforme o `WORKFLOW.md`.
