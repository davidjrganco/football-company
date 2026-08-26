# Kickoff — Construir o MVP (Fase 1) · Claude Code

> Objetivo: transformar o protótipo aprovado numa **app real** (Vite + React + PWA),
> para o Nicolas usar e instalar no telemóvel. Fundações e protótipo já feitos — é hora de código.

---

## Como usar (David) — 4 passos
1. Abre o **Claude Code** na pasta `football-company` (no Desktop).
2. Cola o prompt abaixo (tudo entre as linhas «COPIA A PARTIR DAQUI» e «FIM»).
3. Ele mostra-te um **plano curto**; se estiver bem, escreve **"avança"**.
4. No fim, corre `cd app && npm install && npm run dev` e abre no telemóvel pela rede local.

---

## COPIA A PARTIR DAQUI
Vais construir a **Fase 1 (MVP)** da nossa app de treino de futebol, dentro deste repositório (a "Founders Bible"). Age como **Staff Engineer / Architect** e segue as normas do `CLAUDE.md`, `GOLDEN_RULES.md` e `WORKFLOW.md`.

**Lê primeiro — estes ficheiros mandam em tudo:**
- `01_PRODUCT/SPEC.md` — especificação do MVP (âmbito, ecrãs, **regras de XP/streak na secção 7**, critério de "pronto" na secção 10). É a fonte de verdade.
- `02_GAME_DESIGN/drills.json` — os exercícios (futebol = principal; futsal com `"primary": false` = secundário). Lê sempre daqui; **não fixes exercícios no código**.
- `04_UX_UI/Design_System.md` — a direção de design **"Jogo à Noite"** (tokens de cor, tipografia **Anton + Barlow**, caminho estilo **quadro tático**).
- `09_PROTOTYPES/Vertical_Slice/index.html` — o **protótipo aprovado**. Recria-o fielmente como app a sério (mesmo aspeto e comportamento): o Nicolas já o testou, é o alvo visual.

**O que construir** — exatamente o que o protótipo já demonstra, agora como aplicação real:
- **Caminho** (ecrã principal): trilho vertical de nós ligados como um quadro tático, com desbloqueio sequencial — concluído (relva + ✓), atual (a pulsar + "COMEÇAR"), bloqueado (🔒). Topo com nome, streak 🔥 e XP. Barra inferior: **Caminho · Perfil · Futsal**.
- **Exercício**: placeholder de vídeo (`video.type: "pending"`), nome, competência, dificuldade, descrição, a dica (`cue`) destacada, **temporizador circular** com `duration_seconds`, botão **"Concluir"**.
- **Perfil**: **cartão de jogador** (rating que sobe) + streak atual/melhor, XP total e exercícios feitos — como no protótipo.
- **Concluir** → soma XP, atualiza a streak, desbloqueia o seguinte e mostra uma celebração.

**Regra de conteúdo (ADR-0002):** o **futebol é o principal**; o **futsal** fica numa secção **separada, discreta e em último** — nunca com o mesmo destaque. Usa o path `"primary": false` do `drills.json` (ou "Em breve" se for mais simples).

**Stack e regras técnicas:**
- **Vite + React + TypeScript + Tailwind CSS**, mobile-first (contentor centrado, máx. ~430px).
- Cria o projeto numa subpasta **`app/`** na raiz do repo (o código fica separado da documentação).
- **PWA** com `vite-plugin-pwa` (instalável no ecrã inicial).
- **Sem backend, sem contas, sem dados pessoais de menores** (ADR-0004): todo o progresso em `localStorage`, num hook **`useProgress`** que implementa **exatamente a secção 7 do SPEC** (XP ao concluir, desbloqueio do seguinte, streak diária pela data do dispositivo — hoje/ontem/falhou; `best = max(best, current)`).
- Tipografia **Anton** (números/títulos) + **Barlow** (corpo); tokens de cor do Design System.
- **Texto visível sempre em PT-PT**; identificadores de código em inglês.

**Antes de escrever código:** apresenta um **plano curto** (lista de ficheiros que vais criar e por que ordem) e **espera que eu diga "avança"**.

**Está pronto quando (secção 10 do SPEC):**
- [ ] O Caminho carrega os exercícios de futebol a partir do `drills.json`.
- [ ] Dá para abrir um exercício, ver descrição/dica e o temporizador.
- [ ] "Concluir" dá XP, desbloqueia o seguinte e atualiza a streak.
- [ ] O progresso persiste ao fechar e reabrir (localStorage).
- [ ] Instala no telemóvel como PWA.
- [ ] O Futsal está presente mas discreto e secundário.

**No fim**, dá-me os comandos exatos para correr (`npm install`, `npm run dev`), para **abrir no telemóvel pela rede local**, e como **instalar a PWA**.
## FIM

---

## Notas (David — não fazem parte do prompt)
- **Nome e tema de cor final** ainda são decisão do Nicolas (Tarefa 1). O esqueleto constrói-se sem isso — usa "Nicolas" no topo e um título de trabalho; renomeia-se depois num instante.
- Incluí o **cartão de jogador** já no MVP (o SPEC deixava-o para v2). Porquê: é o que mais prende o Nicolas e o protótipo já o mostra — vale a pena ser "real" desde o primeiro dia. Se preferires seguir o SPEC à risca, diz e tiro-o do prompt.
- Isto é o que vais poder **mostrar ao Nicolas como "app a sério"** — a mesma que ele testou, agora instalável no telemóvel.
- **A seguir** (Semana 3+): mais exercícios escolhidos por ele, rounds cronometrados, e depois a camada **social** (a cunha que ele decidir).
