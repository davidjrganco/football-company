# PROJETO — App de Treino de Futebol (Pai & Filho)
### Documento-mestre de contexto para o Claude Project

> Junta tudo o que foi analisado e decidido até agora. Serve de "cérebro" do
> Project: qualquer conversa nova deve poder arrancar só com este documento.
> **Idioma do projeto: PT-PT.** Última atualização: 01/08/2026.

---

## 0. Como usar este documento

1. Cria um Project novo aqui no Claude (ver secção 12 para o nome e as instruções).
2. Adiciona este ficheiro ao conhecimento do Project, junto com os outros
   ficheiros já produzidos (secção 11).
3. Cola as instruções da secção 12 no campo de instruções do Project.

---

## 1. Identidade e visão

Projeto pai-e-filho: o David e o filho **Nicolas (14)** vão construir juntos uma
app de treino de futebol, inspirada na app **Footwork** (que o Nicolas já usa e
adora), com o objetivo de fazer algo **semelhante ou melhor**. Vai ser construída
no **Claude Code**.

**Dois objetivos ao mesmo tempo:** (a) aprender a construir um produto real, do
zero ao telemóvel; (b) fazer uma app que o Nicolas e os amigos usem mesmo.

**Regra de ouro:** começar pequeno, ter algo a funcionar depressa, melhorar
semana a semana. Não fazer tudo de uma vez.

---

## 2. As pessoas

- **David** — engenheiro civil, forte em tecnologia e automação, construtor no
  Claude Code. Faz a parte técnica e ensina o "porquê" das decisões.
