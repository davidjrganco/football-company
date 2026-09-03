import type { Drill, ProgressState, StreakState } from '../types'

// Lógica pura do progresso (extraída do hook para ser testável — Raio-X 2026-08).
// As datas entram como argumentos: nada aqui lê o relógio.

export const MAX_SHIELDS = 2

export interface CompleteOpts {
  dayProgramIds?: string[]
  claimProgramIds?: string[]
  /** ids da sessão "Treino de Hoje" — para marcar progresso e dar o bónus */
  sessionIds?: string[]
  sessionBonusXp?: number
}

export interface CompletionOutcome {
  state: ProgressState
  /** XP realmente ganho neste treino (com o decaimento de repetição do dia) */
  xpGained: number
  /** XP extra entregue por completar a sessão do dia (0 se não completou agora) */
  sessionBonus: number
  /** um escudo salvou a streak de um dia falhado */
  shieldUsed: boolean
  /** ganhou um escudo por completar o Treino de Hoje */
  shieldEarned: boolean
}

/**
 * XP de um treino consoante as repetições de HOJE (Iteração F): a 1.ª vez vale
 * tudo, a 2.ª metade, da 3.ª em diante 5 XP — variar é a estratégia ótima.
 */
export function xpForCompletion(drill: Drill, timesAlreadyToday: number): number {
  if (timesAlreadyToday <= 0) return drill.xp
  if (timesAlreadyToday === 1) return Math.round(drill.xp / 2)
  return 5
}

/**
 * Regras da streak (SPEC secção 7 + escudos da Iteração F): hoje não mexe,
 * ontem +1; falhou EXATAMENTE um dia e tem escudo → escudo gasto e a streak
 * continua; senão volta a 1.
 */
export function applyStreak(
  streak: StreakState,
  today: string,
  yesterday: string,
  dayBefore: string,
): { streak: StreakState; shieldUsed: boolean } {
  const s: StreakState = { ...streak }
  let shieldUsed = false
  if (s.lastTrainedDate === today) {
    // já treinou hoje — não mexer
  } else if (s.lastTrainedDate === yesterday) {
    s.current += 1
  } else if (s.lastTrainedDate === dayBefore && s.shields > 0) {
    s.shields -= 1
    s.current += 1
    shieldUsed = true
  } else {
    s.current = 1
  }
  s.best = Math.max(s.best, s.current)
  s.lastTrainedDate = today
  return { streak: s, shieldUsed }
}

/**
 * Conclusão de um exercício: XP (com decaimento diário), contagens, dias de
 * programa, sessão do dia, escudos e recompensas — TUDO num só estado novo.
 */
export function applyCompletion(
  progress: ProgressState,
  drill: Drill,
  opts: CompleteOpts,
  today: string,
  yesterday: string,
  dayBefore: string,
): CompletionOutcome {
  const wasNew = !progress.completedDrillIds.includes(drill.id)
  const { dayProgramIds = [], claimProgramIds = [], sessionIds = [], sessionBonusXp = 0 } = opts

  // dia de treino por programa (no máximo 1 registo por dia em cada)
  let programTrainingDays = progress.programTrainingDays
  for (const programId of dayProgramIds) {
    const days = programTrainingDays[programId] ?? []
    if (!days.includes(today)) {
      programTrainingDays = { ...programTrainingDays, [programId]: [...days, today] }
    }
  }

  // sessão "Treino de Hoje": vira o dia se a data mudou
  let daily =
    progress.daily.date === today
      ? { ...progress.daily, completions: { ...progress.daily.completions } }
      : { date: today, doneIds: [] as string[], bonusClaimed: false, withFriends: false, completions: {} as Record<string, number> }

  // XP decrescente para repetições do MESMO exercício no MESMO dia
  const timesToday = daily.completions?.[drill.id] ?? 0
  const xpGained = xpForCompletion(drill, timesToday)
  daily.completions = { ...daily.completions, [drill.id]: timesToday + 1 }

  if (sessionIds.includes(drill.id) && !daily.doneIds.includes(drill.id)) {
    daily = { ...daily, doneIds: [...daily.doneIds, drill.id] }
  }

  // streak (com escudos)
  const { streak, shieldUsed } = applyStreak(progress.streak, today, yesterday, dayBefore)

  // bónus + escudo por completar a sessão do dia (uma vez por dia)
  let sessionBonus = 0
  let shieldEarned = false
  if (
    sessionIds.length > 0 &&
    !daily.bonusClaimed &&
    sessionIds.every((id) => daily.doneIds.includes(id))
  ) {
    daily = { ...daily, bonusClaimed: true }
    sessionBonus = sessionBonusXp
    if (streak.shields < MAX_SHIELDS) {
      streak.shields += 1
      shieldEarned = true
    }
  }

  const state: ProgressState = {
    xpTotal: progress.xpTotal + xpGained + sessionBonus,
    drillsDone: progress.drillsDone + 1,
    completedDrillIds: wasNew
      ? [...progress.completedDrillIds, drill.id]
      : progress.completedDrillIds,
    completionCounts: {
      ...progress.completionCounts,
      [drill.id]: (progress.completionCounts[drill.id] ?? 0) + 1,
    },
    claimedPrograms: [
      ...progress.claimedPrograms,
      ...claimProgramIds.filter((id) => !progress.claimedPrograms.includes(id)),
    ],
    programTrainingDays,
    daily,
    feedback: progress.feedback,
    records: progress.records,
    trainingDays: progress.trainingDays.includes(today)
      ? progress.trainingDays
      : [...progress.trainingDays, today],
    streak,
  }
  return { state, xpGained, sessionBonus, shieldUsed, shieldEarned }
}

/** Tenta registar um recorde pessoal; só grava se bater o melhor anterior. */
export function applyRecord(
  progress: ProgressState,
  drillId: string,
  value: number,
  today: string,
): { state: ProgressState; newRecord: boolean; best: number } {
  const prev = progress.records[drillId]
  if (!Number.isFinite(value) || value <= 0 || (prev && value <= prev.best)) {
    return { state: progress, newRecord: false, best: prev?.best ?? 0 }
  }
  return {
    state: {
      ...progress,
      records: { ...progress.records, [drillId]: { best: value, date: today } },
    },
    newRecord: true,
    best: value,
  }
}
