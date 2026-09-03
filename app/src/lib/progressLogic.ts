import type { Drill, ProgressState, StreakState } from '../types'

// Lógica pura do progresso (extraída do hook para ser testável — Raio-X 2026-08).
// As datas entram como argumentos: nada aqui lê o relógio.

export interface CompleteOpts {
  dayProgramIds?: string[]
  claimProgramIds?: string[]
  /** ids da sessão "Treino de Hoje" — para marcar progresso e dar o bónus */
  sessionIds?: string[]
  sessionBonusXp?: number
}

export interface CompletionOutcome {
  state: ProgressState
  /** XP extra entregue por completar a sessão do dia (0 se não completou agora) */
  sessionBonus: number
}

/** Regras exatas da streak (SPEC secção 7): hoje não mexe, ontem +1, senão 1. */
export function applyStreak(streak: StreakState, today: string, yesterday: string): StreakState {
  const s: StreakState = { ...streak }
  if (s.lastTrainedDate === today) {
    // já treinou hoje — não mexer
  } else if (s.lastTrainedDate === yesterday) {
    s.current += 1
  } else {
    s.current = 1
  }
  s.best = Math.max(s.best, s.current)
  s.lastTrainedDate = today
  return s
}

/**
 * Conclusão de um exercício: XP (sempre, mesmo repetido), contagens, dias de
 * programa, sessão do dia e recompensas — TUDO num só estado novo (atómico).
 */
export function applyCompletion(
  progress: ProgressState,
  drill: Drill,
  opts: CompleteOpts,
  today: string,
  yesterday: string,
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

  // sessão "Treino de Hoje": vira o dia se a data mudou, marca este exercício,
  // e entrega o bónus UMA vez quando a sessão fica completa
  let daily =
    progress.daily.date === today
      ? progress.daily
      : { date: today, doneIds: [], bonusClaimed: false, withFriends: false }
  if (sessionIds.includes(drill.id) && !daily.doneIds.includes(drill.id)) {
    daily = { ...daily, doneIds: [...daily.doneIds, drill.id] }
  }
  let sessionBonus = 0
  if (
    sessionIds.length > 0 &&
    !daily.bonusClaimed &&
    sessionIds.every((id) => daily.doneIds.includes(id))
  ) {
    daily = { ...daily, bonusClaimed: true }
    sessionBonus = sessionBonusXp
  }

  const state: ProgressState = {
    xpTotal: progress.xpTotal + drill.xp + sessionBonus,
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
    streak: applyStreak(progress.streak, today, yesterday),
  }
  return { state, sessionBonus }
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
