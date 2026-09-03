import { describe, expect, it } from 'vitest'
import type { Drill, ProgressState } from '../types'
import { applyCompletion, applyRecord, applyStreak, xpForCompletion } from './progressLogic'

const HOJE = '2026-09-04'
const ONTEM = '2026-09-03'
const ANTEONTEM = '2026-09-02'

const drill = (id: string, xp = 30): Drill => ({
  id,
  order: 1,
  name: id,
  name_en: id,
  skill: '',
  difficulty: 1,
  sets: 3,
  work_seconds: 30,
  rest_seconds: 20,
  xp,
  description: '',
  cue: '',
  steps: [],
  attributes: ['controlo'],
  video: { type: 'pending', url: '' },
})

const base = (over: Partial<ProgressState> = {}): ProgressState => ({
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
  ...over,
})

const done = (progress: ProgressState, d: Drill, opts = {}) =>
  applyCompletion(progress, d, opts, HOJE, ONTEM, ANTEONTEM)

describe('streak (SPEC secção 7 + escudos)', () => {
  const s = (over = {}) => ({ current: 0, best: 0, lastTrainedDate: null, shields: 0, ...over })

  it('primeira vez → 1', () => {
    const r = applyStreak(s(), HOJE, ONTEM, ANTEONTEM)
    expect(r.streak).toEqual({ current: 1, best: 1, lastTrainedDate: HOJE, shields: 0 })
    expect(r.shieldUsed).toBe(false)
  })
  it('já treinou hoje → não mexe', () => {
    const r = applyStreak(s({ current: 3, best: 5, lastTrainedDate: HOJE }), HOJE, ONTEM, ANTEONTEM)
    expect(r.streak.current).toBe(3)
  })
  it('treinou ontem → +1', () => {
    const r = applyStreak(s({ current: 5, best: 5, lastTrainedDate: ONTEM }), HOJE, ONTEM, ANTEONTEM)
    expect(r.streak.current).toBe(6)
    expect(r.streak.best).toBe(6)
  })
  it('falhou 1 dia COM escudo → escudo gasto, streak continua', () => {
    const r = applyStreak(
      s({ current: 9, best: 9, lastTrainedDate: ANTEONTEM, shields: 2 }),
      HOJE,
      ONTEM,
      ANTEONTEM,
    )
    expect(r.streak.current).toBe(10)
    expect(r.streak.shields).toBe(1)
    expect(r.shieldUsed).toBe(true)
  })
  it('falhou 1 dia SEM escudo → volta a 1', () => {
    const r = applyStreak(s({ current: 9, best: 9, lastTrainedDate: ANTEONTEM }), HOJE, ONTEM, ANTEONTEM)
    expect(r.streak.current).toBe(1)
    expect(r.shieldUsed).toBe(false)
  })
  it('falhou 2+ dias → volta a 1 mesmo com escudos', () => {
    const r = applyStreak(
      s({ current: 9, best: 9, lastTrainedDate: '2026-08-20', shields: 2 }),
      HOJE,
      ONTEM,
      ANTEONTEM,
    )
    expect(r.streak.current).toBe(1)
    expect(r.streak.shields).toBe(2) // não gasta à toa
  })
})

describe('XP decrescente no mesmo dia (Iteração F)', () => {
  it('30 → 15 → 5', () => {
    expect(xpForCompletion(drill('x'), 0)).toBe(30)
    expect(xpForCompletion(drill('x'), 1)).toBe(15)
    expect(xpForCompletion(drill('x'), 2)).toBe(5)
    expect(xpForCompletion(drill('x'), 7)).toBe(5)
  })

  it('aplica-se na conclusão e reinicia no dia seguinte', () => {
    let p = base()
    let r = done(p, drill('fb-01'))
    expect(r.xpGained).toBe(30)
    r = done(r.state, drill('fb-01'))
    expect(r.xpGained).toBe(15)
    r = done(r.state, drill('fb-01'))
    expect(r.xpGained).toBe(5)
    expect(r.state.xpTotal).toBe(50)
    // dia seguinte: o daily vira e volta a valer tudo
    const amanha = applyCompletion(r.state, drill('fb-01'), {}, '2026-09-05', HOJE, ONTEM)
    expect(amanha.xpGained).toBe(30)
  })

  it('exercícios diferentes no mesmo dia valem sempre tudo', () => {
    const r1 = done(base(), drill('fb-01'))
    const r2 = done(r1.state, drill('fb-02'))
    expect(r2.xpGained).toBe(30)
  })
})

describe('applyCompletion (essenciais)', () => {
  it('primeira conclusão: XP, contagem, id, streak, dia no calendário', () => {
    const { state } = done(base(), drill('fb-01'))
    expect(state.xpTotal).toBe(30)
    expect(state.completedDrillIds).toEqual(['fb-01'])
    expect(state.completionCounts['fb-01']).toBe(1)
    expect(state.streak.current).toBe(1)
    expect(state.trainingDays).toEqual([HOJE])
  })

  it('o dia só entra 1× no calendário', () => {
    const r1 = done(base(), drill('fb-01'))
    const r2 = done(r1.state, drill('fb-02'))
    expect(r2.state.trainingDays).toEqual([HOJE])
  })

  it('dias de programa e claims continuam atómicos', () => {
    const { state } = done(base({ claimedPrograms: ['weakfoot'] }), drill('fin-07'), {
      dayProgramIds: ['finishing'],
      claimProgramIds: ['finishing', 'weakfoot'],
    })
    expect(state.programTrainingDays.finishing).toEqual([HOJE])
    expect(state.claimedPrograms).toEqual(['weakfoot', 'finishing'])
  })
})

describe('Treino de Hoje: bónus + escudo', () => {
  const SESSION = ['fb-01', 'fb-02']
  const opts = { sessionIds: SESSION, sessionBonusXp: 50 }

  it('completar a sessão dá o bónus E um escudo (máx. 2)', () => {
    const r1 = done(base(), drill('fb-01'), opts)
    expect(r1.sessionBonus).toBe(0)
    expect(r1.shieldEarned).toBe(false)
    const r2 = done(r1.state, drill('fb-02'), opts)
    expect(r2.sessionBonus).toBe(50)
    expect(r2.shieldEarned).toBe(true)
    expect(r2.state.streak.shields).toBe(1)
  })

  it('com 2 escudos não ganha terceiro', () => {
    const p = base({
      daily: { date: HOJE, doneIds: ['fb-01'], bonusClaimed: false, withFriends: false, completions: { 'fb-01': 1 } },
      streak: { current: 1, best: 1, lastTrainedDate: HOJE, shields: 2 },
    })
    const r = done(p, drill('fb-02'), opts)
    expect(r.sessionBonus).toBe(50)
    expect(r.shieldEarned).toBe(false)
    expect(r.state.streak.shields).toBe(2)
  })
})

describe('recordes pessoais', () => {
  it('só grava se bater o melhor anterior', () => {
    const p = base({ records: { 'wf-06': { best: 40, date: ONTEM } } })
    expect(applyRecord(p, 'wf-06', 35, HOJE).newRecord).toBe(false)
    const melhor = applyRecord(p, 'wf-06', 45, HOJE)
    expect(melhor.newRecord).toBe(true)
    expect(melhor.state.records['wf-06']).toEqual({ best: 45, date: HOJE })
  })
})
