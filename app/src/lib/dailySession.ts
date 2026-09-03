import { categoryOfDrill, type CategoryKey } from './categories'
import { currentDrillIndex, mainPathDrills } from './drills'
import type { Drill, ProgressState } from '../types'

// "Treino de Hoje" (Iteração D — ideia do David): a app diz o que treinar,
// misturando categorias por dia da semana em vez de esperar 14 dias seguidos
// da mesma coisa. Determinístico: o mesmo dia gera sempre a mesma sessão.

export const SESSION_SIZE = 5
export const SESSION_BONUS_XP = 50

// plano semanal de rotação (getDay(): 0=domingo … 6=sábado)
const WEEK_PLAN: Record<number, Partial<Record<CategoryKey, number>>> = {
  1: { dominio: 3, forca: 2 }, // segunda
  2: { pefraco: 3, velocidade: 2 }, // terça
  3: { finalizacao: 2, dominio: 1, forca: 2 }, // quarta
  4: { velocidade: 3, pefraco: 2 }, // quinta
  5: { dominio: 2, finalizacao: 3 }, // sexta
  6: { forca: 2, velocidade: 2, dominio: 1 }, // sábado
  0: { pefraco: 2, finalizacao: 2, dominio: 1 }, // domingo
}

function dayOfYear(d: Date): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
}

/** Exercícios disponíveis para sessões: os já feitos + o atual do caminho. */
export function sessionPool(progress: ProgressState): Drill[] {
  const cur = currentDrillIndex(mainPathDrills, progress.completedDrillIds)
  return mainPathDrills.filter(
    (d, i) => progress.completedDrillIds.includes(d.id) || i === cur,
  )
}

/**
 * A sessão de hoje: escolhe do pool segundo o plano do dia da semana,
 * rodando as escolhas pelo dia do ano (variedade sem aleatoriedade).
 */
export function buildDailySession(date: Date, progress: ProgressState): Drill[] {
  const pool = sessionPool(progress)
  if (pool.length === 0) return []
  const plan = WEEK_PLAN[date.getDay()] ?? { dominio: 3, forca: 2 }
  const rotation = dayOfYear(date)

  const chosen: Drill[] = []
  const take = (candidates: Drill[], count: number) => {
    const fresh = candidates.filter((d) => !chosen.includes(d))
    if (fresh.length === 0) return
    const start = rotation % fresh.length
    for (let i = 0; i < Math.min(count, fresh.length); i++) {
      chosen.push(fresh[(start + i) % fresh.length])
    }
  }

  for (const [cat, count] of Object.entries(plan)) {
    take(pool.filter((d) => categoryOfDrill(d).key === cat), count ?? 0)
  }
  // pool pequeno ou categorias em falta → completar com o resto do pool
  if (chosen.length < Math.min(SESSION_SIZE, pool.length)) {
    take(pool, Math.min(SESSION_SIZE, pool.length) - chosen.length)
  }
  return chosen.slice(0, SESSION_SIZE)
}

/** Minutos estimados da sessão (séries × (trabalho+descanso)). */
export function sessionMinutes(drills: Drill[]): number {
  const secs = drills.reduce((s, d) => s + d.sets * (d.work_seconds + d.rest_seconds), 0)
  return Math.max(1, Math.round(secs / 60))
}