- **Nicolas** — 14 anos, avançado / extremo esquerdo (LW), apaixonado por futebol
  e por tecnologia. É o **designer do produto e especialista de futebol**: decide
  a cunha, o nome, o visual, testa e dá feedback. Já usa a Footwork como Pro
  (rating "53", streak, #1 na liga dele).

---

## 3. A app de referência: Footwork

### O que é
App de **treino individual** de futebol (jogador, não treinador/equipa). Só
software, grátis com subscrição "Pro". iOS e Android. 12k+ downloads, 4.8★.
É a melhor do seu tipo — e o alvo a bater.

### O mecanismo central (a "genialidade")
É o **Duolingo aplicado ao futebol.** Nomeia três problemas de quem treina
sozinho e resolve cada um:
- *"Treino mas não melhoro"* → diz exatamente o que treinar a seguir (drills guiados).
- *"Estou mesmo a melhorar?"* → progresso visível (caminho que se sobe).
- *"O entusiasmo dura uma semana"* → streaks, XP, troféus, próximo drill à espera.

### Capacidades
- **Grátis:** onboarding de 2 min → caminho por posição; 6 categorias (Controlo,
  Passe, Remate, Defesa, Física, Guarda-redes); drills com vídeo + rounds
  cronometrados; XP, streaks, ligas, leaderboard, feed; player card que sobe.
- **Pro:** análise de vídeo por IA (competência-a-competência); Academy; treino
  mental; nutrição + scanner de comida; "Athlete Lifestyle Manager" (horário
  diário à volta de escola/treino/sono).

### O verdadeiro fosso (moat)
Quase tudo é copiável (caminho, drills, XP, streaks). O difícil e caro é a
**análise de vídeo por IA** — e é precisamente o que ficou mais acessível com a
IA multimodal / API da Anthropic. "Ser melhor" na IA é realista, mas é **Fase 4**.

### O que os screenshots reais revelaram
1. **O feed social está morto** — todos os posts com "0 likes"; ligas com pouca
   gente (o Nicolas é #1 com 693 XP; o 2.º tem 237). A camada social é o ponto
   mais fraco da líder, e vê-se. **Maior oportunidade nossa.**
2. **Cartão de jogador estilo FIFA** — rating 53, atributos CTL/PAS/SHO/DEF/FIT/GK,
   cada competência sobe de nível sozinha. Muito motivador para adolescentes.
3. **Caminho Duolingo puro** — níveis → fases → nós de drill (bloqueado/START/✓),
   troféu por fase. Padrão muito copiável.
4. **Retenção clássica** — heatmap anual "training year", achievements
   Bronze/Prata/Ouro, mascote (tartaruga) com frases motivacionais.
5. **Biblioteca de vídeo vazia** — mesmo a líder não consegue pôr os miúdos a
   gravarem-se para a IA. Valida deixar a IA para o fim.

---

## 4. Análise da concorrência (12 apps)

### Os 4 tipos de app
- **A — Gamificadas** (o nosso terreno): Footwork, FPRO, 4Kickerz, U-Pro. Algumas
  precisam de **tapete** físico.
- **B — Conteúdo/currículo** ("Netflix de treinos"): Techne, Beast Mode, Anytime,
  Renegade, Train Effective, box-to-box. Só software, mas fracas em gamificação.
- **C — Bola inteligente**: Dribble Up (bola com sensor ~90$).
- **D — Inteligência de jogo**: Be Your Best (cognitivo/VR; usada por profissionais).

### Vantagens/desvantagens — resumo dos concorrentes-chave
- **FPRO** — muito gamificada, drills de profissionais, compra única. **Mas** exige
  tapete; foco só em ball mastery.
- **U-Pro Soccer** (a mais parecida com a nossa ideia) — junta IA + gamificação +
  social. **Mas** também depende de tapete; nova e pouco provada.
- **Techne Futbol** — conteúdo novo semanal, credível, **ligas privadas de equipa**
  (prova que social real prende). **Mas** cara (até 38$/mês), repetitiva, sem
  análise de jogo.
- **Beast Mode** — biblioteca profunda + secção de aprendizagem tática. **Mas**
  cara, feita para quem já é auto-motivado.
- **Anytime** — 5000+ vídeos, barata, funcionalidades de equipa. **Mas** pouca
  gamificação/personalização.
- **Dribble Up** — feedback real via câmara. **Mas** precisa da bola proprietária.

### Matriz (o essencial)
Ninguém junta ao mesmo tempo: **só software + gamificada forte + social real +
IA por vídeo + português/futsal.** A Footwork é a mais próxima, mas falha no
social, no português/futsal e na ligação aos jogos.

### O espaço vazio (a nossa entrada)
> **"A Footwork, mas em português, com futsal à parte, com social a sério entre a
> tua equipa — e que sabe como jogaste no fim de semana."**

---

## 5. Posicionamento / diferenciação

Três cunhas possíveis; escolher **uma principal** (decisão do Nicolas):
- **Social real ("a tua equipa, não estranhos")** — ataca a maior falha da líder
  (feed morto) e cresce sozinha (cada miúdo traz colegas). *Recomendação atual.*
- **Ligada aos jogos** — o jogo de sábado decide o treino da semana. Ninguém faz.
- **Futsal-first** — **NÃO**: por decisão do David, o futebol é o principal e o
  futsal fica numa secção **separada e secundária**, sem o mesmo destaque.

Enquadramento transversal (não é cunha, é o "sabor"): **português + futebol**
(não "soccer"), com o futsal como secção menor à parte.

---

## 6. Decisões em aberto (para decidir com o Nicolas)

1. **Cunha principal** — social entre colegas / ligada aos jogos. *(destranca tudo)*
2. **Posição a desenhar primeiro** — a do Nicolas (LW) é a aposta.
3. **Visual do progresso** — caminho Duolingo / carreira / cartão de jogador.
4. **Vídeos dos drills** — gravamos nós / links de YouTube.
5. **Nome da app** — o Nicolas traz 3 ideias.

*(Nenhuma destas trava o arranque da Fase 1 — o esqueleto é igual para qualquer
cunha. Ver secção 10.)*

---

## 7. Âmbito do MVP e roadmap

**MVP (Fase 1) — meta:** o Nicolas escolhe posição, vê um caminho de drills de
domínio de bola, faz um drill com vídeo, ganha XP, mantém streak. Detalhe completo
em `SPEC.md`.

| Fase | O que fazemos | "Pronta" quando |
|---|---|---|
| 0 — Ideia | Decidir cunha, nome, visual, posição | Decisões 1–5 fechadas |
| 1 — MVP | Posição → caminho → drill c/ vídeo → XP → streak | Nicolas faz um treino real na app |
| 2 — Divertida | Rounds cronometrados, **cartão de jogador**, mais drills | Dá vontade de voltar todos os dias |
| 3 — Social | Desafiar um colega, streaks partilhadas (a cunha) | Um colega do Nicolas usa também |
| 4 — IA | Gravar clip → feedback por IA (o "melhor que eles") | A IA dá feedback útil a um drill |

**Prioridade de funcionalidades:** ESSENCIAL (posição, caminho, drill+vídeo,
XP+streak) → IMPORTANTE (rounds, cartão de jogador) → DESEJÁVEL (social, IA,
nutrição/mental). O **cartão de jogador** é o primeiro a acrescentar depois do MVP
(é o que mais prende o Nicolas).

---

## 8. Abordagem técnica

- **Web-first / PWA** — funciona no telemóvel pelo browser, instala no ecrã
  inicial, resultados no mesmo dia, sem lojas de apps. Graduar para nativo
  (React Native / Expo) mais tarde, a partir da mesma base.
- **Stack:** Vite + React + TypeScript + Tailwind, mobile-first. PWA via
  `vite-plugin-pwa`. Sem backend nem contas no início: progresso em `localStorage`.
- **Dados:** `drills.json` (não fixar drills no código).
- **IA (Fase 4):** API da Anthropic para análise de vídeo — sem hardware, só o clip.
- **Segurança:** sem palavras-passe, dados de pagamento ou dados pessoais de
  menores no arranque. Sem login. Só telemóvel + bola.

---

## 9. Papéis

- **Nicolas:** decide cunha/nome/visual (designer); escolhe e testa drills
  (especialista de futebol); grava/escolhe vídeos; testa cada versão.
- **Pai:** monta o projeto no Claude Code e a estrutura técnica; escreve o código
  com o Claude; trata de dados/segurança/deploy; ensina o "porquê".

---

## 10. Estado atual e próximos passos

**Feito até agora:**
- Análise profunda da Footwork (landing + App Store + screenshots reais).
- Análise da concorrência (12 apps, vantagens/desvantagens, matriz, espaço vazio).
- Plano pai-filho com decisões para o Nicolas.
- **Pack de arranque da Fase 1:** `SPEC.md`, `drills.json`, `CLAUDE_CODE_PROMPT.md`.
- Regra fixada: **futebol principal, futsal secção separada e secundária.**

**Próximos passos (em paralelo):**
1. **Construir o esqueleto** — pasta nova com `SPEC.md` + `drills.json`, abrir o
   Claude Code e colar o `CLAUDE_CODE_PROMPT.md`. O esqueleto não depende da cunha.
2. **Sessão com o Nicolas** — fechar a Decisão 1 (cunha) e trazer 3 nomes.
3. **Juntar as duas coisas** — aplicar nome/tema e começar a camada social (Fase 3).

---

## 11. Ficheiros do projeto (juntar ao conhecimento do Project)

- **Este documento** — contexto-mestre.
- `SPEC.md` — especificação do MVP (Fase 1), pronta para o Claude Code.
- `drills.json` — 12 drills de futebol (path principal) + 3 de futsal (secundário).
- `CLAUDE_CODE_PROMPT.md` — prompt de arranque para o Claude Code.
- `Plano_App_Futebol_Nicolas.docx` — o plano para ler com o Nicolas.
- `Analise_Concorrencia_App_Futebol.docx` — a análise completa da concorrência.

---

## 12. Configuração sugerida do Project

**Nome:** `App de Futebol — Nicolas & Pai`

**Descrição:** Construção de uma app de treino de futebol (estilo Footwork, mas
melhor), projeto pai-e-filho, no Claude Code.

**Instruções personalizadas do Project (copiar para o campo de instruções):**

```
Este é um projeto pai-e-filho: o David e o filho Nicolas (14, extremo esquerdo)
constroem uma app de treino de futebol inspirada na Footwork, no Claude Code.

- Responde sempre em PT-PT. Texto visível ao utilizador da app em PT-PT;
  identificadores de código em inglês (convenção).
- O FUTEBOL é o principal. O FUTSAL fica sempre numa secção separada e
  secundária, sem o mesmo destaque. Nunca inverter esta hierarquia.
- Entrega outputs prontos a usar, não rascunhos. Termina sempre com um próximo
  passo concreto. Sê direto; indica o caminho mais rápido e executa.
- Abordagem: web-first / PWA (Vite + React + TS + Tailwind), sem contas nem
  servidor no início (localStorage). Graduar para nativo mais tarde. IA (análise
  de vídeo) só na Fase 4, via API da Anthropic.
- Constrói por fases pequenas (ver o documento-mestre). Não tentar fazer tudo de
  uma vez. A cunha do produto (social entre colegas / ligada aos jogos) é decisão
  do Nicolas.
- O Nicolas é o designer/especialista de futebol; o David faz a parte técnica.
  Lembra-te de que é também um projeto de aprendizagem — explica o "porquê".
- Não confundir este projeto com os outros projetos do David (JFA, Fun in
  Portugal, etc.). Este é só a app de futebol.
```
