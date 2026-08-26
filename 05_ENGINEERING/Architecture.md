---
doc: Arquitetura
area: 05_ENGINEERING
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Arquitetura

## Princípios
Clareza, escalabilidade, manutenibilidade, qualidade. Começar simples (cliente-só)
e abrir caminho para backend sem reescrever.

## MVP — cliente-só (PWA)
```
[ App PWA (React) ]
       │  lê
       ▼
  drills.json  ──►  UI (Caminho, Exercício, Perfil, Futsal)
       ▲
       │  estado
  localStorage (progresso: XP, streak, concluídos)
```

## Evolução (Fase 3+)
Introduzir backend (Firebase/Supabase) para contas, social e sincronização, sem
alterar o núcleo de jogo. Camada de dados isolada atrás de um serviço, para trocar
`localStorage` por remoto sem tocar na UI.

## Estrutura de pastas da app (proposta)
Ver `SPEC.md` (secção 9) — a incorporar quando o código arrancar.
