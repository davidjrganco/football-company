import { describe, expect, it } from 'vitest'
import type { ProgressState } from '../types'
import { ACHIEVEMENTS, newlyUnlocked, unlockedCount } from './achievements'
import { mainPathDrills } from './drills'

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

describe('conquistas', () => {
  it('estado inicial: nenhuma desbloqueada', () => {
    expect(unlockedCount(base())).toBe(0)
  })

  it('ids únicos e todas com progresso e alvo positivo', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const a of ACHIEVEMENTS) {
      const pr = a.progress(base())
      expect(pr.target).toBeGreaterThan(0)
    }
  })

  it('primeiro treino, streaks e XP desbloqueiam nos limiares certos', () => {
    expect(ACHIEVEMENTS.find((a) => a.id === 'primeiro-treino')!.reached(base({ drillsDone: 1 }))).toBe(true)
    expect(ACHIEVEMENTS.find((a) => a.id === 'streak-7')!.reached(base({ streak: { current: 2, best: 7, lastTrainedDate: null, shields: 0 } }))).toBe(true)
    expect(ACHIEVEMENTS.find((a) => a.id === 'streak-7')!.reached(base({ streak: { current: 6, best: 6, lastTrainedDate: null, shields: 0 } }))).toBe(false)
    expect(ACHIEVEMENTS.find((a) => a.id === 'xp-1000')!.reached(base({ xpTotal: 1000 }))).toBe(true)
    expect(ACHIEVEMENTS.find((a) => a.id === 'xp-1000')!.reached(base({ xpTotal: 999 }))).toBe(false)
  })

  it('caminho completo exige TODOS os exercícios do caminho', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'caminho-completo')!
    expect(a.reached(base({ completedDrillIds: mainPathDrills.slice(0, 10).map((d) => d.id) }))).toBe(false)
    expect(a.reached(base({ completedDrillIds: mainPathDrills.map((d) => d.id) }))).toBe(true)
  })

  it('newlyUnlocked devolve só as que passaram de bloqueadas a desbloqueadas', () => {
    const antes = base({ xpTotal: 480, drillsDone: 5 })
    const depois = base({ xpTotal: 520, drillsDone: 6 })
    const novas = newlyUnlocked(antes, depois).map((a) => a.id)
    expect(novas).toContain('xp-500')
    expect(novas).not.toContain('primeiro-treino') // já estava desbloqueada antes
  })
})
