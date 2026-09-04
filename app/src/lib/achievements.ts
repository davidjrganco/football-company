import type { ProgressState } from '../types'
import { ATTRIBUTE_ORDER, attributeValues, earnedMedals } from './attributes'
import { allDrills, futsalDrills, mainPathDrills, programs } from './drills'

// Conquistas (Iteração G — "sensação Duolingo"): medalhas desbloqueadas por
// marcos, cada uma partilhável como imagem. Puras e derivadas do progresso —
// sem estado novo a guardar (nunca divergem).

export type BadgeIcon =
  | 'flame'
  | 'bolt'
  | 'trophy'
  | 'check'
  | 'shield'
  | 'star'
  | 'ball'
  | 'dumbbell'
  | 'foot'
  | 'target'
  | 'users'
  | 'grid'
  | 'calendar'

export interface Achievement {
  id: string
  title: [string, string] // [pt, en]
  desc: [string, string]
  color: string
  icon: BadgeIcon
  reached: (p: ProgressState) => boolean
  /** para a barra dos bloqueados: valor atual / alvo */
  progress: (p: ProgressState) => { cur: number; target: number }
}

const goal = (cur: number, target: number) => ({ cur: Math.min(cur, target), target })

function attrsAbove(p: ProgressState, floor: number): number {
  const v = attributeValues(p, allDrills, programs)
  return ATTRIBUTE_ORDER.filter((k) => v[k] > floor).length
}

