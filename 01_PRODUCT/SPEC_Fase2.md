---
doc: SPEC — Fase 2 (a partir do Player Review de 2026-08-18)
area: 01_PRODUCT
estado: Iteração A construída · Iteração B por planear
responsavel: Fundadores
atualizado: 2026-08-18
---

# SPEC — Fase 2

> Extensão da `SPEC.md` (MVP) com base no Player Review do Nicolas
> (`Player_Review_2026-08-18_Notas_Nicolas.md`). A Fase 2 divide-se em duas
> iterações; a **A** está construída, a **B** aguarda conteúdo e decisões.

## Iteração A — Cartão vivo + exercício rico (construída)

### Cartão de jogador (regras do Nicolas)
- Escala **1–99**; o geral e os **9 atributos começam todos em 40**:
  Controlo · Domínio · Passe · Remate · Defesa · Físico · Resistência ·
  Velocidade · IQ de jogo.
- Cada exercício declara os **atributos que treina** (`attributes` no
  `drills.json`). **Cada 2 treinos** de uma competência = **+1** nesse atributo
  (derivado das contagens, nunca guardado à parte — sem estados divergentes).
- **Geral = média dos 9**, arredondada. Título por escalões:
  <45 Promessa · <50 Jogador de Clube · <60 Jogador Distrital ·
  <70 Jogador Nacional · <85 Internacional · ≥85 Lenda.
- Cartão **configurável no onboarding** (1.º arranque) e editável no Perfil:
  nome, posição (GR…PL) e objetivo (ex.: "chegar à seleção distrital").
  Continua tudo em localStorage — **sem contas** (ADR-0004 mantém-se; login
  real fica para a fase social, com ADR próprio).

### Exercício (formato novo)
- **Séries**: `sets × work_seconds` com `rest_seconds` de descanso entre elas
  (ex.: 3×40s, descanso 30s). O temporizador encadeia trabalho→descanso→série
  seguinte automaticamente; anel verde no trabalho, laranja no descanso.
- **"Como fazer"**: passos numerados (`steps[]`), 2-3 por exercício.
- **Dificuldade em 5 estrelas** (`difficulty: 1..5`).
- Ao concluir com desbloqueio: celebração e **auto-avanço para o exercício
  seguinte** ("automaticamente passa para o próximo").

### Alteração à regra de XP (SPEC MVP secção 7)
- **Repetir um exercício volta a dar XP e conta para os atributos** — treinar
  todos os dias é o objetivo do produto; o desbloqueio sequencial mantém-se
  pela primeira conclusão. Novo campo `completionCounts` no estado local
  (migração automática: quem já tinha exercícios feitos passa a contar 1).
- Streak: regras inalteradas.

## Iteração B — Programas de treino multi-dia (CONSTRUÍDA 2026-08-20)

Com base nas respostas do Nicolas à Tarefa 3 (20/08/2026):
- **XP fica em 30** (decisão dele — sem mudanças).
- **Ecrã principal = Programas** (cartões como no desenho dele: nome, dias,
  min/dia, foco, recompensa, progresso, START/CONTINUAR/✓ COMPLETO/EM BREVE);
  tocar abre o caminho do programa (mesma mecânica de desbloqueio sequencial).
- `drills.json` v3: bloco `programs` + 14 exercícios novos.
  - **7 Day Ball Mastery** (7d · 20-30min) = os 12 drills existentes →
    recompensa **+1 Domínio**.
  - **Finishing** (30d · 30min) = 7 drills, incluindo o **"1v1 e Remata"** dele →
    **+3 Remate**.
  - **Weak Foot** (27d · 20min) = 6 drills, incluindo o **"Juggling Pé Fraco"**
    dele → **medalha "Pé Fraco — Nível 1"** no cartão (a escolha dele: só
    medalha, não atributos).
  - **Speed and Agility** (14d · 25min) = **"Em breve"** (ele chumbou a lista
    proposta: "temos de mudar muitos exercícios"); só o **Box Jumps** dele está
    confirmado. Os exercícios escolhem-se na **Tarefa 3b**.
- **Recompensas**: programa completo (todos os drills concluídos) → celebração
  especial 🏆 + recompensa entregue **atomicamente na mesma gravação** da última
  conclusão (`claimedPrograms` no estado; duas gravações separadas perdiam-se).
  Bónus de atributos somam ao cartão; medalhas aparecem no cartão.
- **Vídeos**: decisão dele = gravam os dois. O ecrã do exercício já suporta
  `video.type` "local" e "youtube" (placeholder enquanto "pending").

### Afinações pós-lançamento (20/08/2026, feedback do Nicolas por WhatsApp)
- **Dias de treino contam** (pergunta do David "30 dias mas só 7 tarefas?"):
  a recompensa de um programa exige **todos os exercícios feitos E
  `program.days` dias de treino** desse programa (1 dia = pelo menos 1
  exercício do programa nesse dia; `programTrainingDays` no estado, gravação
  atómica com a conclusão). A UI mostra 2 barras: exercícios (verde) e dias
  (laranja). Pode disparar numa repetição, não só num desbloqueio.
  **A confirmar pelo Nicolas na Tarefa 3b (pergunta extra 1).**
