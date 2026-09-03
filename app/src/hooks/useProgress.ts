import { useCallback, useState } from 'react'
import { applyCompletion, applyRecord, type CompleteOpts } from '../lib/progressLogic'
import type { Drill, FeedbackLevel, ProgressState } from '../types'

const STORAGE_KEY = 'treino-progress-v1'

const DEFAULT_STATE: ProgressState = {
  xpTotal: 0,
  drillsDone: 0,
  completedDrillIds: [],
  completionCounts: {},
  claimedPrograms: [],
  programTrainingDays: {},
  daily: { date: '', doneIds: [], bonusClaimed: false, withFriends: false, completions: {} },
  feedback: {},
  records: {},
  trainingDays: [],
  streak: { current: 0, best: 0, lastTrainedDate: null, shields: 0 },
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

function dayBefore(): string {
  const d = new Date()
  d.setDate(d.getDate() - 2)
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
      daily: { ...DEFAULT_STATE.daily, ...parsed.daily },
      feedback: { ...parsed.feedback },
      records: { ...parsed.records },
      trainingDays: parsed.trainingDays ?? [],
      streak: { ...DEFAULT_STATE.streak, ...parsed.streak },
    }
    // migração: sem histórico global de dias, semeia com os dias dos programas
    if (state.trainingDays.length === 0) {
      const seen = new Set<string>()
      for (const days of Object.values(state.programTrainingDays)) for (const d of days) seen.add(d)
      if (state.streak.lastTrainedDate) seen.add(state.streak.lastTrainedDate)
      state.trainingDays = [...seen].sort()
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
  sessionBonus: number // XP extra por ter completado o Treino de Hoje (0 se não)
  shieldUsed: boolean // um escudo salvou a streak
  shieldEarned: boolean // ganhou um escudo ao completar a sessão
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
    (drill: Drill, opts?: CompleteOpts): CompletionResult => {
      const wasNew = !progress.completedDrillIds.includes(drill.id)
      const { state, xpGained, sessionBonus, shieldUsed, shieldEarned } = applyCompletion(
        progress,
        drill,
        opts ?? {},
        today(),
        yesterday(),
        dayBefore(),
      )
      save(state)
      setProgress(state)
      return { xpGained, streak: state.streak.current, wasNew, sessionBonus, shieldUsed, shieldEarned }
    },
    [progress],
  )

  /** "Como correu?" — guarda o feedback do exercício (semente da dificuldade adaptativa). */
  const recordFeedback = useCallback(
    (drillId: string, level: FeedbackLevel) => {
      const counts = progress.feedback[drillId] ?? { facil: 0, normal: 0, dificil: 0 }
      const next: ProgressState = {
        ...progress,
        feedback: { ...progress.feedback, [drillId]: { ...counts, [level]: counts[level] + 1 } },
      }
      save(next)
      setProgress(next)
    },
    [progress],
  )

  const isCompleted = useCallback(
    (drillId: string) => progress.completedDrillIds.includes(drillId),
    [progress.completedDrillIds],
  )

  /** Recorde pessoal: grava se bater o melhor; devolve o resultado para a UI. */
  const saveRecord = useCallback(
    (drillId: string, value: number): { newRecord: boolean; best: number } => {
      const { state, newRecord, best } = applyRecord(progress, drillId, value, today())
      if (newRecord) {
        save(state)
        setProgress(state)
      }
      return { newRecord, best }
    },
    [progress],
  )

  /** Toggle "hoje treino acompanhado" (inclui os exercícios 👥 na sessão). */
  const setWithFriends = useCallback(
    (withFriends: boolean) => {
      const sameDay = progress.daily.date === today()
      const next: ProgressState = {
        ...progress,
        daily: {
          date: today(),
          doneIds: sameDay ? progress.daily.doneIds : [],
          bonusClaimed: sameDay ? progress.daily.bonusClaimed : false,
          withFriends,
        },
      }
      save(next)
      setProgress(next)
    },
    [progress],
  )

  return { progress, completeDrill, isCompleted, recordFeedback, saveRecord, setWithFriends }
}
