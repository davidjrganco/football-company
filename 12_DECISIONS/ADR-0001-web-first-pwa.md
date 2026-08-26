---
doc: ADR-0001 — Web-first / PWA no arranque
area: 12_DECISIONS
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# ADR-0001 — Web-first / PWA no arranque

**Estado:** Aceite  ·  **Data:** 2026-08-01

## Contexto
Queremos ver resultados depressa no telemóvel do Nicolas, sem lojas de apps nem infraestrutura pesada, e um projeto de aprendizagem acessível.

## Decisão
Construir o MVP como web app / PWA (Vite + React + TS + Tailwind), sem backend nem contas; progresso em localStorage. Graduar para nativo (React Native/Expo) mais tarde, a partir da mesma base.

## Alternativas consideradas
- App nativa desde o início (mais lenta de arrancar, exige lojas).
- Web sem PWA (perde instalação no ecrã inicial e offline).

## Consequências
Arranque rápido e barato; o mesmo código serve de base ao futuro. Limitações: sem push nativo nem funcionalidades de loja até graduarmos.