const FUTSAL_IDS = new Set(futsalDrills.map((d) => d.id))

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'primeiro-treino',
    title: ['Primeiro Toque', 'First Touch'],
    desc: ['Fizeste o teu primeiro treino', 'Completed your first workout'],
    color: '#22C55E',
    icon: 'ball',
    reached: (p) => p.drillsDone >= 1,
    progress: (p) => goal(p.drillsDone, 1),
  },
  {
    id: 'streak-3',
    title: ['Em Chama', 'On Fire'],
    desc: ['3 dias de streak', '3-day streak'],
    color: '#FB923C',
    icon: 'flame',
    reached: (p) => p.streak.best >= 3,
    progress: (p) => goal(p.streak.best, 3),
  },
  {
    id: 'streak-7',
    title: ['Uma Semana Cheia', 'Full Week'],
    desc: ['7 dias de streak', '7-day streak'],
    color: '#F97316',
    icon: 'flame',
    reached: (p) => p.streak.best >= 7,
    progress: (p) => goal(p.streak.best, 7),
  },
  {
    id: 'streak-14',
    title: ['Imparável', 'Unstoppable'],
    desc: ['14 dias de streak', '14-day streak'],
    color: '#EA580C',
    icon: 'flame',
    reached: (p) => p.streak.best >= 14,
    progress: (p) => goal(p.streak.best, 14),
  },
  {
    id: 'streak-30',
    title: ['Um Mês de Lume', 'A Month Ablaze'],
    desc: ['30 dias de streak', '30-day streak'],
    color: '#DC2626',
    icon: 'flame',
    reached: (p) => p.streak.best >= 30,
    progress: (p) => goal(p.streak.best, 30),
  },
  {
    id: 'xp-500',
    title: ['500 XP', '500 XP'],
    desc: ['Somaste 500 XP', 'Racked up 500 XP'],
    color: '#A3E635',
    icon: 'bolt',
    reached: (p) => p.xpTotal >= 500,
    progress: (p) => goal(p.xpTotal, 500),
  },
  {
    id: 'xp-1000',
    title: ['1000 XP', '1000 XP'],
    desc: ['Somaste 1000 XP', 'Racked up 1000 XP'],
    color: '#84CC16',
    icon: 'bolt',
    reached: (p) => p.xpTotal >= 1000,
    progress: (p) => goal(p.xpTotal, 1000),
  },
  {
    id: 'xp-2500',
    title: ['Máquina de XP', 'XP Machine'],
    desc: ['Somaste 2500 XP', 'Racked up 2500 XP'],
    color: '#65A30D',
    icon: 'bolt',
    reached: (p) => p.xpTotal >= 2500,
    progress: (p) => goal(p.xpTotal, 2500),
  },
  {
    id: 'caminho-metade',
    title: ['A Meio Caminho', 'Halfway There'],
    desc: ['Metade do caminho concluído', 'Half the path complete'],
    color: '#38BDF8',
    icon: 'check',
    reached: (p) => p.completedDrillIds.filter((id) => mainPathDrills.some((d) => d.id === id)).length >= Math.ceil(mainPathDrills.length / 2),
    progress: (p) => goal(p.completedDrillIds.filter((id) => mainPathDrills.some((d) => d.id === id)).length, Math.ceil(mainPathDrills.length / 2)),
  },
  {
    id: 'caminho-completo',
    title: ['Caminho Dominado', 'Path Mastered'],
    desc: ['Todo o caminho concluído', 'The whole path complete'],
    color: '#0EA5E9',
    icon: 'check',
    reached: (p) => mainPathDrills.every((d) => p.completedDrillIds.includes(d.id)),
    progress: (p) => goal(p.completedDrillIds.filter((id) => mainPathDrills.some((d) => d.id === id)).length, mainPathDrills.length),
  },
  {
    id: 'primeiro-programa',
    title: ['Desafio Vencido', 'Challenge Beaten'],
    desc: ['Completaste um programa', 'Completed a program'],
    color: '#EAB308',
    icon: 'trophy',
    reached: (p) => p.claimedPrograms.length >= 1,
    progress: (p) => goal(p.claimedPrograms.length, 1),
  },
  {
    id: 'todos-programas',
    title: ['Colecionador de Troféus', 'Trophy Collector'],
    desc: ['Completaste todos os programas', 'Completed every program'],
    color: '#CA8A04',
    icon: 'trophy',
    reached: (p) => p.claimedPrograms.length >= programs.length,
    progress: (p) => goal(p.claimedPrograms.length, programs.length),
  },
  {
    id: 'primeiro-recorde',
    title: ['Recordista', 'Record Setter'],
    desc: ['Registaste o teu primeiro recorde', 'Set your first personal record'],
    color: '#F6CE55',
    icon: 'star',
    reached: (p) => Object.keys(p.records).length >= 1,
    progress: (p) => goal(Object.keys(p.records).length, 1),
  },
  {
    id: 'pe-fraco-forte',
    title: ['Dois Pés', 'Two-Footed'],
    desc: ['Ganhaste a medalha de Pé Fraco', 'Earned the Weak Foot medal'],
    color: '#A3E635',
    icon: 'foot',
    reached: (p) => earnedMedals(p, programs).some((m) => m.name.toLowerCase().includes('fraco') || m.name.toLowerCase().includes('weak')),
    progress: (p) => goal(earnedMedals(p, programs).length ? 1 : 0, 1),
  },
  {
    id: 'defensor',
    title: ['Muralha', 'The Wall'],
    desc: ['Treinaste a Defesa com companhia', 'Trained Defending with a partner'],
    color: '#F87171',
    icon: 'shield',
    reached: (p) => p.completedDrillIds.some((id) => id.startsWith('df-')),
    progress: (p) => goal(p.completedDrillIds.some((id) => id.startsWith('df-')) ? 1 : 0, 1),
  },
  {
    id: 'futsalista',
    title: ['Rei do Salão', 'Indoor King'],
    desc: ['Concluíste todo o Futsal', 'Completed all of Futsal'],
    color: '#8AA79A',
    icon: 'grid',
    reached: (p) => [...FUTSAL_IDS].every((id) => p.completedDrillIds.includes(id)),
    progress: (p) => goal([...FUTSAL_IDS].filter((id) => p.completedDrillIds.includes(id)).length, FUTSAL_IDS.size),
  },
  {
    id: 'dedicado',
    title: ['Dedicado', 'Dedicated'],
    desc: ['25 dias de treino no total', '25 total training days'],
    color: '#22C55E',
    icon: 'calendar',
    reached: (p) => p.trainingDays.length >= 25,
    progress: (p) => goal(p.trainingDays.length, 25),
  },
  {
    id: 'jogador-completo',
    title: ['Jogador Completo', 'Complete Player'],
    desc: ['Todos os 9 atributos acima de 45', 'All 9 attributes above 45'],
    color: '#EAB308',
    icon: 'target',
    reached: (p) => attrsAbove(p, 45) === ATTRIBUTE_ORDER.length,
    progress: (p) => goal(attrsAbove(p, 45), ATTRIBUTE_ORDER.length),
  },
]

export function isUnlocked(a: Achievement, p: ProgressState): boolean {
  return a.reached(p)
}

export function unlockedCount(p: ProgressState): number {
  return ACHIEVEMENTS.filter((a) => a.reached(p)).length
}

/** Conquistas que passaram de bloqueadas a desbloqueadas entre dois estados. */
export function newlyUnlocked(before: ProgressState, after: ProgressState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.reached(before) && a.reached(after))
}
