---
doc: Autenticação
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Autenticação

## MVP — não existe
Sem login, sem contas (ADR-0004). O jogador usa a app só com o dispositivo.

## Fase 3 — quando houver social
- Método provável: link mágico por email do **encarregado de educação**, ou login social,
  com consentimento parental quando aplicável (menores).
- Guardar o mínimo; nunca palavras-passe em claro; nada de dados de pagamento na app.
- Regras de segurança no backend (Firebase Rules / Supabase RLS).
