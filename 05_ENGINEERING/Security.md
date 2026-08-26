---
doc: Segurança
area: 05_ENGINEERING
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# Segurança

## Regras (MVP)
- **Sem contas nem login** no arranque.
- **Sem dados pessoais de menores.** Sem email, telefone, morada, foto obrigatória.
- Sem segredos no repositório (`.env` ignorado).
- Sem palavras-passe nem dados de pagamento tratados pela app.

## Fase 3+ (quando houver backend)
- Autenticação e regras de segurança (Firebase Rules / RLS no Supabase).
- Minimização de dados; consentimento parental quando aplicável.
Ver ADR-0004.
