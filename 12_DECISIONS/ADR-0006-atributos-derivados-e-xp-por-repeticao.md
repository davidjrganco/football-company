---
doc: ADR-0006 — Atributos derivados das contagens e XP por repetição
area: 12_DECISIONS
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-18
---

# ADR-0006 — Atributos derivados das contagens e XP por repetição

**Estado:** Aceite  ·  **Data:** 2026-08-18

## Contexto
O Player Review do Nicolas pede um cartão 1–99 que "sobe consoante os treinos
feitos". Guardar os valores dos atributos criaria dois estados a manter em
sincronia (contagens e valores) e o MVP só dava XP na primeira conclusão — mas o
produto vive de treinar os mesmos exercícios todos os dias.

## Decisão
- O estado local guarda apenas **contagens por exercício** (`completionCounts`);
  os valores dos atributos e o geral são **funções puras** dessas contagens
  (base 40, +1 por cada 2 treinos da competência, máx. 99, geral = média).
- **Repetir um exercício dá sempre XP** e incrementa as contagens; o desbloqueio
  sequencial continua a depender só da primeira conclusão.

## Alternativas consideradas
- Guardar valores de atributos no estado: risco de divergência e migrações
  difíceis; rejeitado.
- XP só na primeira conclusão (comportamento do MVP): mata o ciclo diário;
  rejeitado com base nas notas do jogador.

## Consequências
Mudar a fórmula no futuro (ex.: pesos por dificuldade) recalcula o cartão
inteiro sem migração de dados. Os XP históricos não são recalculáveis (ficam
como estão). A fórmula é simples de explicar ao jogador.
