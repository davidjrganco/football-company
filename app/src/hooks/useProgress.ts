import { useCallback, useState } from 'react'
import type { Drill, ProgressState } from '../types'

const STORAGE_KEY = 'treino-progress-v1'

const DEFAULT_STATE: ProgressState = {
  xpTotal: 0,
  drillsDone: 0,
  completedDrillIds: [],
  completionCounts: {},
  claimedPrograms: [],
  programTrainingDays: {},
  streak: { current: 0, best: 0, lastTrainedDate: null },
}

/** YYYY-MM-DD pela data LOCAL do dispositivo (SPEC 7 — não usar UTC). */
function localDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Exportado para a app poder raciocinar sobre "hoje" com a mesma definição. */
export function localToday(): string {
  return localDateString(new Date())
}

function today(): string {
  return localToday()
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return localDateString(d)
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    const state: ProgressState = {
      ...DEFAULT_STATE,
      ...parsed,
      completionCounts: { ...parsed.completionCounts },
      claimedPrograms: parsed.claimedPrograms ?? [],
      programTrainingDays: { ...parsed.programTrainingDays },
      streak: { ...DEFAULT_STATE.streak, ...parsed.streak },
    }
    // migração v1→v2: quem já tinha exercícios feitos passa a contar 1 de cada
    if (Object.keys(state.completionCounts).length === 0 && state.completedDrillIds.length > 0) {
      for (const id of state.completedDrillIds) state.completionCounts[id] = 1
    }
    return state
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // sem espaço / modo privado — a app continua a funcionar em memória
  }
}

export interface CompletionResult {
  xpGained: number
  streak: number
  wasNew: boolean // primeira vez que este exercício foi concluído (desbloqueia o seguinte)
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(load)

  /**
   * Regras da SPEC secção 7 + v2 (Player Review): repetir um exercício volta a
   * dar XP e conta para os atributos — treinar todos os dias é o objetivo.
   * Calculado de forma síncrona (fora do updater) para o resultado estar
   * disponível logo no handler do clique.
   * `dayProgramIds`: regista o dia de treino nesses programas (o exercício
   * conta venha do caminho misto ou do programa). `claimProgramIds`: entrega
   * as recompensas NA MESMA gravação (atómico — gravações separadas
   * perdiam-se umas às outras).
   */
  const completeDrill = useCallback(
    (
      drill: Drill,
      opts?: { dayProgramIds?: string[]; claimProgramIds?: string[] },
    ): CompletionResult => {
      const wasNew = !progress.completedDrillIds.includes(drill.id)
      const { dayProgramIds = [], claimProgramIds = [] } = opts ?? {}

      // dia de treino por programa (no máximo 1 registo por dia em cada)
      let programTrainingDays = progress.programTrainingDays
      for (const programId of dayProgramIds) {
        const days = programTrainingDays[programId] ?? []
        if (!days.includes(today())) {
          programTrainingDays = { ...programTrainingDays, [programId]: [...days, today()] }
        }
      }

      const next: ProgressState = {
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
        streak: { ...progress.streak },
      }

      // streak diária pela data do dispositivo
      const t = today()
      const s = next.streak
      if (s.lastTrainedDate === t) {
        // já treinou hoje — não mexer
      } else if (s.lastTrainedDate === yesterday()) {
        s.current += 1
      } else {
        s.current = 1
      }
      s.best = Math.max(s.best, s.current)
      s.lastTrainedDate = t

      save(next)
      setProgress(next)
      return { xpGained: drill.xp, streak: s.current, wasNew }
    },
    [progress],
  )

  const isCompleted = useCallback(
    (drillId: string) => progress.completedDrillIds.includes(drillId),
    [progress.completedDrillIds],
  )

  return { progress, completeDrill, isCompleted }
}
