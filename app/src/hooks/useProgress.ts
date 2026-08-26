import { useCallback, useState } from 'react'
import { applyCompletion } from '../lib/progressLogic'
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
   * perdiam-se umas às outras). Regras puras em lib/progressLogic (testadas).
   */
  const completeDrill = useCallback(
    (
      drill: Drill,
      opts?: { dayProgramIds?: string[]; claimProgramIds?: string[] },
    ): CompletionResult => {
      const wasNew = !progress.completedDrillIds.includes(drill.id)
      const next = applyCompletion(progress, drill, opts ?? {}, today(), yesterday())
      save(next)
      setProgress(next)
      return { xpGained: drill.xp, streak: next.streak.current, wasNew }
    },
    [progress],
  )

  const isCompleted = useCallback(
    (drillId: string) => progress.completedDrillIds.includes(drillId),
    [progress.completedDrillIds],
  )

  return { progress, completeDrill, isCompleted }
}
