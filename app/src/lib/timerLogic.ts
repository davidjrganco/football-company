// Máquina de estados do temporizador de séries (pura e testável).
// O tempo entra como argumento (nowMs) — nada aqui lê o relógio.

export type TimerPhase = 'idle' | 'work' | 'rest' | 'done'

export interface TimerState {
  phase: TimerPhase
  setNo: number
  /** fim da fase atual em ms; null quando parado/pausado/idle/done */
  endsAt: number | null
  /** segundos restantes quando em pausa */
  paused: number | null
}

export const IDLE: TimerState = { phase: 'idle', setNo: 1, endsAt: null, paused: null }

export function startTimer(workSeconds: number, nowMs: number): TimerState {
  return { phase: 'work', setNo: 1, endsAt: nowMs + workSeconds * 1000, paused: null }
}

/** Segundos restantes da fase atual (contagem por relógio de parede). */
export function remainingSeconds(t: TimerState, workSeconds: number, nowMs: number): number {
  if (t.phase === 'idle') return workSeconds
  if (t.phase === 'done') return 0
  if (t.endsAt !== null) return Math.max(0, Math.ceil((t.endsAt - nowMs) / 1000))
  return t.paused ?? 0
}

/**
 * Um tick: se a fase atual chegou ao fim, transita (trabalho→descanso→série
 * seguinte→…→feito), com o fim novo contado a partir de agora.
 */
export function tickTimer(
  prev: TimerState,
  sets: number,
  workSeconds: number,
  restSeconds: number,
  nowMs: number,
): TimerState {
  if (prev.endsAt === null || nowMs < prev.endsAt) return prev
  if (prev.phase === 'work') {
    return prev.setNo < sets
      ? { phase: 'rest', setNo: prev.setNo, endsAt: nowMs + restSeconds * 1000, paused: null }
      : { phase: 'done', setNo: prev.setNo, endsAt: null, paused: null }
  }
  if (prev.phase === 'rest') {
    return { phase: 'work', setNo: prev.setNo + 1, endsAt: nowMs + workSeconds * 1000, paused: null }
  }
  return prev
}

export function pauseTimer(t: TimerState, nowMs: number): TimerState {
  if (t.endsAt === null) return t
  return { ...t, paused: Math.max(0, Math.ceil((t.endsAt - nowMs) / 1000)), endsAt: null }
}

export function resumeTimer(t: TimerState, nowMs: number): TimerState {
  if (t.endsAt !== null || t.phase === 'idle' || t.phase === 'done') return t
  return { ...t, endsAt: nowMs + (t.paused ?? 0) * 1000, paused: null }
}
