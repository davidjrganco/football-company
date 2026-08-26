# SPEC — App de Treino (Fase 1 / MVP)

> Documento de especificação para dar ao Claude Code.
> Projeto pai-e-filho (David & Nicolas). Referência de mercado: Footwork.
> **Idioma da app: PT-PT.** Identificadores de código em inglês (convenção).

---

## 1. Objetivo do MVP

A versão mais pequena que já é útil e divertida. Meta concreta:

> O Nicolas abre a app no telemóvel, vê um caminho de exercícios de **domínio de bola (ball mastery)** para a sua posição, faz um exercício com vídeo, marca como concluído, ganha XP e mantém uma streak diária.

Se isto funcionar e prender, ganhámos a Fase 1. Tudo o resto vem depois.

---

## 2. Âmbito

### Dentro (construir agora)
- **Caminho (Path)** vertical estilo Duolingo: nós de exercício desbloqueados um a um.
- **Ecrã de exercício**: vídeo + descrição + dica + temporizador + botão "Concluir".
- **Progresso**: XP total, streak diária, nº de exercícios feitos.
- **Perfil simples**: streak atual, melhor streak, XP total, exercícios feitos.
- **Persistência local** (sem contas, sem servidor): o progresso guarda-se no telemóvel.
- **PWA**: instalável no ecrã inicial, funciona pelo browser.

### Fora (NÃO construir agora — não-objetivos)
- Contas / login / servidor / base de dados online.
- Análise de vídeo por IA (Fase 4).
- Social / leaderboard reais (Fase 3) — deixar só um *stub* visual se ajudar.
- Pagamentos / subscrição.
- App nativa nas lojas (graduamos mais tarde a partir do mesmo código).

---

## 3. Regra de conteúdo — futebol primeiro, futsal à parte

- O **futebol é o principal**. O caminho central e a maioria dos exercícios são de futebol.
- O **futsal existe numa secção separada e claramente secundária** — **não** deve ter o mesmo peso visual nem o mesmo destaque que o futebol. Na navegação fica em último, discreto. No MVP pode ser uma secção pequena com poucos exercícios (ou "Em breve"). Ver `drills.json`: o path de futsal vem com `"primary": false`.

---

## 4. Stack técnica recomendada

- **Vite + React + TypeScript**
- **Tailwind CSS** (tema escuro, mobile-first)
- **Navegação**: React Router (ou navegação por estado — poucas telas)
- **Estado + persistência**: hook próprio sobre `localStorage` (ex.: `useProgress`). Sem backend.
- **PWA**: `vite-plugin-pwa`
- **Dados**: importar `drills.json` (fornecido)
- **Layout**: contentor centrado, largura máx. ~430px, pensado para telemóvel.

---

## 5. Modelo de dados

Os exercícios vêm de `drills.json`. Estrutura:

```
{
  "meta": { "version", "language" },
  "paths": [
    {
      "id", "sport": "futebol" | "futsal", "primary": true|false,
      "name", "category",
      "drills": [
        {
          "id", "order", "name", "name_en", "skill",
          "difficulty": 1|2|3, "duration_seconds", "xp",
          "description", "cue",
          "video": { "type": "pending"|"youtube"|"local", "url": "" }
        }
      ]
    }
  ]
}
```

> Nota sobre `video`: a decisão "gravamos nós vs. YouTube" ainda não está tomada.
> Por agora `type: "pending"` — mostrar um *placeholder* de vídeo no ecrã do exercício.

### Estado do jogador (localStorage)
```
{
  "xpTotal": number,
  "drillsDone": number,
  "completedDrillIds": string[],
  "streak": { "current": number, "best": number, "lastTrainedDate": "YYYY-MM-DD" }
}
```

---

## 6. Ecrãs

### 6.1 Caminho (Home / default)
- **Topo**: nome do jogador, streak (com chama 🔥) e XP total.
- **Corpo**: trilho vertical de nós. Cada nó = um exercício.
  - Concluído → verde com ✓. Atual → destacado com botão "COMEÇAR". Bloqueado → cinzento com 🔒.
  - Desbloqueio **sequencial**: só se abre o próximo quando o atual é concluído.
- **Barra de navegação inferior**: Caminho · Perfil · Futsal (discreto, em último).

### 6.2 Ecrã do exercício
- Vídeo no topo (placeholder enquanto `type: "pending"`).
- Nome + `skill` + dificuldade.
- `description` (como fazer) e `cue` (a dica-chave, destacada).
- **Temporizador** com `duration_seconds` (contagem decrescente, com Iniciar/Parar).
- Botão **"Concluir"** → aplica as regras da secção 7, mostra "+XP", volta ao caminho com o nó feito e o seguinte desbloqueado.

### 6.3 Perfil
- Streak atual e melhor streak, XP total, exercícios feitos.
- *(Stub para v2: cartão de jogador estilo FIFA com atributos por competência — não construir agora, deixar comentário no código a marcar o sítio.)*

### 6.4 Futsal (secundário)
- Secção separada, visualmente discreta. Poucos exercícios (ver `drills.json`) ou "Em breve".
- **Não** replicar o destaque do futebol.

---

## 7. Mecânicas (regras exatas)

**Ao concluir um exercício:**
1. Somar `drill.xp` a `xpTotal` (default 30).
2. Incrementar `drillsDone` e juntar o `id` a `completedDrillIds`.
3. Desbloquear o exercício seguinte no path.
4. Atualizar a **streak**:
   - `hoje = YYYY-MM-DD` do dispositivo.
   - Se `lastTrainedDate === hoje` → não mexer na streak (já treinou hoje).
   - Se `lastTrainedDate === ontem` → `current += 1`.
   - Caso contrário (falhou ≥1 dia, ou primeira vez) → `current = 1`.
   - `best = max(best, current)`.
   - `lastTrainedDate = hoje`.

*(Streak-freeze / "saves" e níveis/fases agrupadas ficam para v2.)*

---

## 8. Aparência

- **Tema escuro**, energético mas limpo. Fundo quase-preto.
- Verde de "relva/concluído", laranja/vermelho para a chama da streak.
- Cantos arredondados, botões com relevo (estilo jogo). Mobile-first.
- Tipografia forte e legível; números grandes (XP, streak) bem visíveis.

---

## 9. Estrutura de pastas sugerida

```
src/
  data/drills.json
  hooks/useProgress.ts        // estado + localStorage + regras da secção 7
  components/PathNode.tsx
  components/BottomNav.tsx
  components/DrillTimer.tsx
  screens/PathScreen.tsx
  screens/DrillScreen.tsx
  screens/ProfileScreen.tsx
  screens/FutsalScreen.tsx    // secundário
  App.tsx
  main.tsx
```

---

## 10. Critério de "pronto" (Fase 1)

- [ ] O caminho carrega os exercícios de futebol a partir de `drills.json`.
- [ ] Dá para abrir um exercício, ver a descrição/dica e o temporizador.
- [ ] "Concluir" dá XP, desbloqueia o seguinte e atualiza a streak.
- [ ] O progresso persiste ao fechar e reabrir (localStorage).
- [ ] Instala no telemóvel como PWA.
- [ ] O futsal está presente mas discreto e secundário.
