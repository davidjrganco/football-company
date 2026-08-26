import { describe, expect, it } from 'vitest'
import {
  IDLE,
  pauseTimer,
  remainingSeconds,
  resumeTimer,
  startTimer,
  tickTimer,
} from './timerLogic'

const SETS = 3
const WORK = 30
const REST = 20

describe('temporizador de séries', () => {
  it('inicia na série 1 com o tempo de trabalho completo', () => {
    const t = startTimer(WORK, 1000)
    expect(t.phase).toBe('work')
    expect(t.setNo).toBe(1)
    expect(remainingSeconds(t, WORK, 1000)).toBe(30)
  })

  it('conta por relógio de parede (imune a ticks perdidos)', () => {
    const t = startTimer(WORK, 0)
    // 12,4 s depois — mesmo sem nenhum tick pelo meio
    expect(remainingSeconds(t, WORK, 12400)).toBe(18)
  })

  it('trabalho → descanso → série seguinte', () => {
    let t = startTimer(WORK, 0)
    t = tickTimer(t, SETS, WORK, REST, WORK * 1000) // fim do trabalho
    expect(t.phase).toBe('rest')
    expect(t.setNo).toBe(1)
    t = tickTimer(t, SETS, WORK, REST, WORK * 1000 + REST * 1000) // fim do descanso
    expect(t.phase).toBe('work')
    expect(t.setNo).toBe(2)
  })

  it('última série → done (sem descanso a seguir)', () => {
    const last = { phase: 'work' as const, setNo: SETS, endsAt: 5000, paused: null }
    const t = tickTimer(last, SETS, WORK, REST, 5000)
    expect(t.phase).toBe('done')
    expect(t.endsAt).toBeNull()
  })

  it('antes do fim da fase, o tick não muda nada', () => {
    const t = startTimer(WORK, 0)
    expect(tickTimer(t, SETS, WORK, REST, 29999)).toBe(t)
  })

  it('pausa congela os segundos e continuar retoma de lá', () => {
    let t = startTimer(WORK, 0)
    t = pauseTimer(t, 10000) // pausado aos 20 s restantes
    expect(t.endsAt).toBeNull()
    expect(t.paused).toBe(20)
    expect(remainingSeconds(t, WORK, 999999)).toBe(20) // o tempo não anda em pausa
    t = resumeTimer(t, 50000)
    expect(t.endsAt).toBe(70000) // 50s + 20s restantes
  })

  it('idle e done ignoram pausa/retoma', () => {
    expect(pauseTimer(IDLE, 0)).toBe(IDLE)
    const done = { phase: 'done' as const, setNo: 3, endsAt: null, paused: null }
    expect(resumeTimer(done, 0)).toBe(done)
  })
})
