---
doc: Base de Dados
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Base de Dados

## MVP — sem base de dados
Progresso em `localStorage` (ADR-0004). Estado guardado:
```
{ xpTotal, drillsDone, completedDrillIds[], streak:{current,best,lastTrainedDate} }
```
Exercícios em `drills.json` (estático, versionado).

## Fase 3 — esquema proposto (Firebase/Supabase)
- **players**: id, nome, posição, criado_em (mínimo de dados; menores).
- **progress**: player_id, xp, drills_done, streak, last_trained.
- **completions**: player_id, drill_id, timestamp.
- **friends**: player_id ↔ friend_id (convites).
- **challenges**: id, drill_id, a_id, b_id, resultados.
- **team_leagues**: id, membros[], semana, xp_por_membro.

Minimização de dados: recolher só o necessário; sem PII sensível.
