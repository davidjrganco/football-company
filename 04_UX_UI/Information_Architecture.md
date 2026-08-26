---
doc: Arquitetura de Informação
area: 04_UX_UI
estado: Rascunho
responsavel: Fundadores
atualizado: 2026-08-01
---

# Arquitetura de Informação

```
App
├── Caminho (default)
│   ├── Cabeçalho: nome · streak · XP
│   ├── Fase atual (Domínio de Bola)
│   └── Nós de exercício (sequenciais)
│         └── Ecrã do exercício (vídeo, descrição, dica, temporizador, concluir)
├── Perfil
│   ├── Cartão de jogador (rating + atributos)
│   └── Estatísticas (streak, melhor, XP, exercícios)
├── Futsal (secundário, discreto)
│   └── Lista curta de exercícios
└── (F3) Equipa/Social
      ├── Amigos / convites
      ├── Desafios 1x1
      └── Liga da equipa
```
Hierarquia: o Caminho é o centro. Futsal é sempre secundário (ADR-0002).
