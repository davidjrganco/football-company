import { CheckIcon, TrophyIcon } from '../components/icons'
import { rewardText } from '../lib/attributes'
import { categoryOfProgram } from '../lib/categories'
import { useLang } from '../lib/i18n'
import { programs } from '../lib/drills'
import type { Program, ProgressState } from '../types'

const FOCUS_EN: Record<string, string> = {
  'Ball control': 'Ball control',
  Remate: 'Shooting',
  'Pé fraco': 'Weak foot',
  Velocidade: 'Speed',
}

interface Props {
  progress: ProgressState
  onOpenProgram: (program: Program) => void
}

/** Página dos Programas — cartões com cor por categoria (redesign 2026-08). */
export function ProgramsScreen({ progress, onOpenProgram }: Props) {
  const { lang, l } = useLang()
  return (
    <div className="screen">
      <header className="mb-4">
        <div className="text-[11px] font-bold tracking-[.16em] text-muted uppercase">
          {l('Desafios com recompensa', 'Challenges with rewards')}
        </div>
        <div className="font-display text-[27px] leading-[1.05] tracking-[.01em]">
          {l('Programa Treinos', 'Training Programs')}
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {programs.map((program) => {
          const cat = categoryOfProgram(program.id)
          const done = program.drill_ids.filter((id) => progress.completedDrillIds.includes(id)).length
          const total = program.drill_ids.length
          const trainedDays = (progress.programTrainingDays[program.id] ?? []).length
          const complete = progress.claimedPrograms.includes(program.id)
          const soon = program.status === 'coming_soon'
          const started = done > 0 || trainedDays > 0

          return (
            <div
              key={program.id}
              className={`relative overflow-hidden rounded-[18px] px-4 py-3.5 ${soon ? 'opacity-55' : 'cursor-pointer'}`}
              style={{
                background: `linear-gradient(135deg, ${cat.tintBg}, ${cat.tintBg2})`,
                border: complete ? `1px solid ${cat.color}66` : '1px solid rgba(233,245,236,.14)',
                borderLeft: `4px solid ${cat.color}`,
                boxShadow: complete
                  ? `0 10px 24px rgba(0,0,0,.45), 0 0 26px ${cat.color}26`
                  : '0 10px 24px rgba(0,0,0,.45)',
              }}
              onClick={soon ? undefined : () => onOpenProgram(program)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display text-[19px] leading-tight">{program.name}</div>
                  <div className="mt-[3px] text-xs font-semibold text-muted">
                    {program.days} {l('dias', 'days')} · {program.minutes_per_day} {l('min/dia', 'min/day')} ·{' '}
                    {lang === 'en' ? (FOCUS_EN[program.focus] ?? program.focus) : program.focus}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-extrabold" style={{ color: cat.color }}>
                    <TrophyIcon size={13} color={cat.color} />
                    {complete ? l('Recompensa ganha!', 'Reward earned!') : rewardText(program, lang)}
                  </div>
                </div>
                {soon ? (
                  <span className="rounded-full border border-line px-3 py-1.5 text-[11px] font-bold tracking-[.08em] whitespace-nowrap text-muted uppercase">
                    {l('Em breve', 'Coming soon')}
                  </span>
                ) : complete ? (
                  <span
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 font-display text-sm tracking-[.04em] whitespace-nowrap"
                    style={{ background: `${cat.color}29`, color: cat.color }}
                  >
                    <CheckIcon size={15} color={cat.color} />
                    {l('COMPLETO', 'COMPLETE')}
                  </span>
                ) : (
                  <button
                    className="cursor-pointer rounded-xl border-none px-4 py-[11px] font-display text-sm tracking-[.05em] whitespace-nowrap"
                    style={{ background: cat.color, color: cat.dark, boxShadow: `0 5px 0 ${cat.shadow}` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenProgram(program)
                    }}
                  >
                    {started ? l('CONTINUAR', 'CONTINUE') : 'START'}
                  </button>
                )}
              </div>
              {!soon && (
                <div className="mt-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[rgba(233,245,236,.1)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${total ? Math.round((done / total) * 100) : 0}%`, background: cat.color }}
                      />
                    </div>
                    <span className="w-[76px] text-right text-[11.5px] font-extrabold text-muted">
                      {done}/{total} {l('exerc.', 'drills')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[rgba(233,245,236,.1)]">
                      <div
                        className="h-full rounded-full bg-flare2"
                        style={{ width: `${Math.min(100, Math.round((trainedDays / program.days) * 100))}%` }}
                      />
                    </div>
                    <span className="w-[76px] text-right text-[11.5px] font-extrabold text-muted">
                      {trainedDays}/{program.days} {l('dias', 'days')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-[12.5px] leading-normal text-muted">
        {l(
          'Cada treino no Caminho também conta para estes desafios.',
          'Every drill on your Path also counts towards these challenges.',
        )}
      </p>
    </div>
  )
}
