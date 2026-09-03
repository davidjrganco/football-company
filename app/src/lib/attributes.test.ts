import { describe, expect, it } from 'vitest'
import type { ProgressState } from '../types'
import { attributeValues, overallRating, titleForRating } from './attributes'
import { allDrills, mainPathDrills, programs } from './drills'

const base = (over: Partial<ProgressState> = {}): ProgressState => ({
  xpTotal: 0,
  drillsDone: 0,
  completedDrillIds: [],
  completionCounts: {},
  claimedPrograms: [],
  programTrainingDays: {},
  daily: { date: '', doneIds: [], bonusClaimed: false },
  feedback: {},
  records: {},
  streak: { current: 0, best: 0, lastTrainedDate: null },
  ...over,
})

describe('cartão (regras do Nicolas)', () => {
  it('tudo começa em 40', () => {
    const v = attributeValues(base(), allDrills, programs)
    for (const val of Object.values(v)) expect(val).toBe(40)
    expect(overallRating(0)).toBe(40)
  })

  it('atributo sobe +1 a cada 4 treinos da competência', () => {
    // fb-01 treina controlo+dominio
    const v3 = attributeValues(base({ completionCounts: { 'fb-01': 3 } }), allDrills, programs)
    expect(v3.controlo).toBe(40)
    const v4 = attributeValues(base({ completionCounts: { 'fb-01': 4 } }), allDrills, programs)
    expect(v4.controlo).toBe(41)
    expect(v4.dominio).toBe(41)
  })

  it('Geral sobe +1 a cada 120 XP (4 treinos) e o título acompanha', () => {
    expect(overallRating(119)).toBe(40)
    expect(overallRating(120)).toBe(41)
    expect(overallRating(1200)).toBe(50)
    expect(overallRating(999999)).toBe(99) // cap
    expect(titleForRating(40)).toBe('Promessa')
    expect(titleForRating(50)).toBe('Jogador Distrital')
    expect(titleForRating(65)).toBe('Jogador Nacional')
  })

  it('recompensa de programa soma pontos ao atributo', () => {
    const semClaim = attributeValues(base(), allDrills, programs)
    const comClaim = attributeValues(base({ claimedPrograms: ['finishing'] }), allDrills, programs)
    expect(comClaim.remate).toBe(semClaim.remate + 3)
  })
})

describe('integridade dos dados (drills.json)', () => {
  it('o caminho misto tem 40 exercícios únicos e válidos (v5: +Defesa do Nicolas)', () => {
    expect(mainPathDrills.length).toBe(40)
    expect(new Set(mainPathDrills.map((d) => d.id)).size).toBe(40)
  })

  it('todos os programas referem exercícios existentes', () => {
    const ids = new Set(allDrills.map((d) => d.id))
    for (const p of programs) for (const id of p.drill_ids) expect(ids.has(id)).toBe(true)
  })

  it('TODOS os 9 atributos têm cobertura (a Defesa do Nicolas fechou o círculo)', () => {
    const covered = new Set(allDrills.flatMap((d) => d.attributes))
    for (const attr of ['controlo', 'dominio', 'passe', 'remate', 'defesa', 'fisico', 'resistencia', 'velocidade', 'iq']) {
      expect(covered.has(attr as never)).toBe(true)
    }
    const defesa = allDrills.filter((d) => d.attributes.includes('defesa' as never))
    expect(defesa.map((d) => d.id)).toEqual(['df-01', 'df-02']) // os exercícios dele
    expect(defesa.every((d) => d.needs_people)).toBe(true) // multi-jogador, opcionais
  })
})
