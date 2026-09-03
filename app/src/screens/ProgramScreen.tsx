import { PathNode, type NodeState } from '../components/PathNode'
import { ChevronLeftIcon, TrophyIcon } from '../components/icons'
import { rewardText } from '../lib/attributes'
import { categoryOfProgram } from '../lib/categories'
import { useLang } from '../lib/i18n'
import { currentDrillIndex, programDrills } from '../lib/drills'
import type { Drill, Program, ProgressState } from '../types'

interface Props {
  program: Program
  progress: ProgressState
  onBack: () => void
  onOpenDrill: (drill: Drill) => void
}

/** Caminho de um programa: os exercícios dele no quadro tático, desbloqueio sequencial. */
export function ProgramScreen({ program, progress, onBack, onOpenDrill }: Props) {
  const { lang, l } = useLang()
  const cat = categoryOfProgram(program.id)
  const drills = programDrills(program)
  const cur = currentDrillIndex(drills, progress.completedDrillIds)
  const done = drills.filter((d) => progress.completedDrillIds.includes(d.id)).length
  const trainedDays = (progress.programTrainingDays[program.id] ?? []).length
  const complete = progress.claimedPrograms.includes(program.id)
  const tasksAllDone = done === drills.length

  return (
    <div className="screen">
      <header className="mb-4 flex items-center gap-3">
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-panel"
          onClick={onBack}
          aria-label={l('Voltar aos programas', 'Back to programs')}
        >
          <ChevronLeftIcon />
        </button>
        <div>
          <div className="text-xs font-bold tracking-[.14em] text-muted uppercase">{l('Programa', 'Program')}</div>
          <div className="font-display text-[22px] leading-none tracking-[.01em]">{program.name}</div>
        </div>
      </header>

      <div
        className="mb-[22px] flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
        style={{
          background: `linear-gradient(135deg, ${cat.tintBg}, ${cat.tintBg2})`,
          border: '1px solid rgba(233,245,236,.14)',
          borderLeft: `4px solid ${cat.color}`,
          boxShadow: '0 10px 24px rgba(0,0,0,.45)',
        }}
      >
        <div className="min-w-0">
          <div className="text-xs font-bold tracking-[.14em] uppercase" style={{ color: cat.color }}>
            {l('Dia', 'Day')} {Math.min(trainedDays + (complete ? 0 : 1), program.days)}/{program.days} ·{' '}
            {program.minutes_per_day} {l('min/dia', 'min/day')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-lime">
            <TrophyIcon size={14} color="#A3E635" />
            {complete
              ? l('Recompensa ganha!', 'Reward earned!')
              : tasksAllDone
                ? l(
                    `${rewardText(program, lang)} aos ${program.days} dias de treino — continua!`,
                    `${rewardText(program, lang)} at ${program.days} training days — keep going!`,
                  )
                : rewardText(program, lang)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="rounded-full bg-[rgba(163,230,53,.14)] px-2.5 py-1.5 text-[13px] font-bold whitespace-nowrap text-lime">
            {done}/{drills.length}
          </div>
          <div className="rounded-full bg-[rgba(251,146,60,.14)] px-2.5 py-1.5 text-[12px] font-bold whitespace-nowrap text-flare2">
            {trainedDays}/{program.days} {l('dias', 'days')}
          </div>
        </div>
      </div>

      <div className="relative py-1">
        {drills.map((d, i) => {
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
