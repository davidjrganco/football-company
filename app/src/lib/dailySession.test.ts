import { describe, expect, it } from 'vitest'
import type { ProgressState } from '../types'
import { SESSION_SIZE, buildDailySession, sessionPool } from './dailySession'
import { categoryOfDrill } from './categories'
import { mainPathDrills } from './drills'

const base = (over: Partial<ProgressState> = {}): ProgressState => ({
  xpTotal: 0,
  drillsDone: 0,
  completedDrillIds: [],
  completionCounts: {},
  claimedPrograms: [],
  programTrainingDays: {},
  daily: { date: '', doneIds: [], bonusClaimed: false },
  feedback: {},
  streak: { current: 0, best: 0, lastTrainedDate: null },
  ...over,
})

const ALL_DONE = base({ completedDrillIds: mainPathDrills.map((d) => d.id) })
const QUARTA = new Date(2026, 8, 2) // 02/09/2026 é uma quarta-feira
const QUINTA = new Date(2026, 8, 3)

describe('Treino de Hoje (gerador)', () => {
  it('é determinístico: o mesmo dia gera sempre a mesma sessão', () => {
    const a = buildDailySession(QUARTA, ALL_DONE).map((d) => d.id)
    const b = buildDailySession(QUARTA, ALL_DONE).map((d) => d.id)
    expect(a).toEqual(b)
    expect(a.length).toBe(SESSION_SIZE)
    expect(new Set(a).size).toBe(SESSION_SIZE) // sem repetidos
  })

  it('dias diferentes geram sessões diferentes (rotação)', () => {
    const a = buildDailySession(QUARTA, ALL_DONE).map((d) => d.id)
    const b = buildDailySession(QUINTA, ALL_DONE).map((d) => d.id)
    expect(a).not.toEqual(b)
  })

  it('segue o plano do dia da semana (quarta: finalização+domínio+força)', () => {
    const cats = buildDailySession(QUARTA, ALL_DONE).map((d) => categoryOfDrill(d).key)
    expect(cats.filter((c) => c === 'finalizacao').length).toBe(2)
    expect(cats.filter((c) => c === 'dominio').length).toBe(1)
    expect(cats.filter((c) => c === 'forca').length).toBe(2)
  })

  it('só usa exercícios desbloqueados (feitos + o atual do caminho)', () => {
    const inicio = base({ completedDrillIds: ['fb-01', 'fb-02'] })
    const pool = sessionPool(inicio)
    expect(pool.map((d) => d.id)).toEqual(['fb-01', 'fb-02', 'st-01']) // st-01 é o atual (3.º do Nível 1)
    const session = buildDailySession(QUARTA, inicio).map((d) => d.id)
    expect(session.length).toBe(3) // pool pequeno → sessão pequena, nunca inventa
    for (const id of session) expect(['fb-01', 'fb-02', 'st-01']).toContain(id)
  })

  it('jogador novo: sessão de 1 exercício (o primeiro do caminho)', () => {
    const session = buildDailySession(QUARTA, base())
    expect(session.map((d) => d.id)).toEqual(['fb-01'])
  })
})
