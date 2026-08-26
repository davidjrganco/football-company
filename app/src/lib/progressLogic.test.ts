import { describe, expect, it } from 'vitest'
import type { Drill, ProgressState } from '../types'
import { applyCompletion, applyStreak } from './progressLogic'

const HOJE = '2026-08-25'
const ONTEM = '2026-08-24'

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
  streak: { current: 0, best: 0, lastTrainedDate: null },
  ...over,
})

describe('streak (SPEC secção 7)', () => {
  it('primeira vez → 1', () => {
    const s = applyStreak({ current: 0, best: 0, lastTrainedDate: null }, HOJE, ONTEM)
    expect(s).toEqual({ current: 1, best: 1, lastTrainedDate: HOJE })
  })
  it('já treinou hoje → não mexe', () => {
    const s = applyStreak({ current: 3, best: 5, lastTrainedDate: HOJE }, HOJE, ONTEM)
    expect(s.current).toBe(3)
    expect(s.best).toBe(5)
  })
  it('treinou ontem → +1 e atualiza best', () => {
    const s = applyStreak({ current: 5, best: 5, lastTrainedDate: ONTEM }, HOJE, ONTEM)
    expect(s.current).toBe(6)
    expect(s.best).toBe(6)
  })
  it('falhou ≥1 dia → volta a 1, best fica', () => {
    const s = applyStreak({ current: 9, best: 9, lastTrainedDate: '2026-08-20' }, HOJE, ONTEM)
    expect(s.current).toBe(1)
    expect(s.best).toBe(9)
  })
})

describe('applyCompletion', () => {
  it('primeira conclusão: XP, contagem, id, streak', () => {
    const next = applyCompletion(base(), drill('fb-01'), {}, HOJE, ONTEM)
    expect(next.xpTotal).toBe(30)
    expect(next.drillsDone).toBe(1)
    expect(next.completedDrillIds).toEqual(['fb-01'])
    expect(next.completionCounts['fb-01']).toBe(1)
    expect(next.streak.current).toBe(1)
  })

  it('repetição: volta a dar XP e conta, sem duplicar o id', () => {
    const p = base({ xpTotal: 30, drillsDone: 1, completedDrillIds: ['fb-01'], completionCounts: { 'fb-01': 1 } })
    const next = applyCompletion(p, drill('fb-01'), {}, HOJE, ONTEM)
    expect(next.xpTotal).toBe(60)
    expect(next.completedDrillIds).toEqual(['fb-01'])
    expect(next.completionCounts['fb-01']).toBe(2)
  })

  it('regista o dia de treino do programa no máximo 1× por dia', () => {
    const p = base({ programTrainingDays: { finishing: [ONTEM] } })
    const uma = applyCompletion(p, drill('fin-01'), { dayProgramIds: ['finishing'] }, HOJE, ONTEM)
    expect(uma.programTrainingDays.finishing).toEqual([ONTEM, HOJE])
    const duas = applyCompletion(uma, drill('fin-02'), { dayProgramIds: ['finishing'] }, HOJE, ONTEM)
    expect(duas.programTrainingDays.finishing).toEqual([ONTEM, HOJE]) // não duplica
  })

  it('entrega recompensas atomicamente e nunca duplica claims', () => {
    const p = base({ claimedPrograms: ['weakfoot'] })
    const next = applyCompletion(
      p,
      drill('fin-07'),
      { claimProgramIds: ['finishing', 'weakfoot'] },
      HOJE,
      ONTEM,
    )
    expect(next.claimedPrograms).toEqual(['weakfoot', 'finishing'])
  })

  it('conclusão + dia + claim numa só passagem preserva tudo (regressão do bug da Iteração B)', () => {
    const p = base({
      xpTotal: 300,
      completedDrillIds: ['wf-01', 'wf-02', 'wf-03', 'wf-04', 'wf-05'],
      completionCounts: { 'wf-01': 1, 'wf-02': 1, 'wf-03': 1, 'wf-04': 1, 'wf-05': 1 },
    })
    const next = applyCompletion(
      p,
      drill('wf-06'),
      { dayProgramIds: ['weakfoot'], claimProgramIds: ['weakfoot'] },
      HOJE,
      ONTEM,
    )
    expect(next.completedDrillIds).toContain('wf-06') // o bug antigo perdia isto
    expect(next.xpTotal).toBe(330)
    expect(next.claimedPrograms).toEqual(['weakfoot'])
    expect(next.programTrainingDays.weakfoot).toEqual([HOJE])
  })
})
