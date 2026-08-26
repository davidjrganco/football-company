---
doc: Sistema de XP
area: 02_GAME_DESIGN
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# Sistema de XP

Regras exatas (fonte de verdade para a implementação).

**Ao concluir um exercício:**
1. Somar `drill.xp` ao `xpTotal` (default **30 XP**).
2. Incrementar `drillsDone` e registar o `id` em `completedDrillIds`.
3. Desbloquear o exercício seguinte no caminho (desbloqueio sequencial).
4. Atualizar a **streak** (ver `Level_System.md` / regra abaixo).

**Streak (diária):**
- `hoje` = data do dispositivo (YYYY-MM-DD).
- Se já treinou hoje → não mexe.
- Se treinou ontem → `current += 1`.
- Caso contrário → `current = 1`.
- `best = max(best, current)`; guardar `lastTrainedDate = hoje`.

*(Streak-freeze/"saves" e níveis agrupados por fase → v2.)*
