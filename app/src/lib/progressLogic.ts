import type { Drill, ProgressState, StreakState } from '../types'

// Lógica pura do progresso (extraída do hook para ser testável — Raio-X 2026-08).
// As datas entram como argumentos: nada aqui lê o relógio.

export interface CompleteOpts {
  dayProgramIds?: string[]
  claimProgramIds?: string[]
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
 * programa e recompensas — TUDO num só estado novo (gravação atómica).
 */
export function applyCompletion(
  progress: ProgressState,
  drill: Drill,
  opts: CompleteOpts,
  today: string,
  yesterday: string,
): ProgressState {
  const wasNew = !progress.completedDrillIds.includes(drill.id)
  const { dayProgramIds = [], claimProgramIds = [] } = opts

  // dia de treino por programa (no máximo 1 registo por dia em cada)
  let programTrainingDays = progress.programTrainingDays
  for (const programId of dayProgramIds) {
    const days = programTrainingDays[programId] ?? []
    if (!days.includes(today)) {
      programTrainingDays = { ...programTrainingDays, [programId]: [...days, today] }
    }
  }

  return {
    xpTotal: progress.xpTotal + drill.xp,
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
    streak: applyStreak(progress.streak, today, yesterday),
  }
}
