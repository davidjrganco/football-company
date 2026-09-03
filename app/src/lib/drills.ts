import type { Drill, DrillPath, DrillsData, MainPathLevel, Program } from '../types'
import drillsJson from '../data/drills.json'

// Fonte única de exercícios e programas: 02_GAME_DESIGN/drills.json (copiado
// para src/data). Nunca fixar exercícios no código (regra do kickoff).
const data = drillsJson as unknown as DrillsData

export const footballPath: DrillPath = data.paths.find(
  (p) => p.sport === 'futebol' && p.primary,
)!

export const futsalPath: DrillPath | undefined = data.paths.find(
  (p) => p.sport === 'futsal',
)

export const footballDrills: Drill[] = [...footballPath.drills].sort(
  (a, b) => a.order - b.order,
)

/** Todos os exercícios (todos os paths) — para o motor de atributos. */
export const allDrills: Drill[] = data.paths.flatMap((p) => p.drills)

/** Exercícios de futsal, pela ordem (mini-caminho da secção secundária). */
export const futsalDrills: Drill[] = [...(futsalPath?.drills ?? [])].sort(
  (a, b) => a.order - b.order,
)

const drillsById = new Map(allDrills.map((d) => [d.id, d]))

/** Programas de treino multi-dia (Tarefa 3). */
export const programs: Program[] = data.programs ?? []

/** Caminho principal misto por níveis (Tarefa 3b — "como é no Footwork"). */
export const mainPathLevels: { name: string; drills: Drill[] }[] = (
  data.main_path?.levels ?? ([] as MainPathLevel[])
).map((level) => ({
  name: level.name,
  drills: level.drill_ids
    .map((id) => drillsById.get(id))
    .filter((d): d is Drill => d !== undefined),
}))

/** O caminho misto achatado, pela ordem dos níveis (para o desbloqueio sequencial). */
export const mainPathDrills: Drill[] = mainPathLevels.flatMap((l) => l.drills)

/** Programas que incluem um exercício (para contar dias venha o treino de onde vier). */
export function programsContainingDrill(drillId: string): Program[] {
  return programs.filter((p) => p.drill_ids.includes(drillId))
}

/** Exercícios de um programa, pela ordem do próprio programa. */
export function programDrills(program: Program): Drill[] {
  return program.drill_ids
    .map((id) => drillsById.get(id))
    .filter((d): d is Drill => d !== undefined)
}

/** Índice do exercício atual: o primeiro ainda não concluído (desbloqueio sequencial). */
export function currentDrillIndex(drills: Drill[], completedIds: string[]): number {
  const i = drills.findIndex((d) => !completedIds.includes(d.id))
  return i < 0 ? drills.length : i
}

/** Um programa está completo quando todos os seus exercícios foram concluídos. */
export function isProgramComplete(program: Program, completedIds: string[]): boolean {
  return program.drill_ids.every((id) => completedIds.includes(id))
}
