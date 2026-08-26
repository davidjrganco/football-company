---
doc: Análise Profunda — Footwork
area: 01_PRODUCT
estado: Aprovado
responsavel: Fundadores
atualizado: 2026-08-01
---

# Análise Profunda — Footwork

> Análise completa da app de referência (landing page + App Store + 8 screenshots reais).

## O que é
App de **treino individual** de futebol (jogador, não treinador/equipa), de James Xu.
Só software, grátis com subscrição "Pro". iOS e Android. 12k+ downloads, 4.8★ (400+ avaliações).
A landing vende simplicidade ("traz a bola e segue o caminho"); a App Store revela uma app
muito mais completa (IA, nutrição, treino mental, gestão de rotina) — profundidade escondida
atrás de uma entrada simples.

## Mecanismo central (a "genialidade")
**Duolingo aplicado ao futebol.** Nomeia três problemas de quem treina sozinho e resolve cada um:
- "Treino mas não melhoro" → diz o que treinar a seguir (drills guiados com vídeo).
- "Estou mesmo a melhorar?" → progresso visível (caminho que se sobe).
- "O entusiasmo dura uma semana" → streaks, XP, troféus, próximo drill à espera.

## Capacidades — grátis
Onboarding 2 min (nível, posição, objetivos) → caminho personalizado; caminho por posição;
6 categorias (Controlo, Passe, Remate, Defesa, Física, Guarda-redes); drills com vídeo + rounds
cronometrados que sobem de intensidade; XP, streaks (com "saves"/freezes), ligas, leaderboard,
feed de comunidade, player card que sobe de nível; análise "Quick" por IA ilimitada; relatórios
semanais; lembretes.

## Capacidades — Pro
Análise "Deep" por IA (pontuação competência-a-competência em 8+ áreas + recomendações);
bibliotecas de drills de profissionais; Academy (leitura de jogo); treino mental; nutrição
(planos + scanner de comida por IA); "Athlete Lifestyle Manager" (horário diário à volta de
escola/treino/refeições/sono); Creator Codes.

## O que os 8 screenshots reais revelaram
1. **Feed morto** — Afzal/Harrison/Eric, todos "0 likes". Ligas com pouca gente ativa
   (Nicolas #1 com 693 XP; 2.º com 237; 3.º com 66). A camada social **falha visivelmente**.
2. **Cartão de jogador FIFA** — rating 53, atributos CTL 3/PAS 2/SHO 2/DEF 1/FIT 1/GK 1;
   cada competência sobe sozinha ("Control → LVL 4, 100 XP"). Muito motivador.
3. **Caminho Duolingo puro** — Nível 1 › "Fase 9 · Ball Mastery" › nó "Push Stop Cone Weave" ›
   START › nós bloqueados. Troféu por fase ("8 phases done").
4. **Retenção** — heatmap anual "Training year" (estilo GitHub), achievements Bronze/Prata/Ouro
   com barras (Wildfire 5/7, Grinder 27/50, Scholar 193/1000, Specialist 3/5), mascote tartaruga
   com frases ("Pro mode on. No shortcuts, just reps.").
5. **Biblioteca de vídeo vazia** ("No videos yet. Record a session and get AI analysis") —
   mesmo a líder não consegue pôr os miúdos a gravarem-se.
6. **Pro** organizado em "Your Body" (recuperação, dieta), "Your Game" (Academy, treino mental),
   "Your Day" (Athlete Lifestyle Manager).

## Público
Jovens 10–18 que treinam sozinhos entre treinos da equipa ("para os dias em que não estás no
treino"). Nicolas (14, LW) está no centro do alvo. Comprador provável: os pais.

## Modelo de negócio
Freemium; grátis generoso (aquisição) + subscrição Pro. Mercado paga caro (ver concorrência).

## O moat
Quase tudo é copiável (caminho, drills, XP, streaks, cartão). O difícil e caro é a **análise de
vídeo por IA** — hoje acessível via API multimodal (Anthropic), **sem hardware**. É o nosso
"melhor que eles", mas Fase 4.

## Fraquezas → as nossas oportunidades
1. Só inglês / "soccer" → **português / futebol**.
2. Sem futsal → futsal como secção secundária (ADR-0002).
3. Só a solo, social fraco (feed morto) → **social real entre colegas**.
4. Não liga aos jogos reais → **o jogo de sábado decide o treino da semana**.
5. Paywall agressivo → grátis honesto.
