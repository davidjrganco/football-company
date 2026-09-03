import type { AttributeKey, Drill, Program, ProgressState } from '../types'

// Regras do cartão (Player Review 2026-08-18, afinadas pelo Nicolas 2026-08-20:
// "não pode evoluir tão rápido; o XP é que sobe o overall").
// De 1 a 99; tudo começa em 40; sobe consoante os treinos feitos.
export const BASE_VALUE = 40
export const MAX_VALUE = 99
export const COMPLETIONS_PER_POINT = 4 // cada 4 treinos de uma competência = +1 no atributo
export const XP_PER_OVERALL_POINT = 120 // cada 120 XP (4 treinos de 30) = +1 no Geral — Tarefa 3b

export const ATTRIBUTE_ORDER: AttributeKey[] = [
  'controlo',
  'dominio',
  'passe',
  'remate',
  'defesa',
  'fisico',
  'resistencia',
  'velocidade',
  'iq',
]

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  controlo: 'Controlo',
  dominio: 'Domínio',
  passe: 'Passe',
  remate: 'Remate',
  defesa: 'Defesa',
  fisico: 'Físico',
  resistencia: 'Resistência',
  velocidade: 'Velocidade',
  iq: 'IQ de jogo',
}

export const ATTRIBUTE_LABELS_EN: Record<AttributeKey, string> = {
  controlo: 'Control',
  dominio: 'Ball Mastery',
  passe: 'Passing',
  remate: 'Shooting',
  defesa: 'Defending',
  fisico: 'Physical',
  resistencia: 'Stamina',
  velocidade: 'Pace',
  iq: 'Game IQ',
}

export function attributeLabel(key: AttributeKey, lang: 'pt' | 'en'): string {
  return lang === 'en' ? ATTRIBUTE_LABELS_EN[key] : ATTRIBUTE_LABELS[key]
}

export const ATTRIBUTE_CODES: Record<AttributeKey, string> = {
  controlo: 'CTL',
  dominio: 'DOM',
  passe: 'PAS',
  remate: 'REM',
  defesa: 'DEF',
  fisico: 'FÍS',
  resistencia: 'RES',
  velocidade: 'VEL',
  iq: 'IQ',
}

/**
 * Valor de cada atributo a partir das contagens de treinos + bónus dos
 * programas completos (derivado, nunca guardado).
 */
export function attributeValues(
  progress: ProgressState,
  allDrills: Drill[],
  programs: Program[] = [],
): Record<AttributeKey, number> {
  const totals = Object.fromEntries(ATTRIBUTE_ORDER.map((k) => [k, 0])) as Record<
    AttributeKey,
    number
  >
  for (const drill of allDrills) {
    const count = progress.completionCounts[drill.id] ?? 0
    if (!count) continue
    for (const attr of drill.attributes) totals[attr] += count
  }
  // bónus de fim de programa (Tarefa 3): pontos inteiros somados ao atributo
  const bonus = Object.fromEntries(ATTRIBUTE_ORDER.map((k) => [k, 0])) as Record<
    AttributeKey,
    number
  >
  for (const program of programs) {
    if (!progress.claimedPrograms.includes(program.id)) continue
    if (program.reward.type !== 'attributes') continue
    for (const [k, pts] of Object.entries(program.reward.points)) {
      bonus[k as AttributeKey] += pts ?? 0
    }
  }
  const values = {} as Record<AttributeKey, number>
  for (const k of ATTRIBUTE_ORDER) {
    values[k] = Math.min(
      MAX_VALUE,
      BASE_VALUE + Math.floor(totals[k] / COMPLETIONS_PER_POINT) + bonus[k],
    )
  }
  return values
}

/** Medalhas ganhas (programas completos com recompensa de medalha). */
export function earnedMedals(
  progress: ProgressState,
  programs: Program[],
): { name: string; level: number }[] {
  return programs
    .filter((p) => progress.claimedPrograms.includes(p.id) && p.reward.type === 'medal')
    .map((p) => p.reward as { type: 'medal'; name: string; level: number })
    .map(({ name, level }) => ({ name, level }))
}

/** Texto da recompensa de um programa, para mostrar na UI. */
export function rewardText(program: Program, lang: 'pt' | 'en' = 'pt'): string {
  if (program.reward.type === 'medal') {
    return lang === 'en'
      ? `"${program.reward.name} — Level ${program.reward.level}" medal`
      : `Medalha "${program.reward.name} — Nível ${program.reward.level}"`
  }
  return Object.entries(program.reward.points)
    .map(([k, pts]) => `+${pts} ${attributeLabel(k as AttributeKey, lang)}`)
    .join(', ')
}

/** Geral sobe com o XP total (decisão do Nicolas): +1 por cada 120 XP. */
export function overallRating(xpTotal: number): number {
  return Math.min(MAX_VALUE, BASE_VALUE + Math.floor(xpTotal / XP_PER_OVERALL_POINT))
}

/** Título do cartão consoante o geral (escada até à "seleção"). */
export function titleForRating(rating: number, lang: 'pt' | 'en' = 'pt'): string {
  if (rating < 45) return lang === 'en' ? 'Prospect' : 'Promessa'
  if (rating < 50) return lang === 'en' ? 'Club Player' : 'Jogador de Clube'
  if (rating < 60) return lang === 'en' ? 'District Player' : 'Jogador Distrital'
  if (rating < 70) return lang === 'en' ? 'National Player' : 'Jogador Nacional'
  if (rating < 85) return lang === 'en' ? 'International' : 'Internacional'
  return lang === 'en' ? 'Legend' : 'Lenda'
}
