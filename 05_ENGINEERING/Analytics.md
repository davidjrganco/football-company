---
doc: Analytics
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Analytics

Métricas de produto ligadas ao North Star (dias de treino/semana). Privacy-first, sem PII.

Eventos a registar (mínimos):
- `app_open`, `drill_start`, `drill_complete` (com drill_id, xp), `streak_update`.
- `path_progress` (nós desbloqueados), `profile_view`.
- (F3) `friend_invite`, `challenge_start`, `challenge_result`.

No MVP pode bastar contagem local; ferramenta externa só quando não recolher dados pessoais de
menores. Usar para responder: "estão a treinar mais dias por semana?".
