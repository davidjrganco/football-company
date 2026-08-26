---
doc: ADR-0004 — Sem contas nem dados pessoais de menores no MVP
area: 12_DECISIONS
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# ADR-0004 — Sem contas nem dados pessoais de menores no MVP

**Estado:** Aceite  ·  **Data:** 2026-08-01

## Contexto
O utilizador principal é menor (14). Recolher dados pessoais cedo cria risco e complexidade desnecessários.

## Decisão
No MVP não há login nem recolha de dados pessoais de menores. Progresso só no dispositivo (localStorage). Autenticação e social real só na Fase 3, com regras de segurança e minimização de dados.

## Alternativas consideradas
- Contas desde o início (rejeitado — risco com menores, fricção).

## Consequências
MVP simples e seguro. Quando chegar o social (Fase 3), tratar auth e privacidade com cuidado (consentimento parental quando aplicável) — ver 05_ENGINEERING/Security.md.
