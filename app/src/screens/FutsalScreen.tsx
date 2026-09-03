import { PathNode, type NodeState } from '../components/PathNode'
import { currentDrillIndex, futsalDrills } from '../lib/drills'
import type { Drill, ProgressState } from '../types'

interface Props {
  progress: ProgressState
  onOpenDrill: (drill: Drill) => void
}

/**
 * Futsal (Iteração D — prioridade do Nicolas na Grande Análise: "melhoria no
 * futsal, mais exercícios"): mini-caminho jogável com 8 exercícios e
 * desbloqueio sequencial. Continua secção secundária e discreta (ADR-0002).
 */
export function FutsalScreen({ progress, onOpenDrill }: Props) {
  const cur = currentDrillIndex(futsalDrills, progress.completedDrillIds)
  const done = futsalDrills.filter((d) => progress.completedDrillIds.includes(d.id)).length

  return (
    <div className="screen">
      <header className="mb-1 flex items-center justify-between">
        <div>
          <h2 className="font-display text-[23px] tracking-[.02em]">Futsal</h2>
          <span className="mt-1 inline-block rounded-full border border-line px-2.5 py-1 text-[10.5px] font-bold tracking-[.12em] text-muted uppercase">
            Secção secundária
          </span>
        </div>
        <div className="rounded-full bg-[rgba(138,167,154,.14)] px-2.5 py-1.5 text-[13px] font-bold text-muted">
          {done}/{futsalDrills.length}
        </div>
      </header>
      <p className="mb-3 text-[13px] leading-normal text-muted">
        Uns extras de salão, para variar — sola, bico e passes de primeira. O foco do teu treino é o
        futebol, mas isto também conta para o cartão.
      </p>

      <div className="relative py-1">
        {futsalDrills.map((d, i) => {
          const state: NodeState = progress.completedDrillIds.includes(d.id)
            ? 'done'
            : i === cur
              ? 'current'
              : 'locked'
          return <PathNode key={d.id} drill={d} index={i} state={state} onOpen={onOpenDrill} />
        })}
      </div>
    </div>
  )
}
