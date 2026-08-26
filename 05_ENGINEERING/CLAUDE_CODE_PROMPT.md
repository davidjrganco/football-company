# Prompt de arranque para o Claude Code

> Cria uma pasta nova, mete lá o `SPEC.md` e o `drills.json`, abre o Claude Code
> nessa pasta e cola o prompt abaixo. É o ponto de partida da Fase 1.

---

## Prompt (copia a partir daqui)

Vais construir a Fase 1 (MVP) de uma app de treino de futebol. Lê o `SPEC.md`
nesta pasta — é a especificação completa e manda em tudo. Os exercícios estão
em `drills.json` (mesma pasta).

Contexto: é um projeto pai-e-filho. A app é em **português de Portugal** (todo o
texto visível ao utilizador em PT-PT). O jogador é o Nicolas: 14 anos, avançado
(extremo esquerdo / LW). A referência de mercado é a app "Footwork", em estilo
Duolingo.

Constrói assim:

1. **Stack**: Vite + React + TypeScript + Tailwind CSS, mobile-first (contentor
   centrado, largura máx. ~430px). PWA com `vite-plugin-pwa`. Sem backend, sem
   contas: o progresso guarda-se em `localStorage`.

2. **Ecrãs** (ver secção 6 do SPEC):
   - **Caminho** (default): trilho vertical de nós de exercício, desbloqueio
     sequencial (concluído = verde ✓, atual = destacado com "COMEÇAR",
     bloqueado = 🔒). Topo com nome, streak 🔥 e XP total. Barra inferior:
     Caminho · Perfil · Futsal.
   - **Exercício**: placeholder de vídeo, nome, competência, dificuldade,
     descrição, a dica (`cue`) destacada, temporizador com `duration_seconds`,
     e botão "Concluir".
   - **Perfil**: streak atual, melhor streak, XP total, exercícios feitos.
     (Deixa um comentário a marcar onde entrará, na v2, o cartão de jogador
     estilo FIFA — não o construas agora.)
   - **Futsal**: secção **secundária e discreta** — o futebol é o principal.
     Não lhe dês o mesmo destaque. Usa o path com `"primary": false` do
     `drills.json` (ou mostra "Em breve" se for mais simples).

3. **Regras de XP e streak**: implementa **exatamente** a secção 7 do SPEC
   (XP ao concluir, desbloqueio do seguinte, streak diária com base na data do
   dispositivo). Centraliza isto num hook `useProgress` sobre `localStorage`.

4. **Dados**: importa `drills.json`. Não fixes exercícios no código — lê sempre
   do ficheiro. O campo `video.type` é `"pending"` por agora → mostra um
   placeholder de vídeo no ecrã do exercício.

5. **Aspeto**: tema escuro, energético mas limpo; verde de relva/concluído,
   laranja/vermelho na chama da streak; cantos arredondados, botões com relevo
   (estilo jogo); números grandes e legíveis.

Começa por: montar o projeto, criar a estrutura de pastas da secção 9 do SPEC,
implementar o `useProgress` com as regras, e depois o ecrã do Caminho a ler o
`drills.json`. No fim, dá-me os comandos para correr no telemóvel (rede local)
e instalar como PWA.

Antes de escreveres código, mostra-me um plano curto (lista de ficheiros que vais
criar e por que ordem) e espera que eu diga "avança".

---

## Notas para ti, David (não fazem parte do prompt)

- **Decisões ainda em aberto** que não travam o arranque: o nome da app, o tema
  de cor final, e "gravamos os vídeos nós vs. YouTube". O esqueleto constrói-se
  sem isso — aplicas quando o Nicolas decidir.
- Quando o Nicolas escolher a **cunha** (social entre colegas / futsal / ligado
  aos jogos), avançamos para a Fase 3. O esqueleto da Fase 1 é o mesmo para
  qualquer cunha.
- Deixei o **cartão de jogador** de fora do MVP de propósito (é v2), mas marquei
  no SPEC onde entra — é o que mais prende o Nicolas, por isso é o primeiro
  a acrescentar depois.