- **Progressão mais lenta + Geral pelo XP** (Nicolas: "não pode evoluir tão
  rápido… é melhor com o XP que subia o overall"): **Geral = 40 + 1 por cada
  150 XP** (5 treinos de 30; cap 99) — deixa de ser a média dos atributos;
  atributos abrandados para **+1 por cada 4 treinos** da competência (era 2).
  A escolha 150 vs 120 XP (5 vs 4 treinos) **confirma-se na Tarefa 3b
  (pergunta extra 2).**

## Iteração E — Defesa do Nicolas, recordes e partilha (CONSTRUÍDA 2026-09-03)

Das respostas à Tarefa 5 (manuscrito 03/09) + pedido do David:
- **Auto-conclusão** (David): o exercício conclui-se SOZINHO quando o relógio
  termina as séries — o botão Concluir desapareceu; o relógio é o árbitro.
- **A Defesa é do Nicolas**: df-01 "Cobertura Defensiva" (4×2min) e df-02
  "Interceptação de Passes" (3×2,5min) — os exercícios que ELE inventou, com as
  palavras dele nas descrições. Categoria vermelha (escudo), DEF+IQ, XP 40.
  TODOS os 9 atributos têm agora cobertura.
- **Regra da companhia (dele)**: exercícios com `needs_people` ficam SEMPRE
  desbloqueados mas NUNCA bloqueiam o caminho nem entram na sessão a solo;
  toggle **"Hoje treino acompanhado"** no Treino de Hoje junta-os à sessão.
- **Recordes pessoais** (votação dele): 6 exercícios contáveis (juggling,
  agachamentos, flexões, knee jumps, remates certeiros, passes de primeira)
  perguntam o máximo no fim; "NOVO RECORDE 🎉" + estante no Perfil.
- **Partilha por imagem** (Modo Amigos fase 1, escolha dele: WhatsApp/Insta/
  Snapchat, sem contas): imagem story 9:16 gerada em canvas — cartão dourado
  completo, e variante com faixa de "NOVO RECORDE" partilhável na hora. É o
  desafio "quem faz mais toques" sem backend.
- drills.json v5: 48 exercícios, caminho de 40. **37 testes** Vitest.

## Iteração D — "A app diz-te o que treinar" (CONSTRUÍDA 2026-09-03)

Da Grande Análise (Nicolas 02/09) + WhatsApp do David 03/09:
- **Treino de Hoje**: sessão diária gerada (5 exercícios, plano de rotação por
  dia da semana a misturar categorias — ideia do David), determinística, só com
  exercícios desbloqueados; hero dourado na home com lista, progresso e
  **bónus +50 XP** ao completar a sessão (entregue atomicamente); cada
  exercício conta para os dias dos Programas venha de onde vier.
- **Séries obrigatórias** (pedido do Nicolas): o Concluir fica bloqueado até o
  temporizador terminar as séries.
- **Feedback pós-treino**: "Como correu?" (Fácil/Normal/Difícil) no ecrã de
  conclusão, guardado por exercício — semente da dificuldade adaptativa.
- **Força**: categoria nova (roxa) com 6 exercícios sem equipamento (st-01..06),
  no caminho misto (agora **38** em 4 níveis) e no plano diário.
- **Futsal a sério** (prioridade do Nicolas): 3→**8 exercícios** (ft-04..08:
  passes de primeira, bico, rolo e passe, giro de sola, 1v1 de salão) num
  mini-caminho jogável com desbloqueio — secção continua secundária (ADR-0002).
  Passe passa a ter 3 exercícios de cobertura; Defesa continua a 0 (dívida).
- drills.json v4: 46 exercícios. 32 testes Vitest (inclui gerador da sessão).

## Iteração C — Caminho misto + Programas à parte (CONSTRUÍDA 2026-08-24)

Com base na Tarefa 3b respondida (manuscrito 23/08 + WhatsApp 24/08):
- **Caminho misto é a casa** ("como é no Footwork"): um caminho único com os
  32 exercícios das 4 categorias misturados em **4 NÍVEIS** curados no
  `main_path` do drills.json (Nível 1 fundação → Nível 4 termina no
  "1v1 e Remata" dele). Desbloqueio sequencial global; progresso preservado.
- **Programas em página própria**: barra inferior passou a
  **Caminho · Programas · Perfil · Futsal** (futsal último e discreto).
- **Speed and Agility ATIVO** com os 7 exercícios escolhidos por ele
  (Sprint com Bola, Escada de Agilidade, Sprint em Ziguezague, Tiro de Reação,
  Saltos em Frente, Knee Jumps, Box Jumps com variante reativa) — ids sa-01..07.
- **Dias contam de qualquer lado**: concluir um exercício regista o dia de
  treino em TODOS os programas que o incluem (caminho misto alimenta os
  desafios); as recompensas também podem disparar a partir do caminho.
- **Pergunta 1 confirmada** (dias contam — sem mudanças) e **pergunta 2
  aplicada**: Geral = +1 por cada **120 XP** (4 treinos).
