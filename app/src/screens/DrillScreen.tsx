import { useEffect, useRef, useState } from 'react'
import { DrillTimer } from '../components/DrillTimer'
import { BoltIcon, ChevronLeftIcon, PlayIcon, StarIcon, TargetIcon, UsersIcon } from '../components/icons'
import { categoryLabel, categoryOfDrill } from '../lib/categories'
import { localizeDrill, useLang } from '../lib/i18n'
import type { Drill } from '../types'

interface Props {
  drill: Drill
  up: boolean
  onBack: () => void
  onComplete: (drill: Drill) => void
}

export function DrillScreen({ drill, up, onBack, onComplete }: Props) {
  const { lang, l } = useLang()
  const loc = localizeDrill(drill, lang)
  const cat = categoryOfDrill(drill)
  // Nicolas: as séries têm de terminar no relógio. David: e depois o exercício
  // conclui-se SOZINHO — o relógio é o árbitro, não o botão.
  const [seriesDone, setSeriesDone] = useState(false)
  const autoRef = useRef<number | null>(null)

  useEffect(() => {
    if (!seriesDone) return
    autoRef.current = window.setTimeout(() => onComplete(drill), 1600)
    return () => {
      if (autoRef.current) window.clearTimeout(autoRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesDone])

  return (
    <div className={`drill-sheet ${up ? 'up' : ''}`}>
      <div className="flex items-center gap-3 border-b border-line px-[18px] py-4">
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-panel"
          onClick={onBack}
          aria-label={l('Voltar ao caminho', 'Back to path')}
        >
          <ChevronLeftIcon />
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl leading-none">{loc.name}</div>
          <div className="mt-1 flex items-center gap-2 text-[12.5px] text-muted">
            <span>{loc.skill}</span>
            <span className="flex gap-px" title={l(`Dificuldade ${drill.difficulty}/5`, `Difficulty ${drill.difficulty}/5`)}>
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} size={11} filled={i <= drill.difficulty} />
              ))}
            </span>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1.5 text-[10.5px] font-extrabold tracking-[.1em] whitespace-nowrap uppercase"
          style={{ background: `${cat.color}24`, border: `1px solid ${cat.color}59`, color: cat.color }}
        >
          {categoryLabel(cat, lang)}
        </span>
        {drill.needs_people != null && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10.5px] font-extrabold whitespace-nowrap"
            style={{ background: `${cat.color}1F`, border: `1px solid ${cat.color}59`, color: cat.color }}
            title={l(`Precisas de mais ${drill.needs_people} pessoa(s)`, `You need ${drill.needs_people} more player(s)`)}
          >
            <UsersIcon size={12} color={cat.color} />+{drill.needs_people}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-5">
        {/* vídeo: os fundadores vão gravar os próprios clips (Tarefa 3, decisão 4) */}
        {drill.video.type === 'local' && drill.video.url ? (
          <video
            className="mb-5 aspect-[16/10] w-full rounded-2xl border border-line bg-black object-contain"
            src={drill.video.url}
            controls
            playsInline
          />
        ) : drill.video.type === 'youtube' && drill.video.url ? (
          <iframe
            className="mb-5 aspect-[16/10] w-full rounded-2xl border border-line bg-black"
            src={drill.video.url}
            title={`${l('Vídeo', 'Video')}: ${loc.name}`}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative mb-5 flex aspect-[16/10] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#16301F] via-[#0E1F15] to-pitch2 text-muted">
            <svg width="430" height="120" viewBox="0 0 430 120" className="absolute -bottom-8 left-0 opacity-20">
              <ellipse cx="215" cy="110" rx="200" ry="60" fill="none" stroke="#F4FBF6" strokeWidth="2" strokeDasharray="4 10" />
            </svg>
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-grass to-grassd"
              style={{ boxShadow: '0 0 34px rgba(34,197,94,.55)' }}
            >
              <PlayIcon size={26} />
            </div>
            <small className="text-[11.5px] tracking-[.08em] uppercase">
              {l('Vídeo do exercício · em breve', 'Drill video · coming soon')}
            </small>
          </div>
        )}

        {/* plano de séries */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1 rounded-[14px] border border-line bg-panel px-3 py-2.5 text-center">
            <div className="font-display text-[22px] text-grass">{drill.sets}</div>
            <div className="text-[10.5px] font-bold tracking-[.1em] text-muted uppercase">{l('Séries', 'Sets')}</div>
          </div>
          <div className="flex-1 rounded-[14px] border border-line bg-panel px-3 py-2.5 text-center">
            <div className="font-display text-[22px]">{drill.work_seconds}s</div>
            <div className="text-[10.5px] font-bold tracking-[.1em] text-muted uppercase">{l('Trabalho', 'Work')}</div>
          </div>
          <div className="flex-1 rounded-[14px] border border-line bg-panel px-3 py-2.5 text-center">
            <div className="font-display text-[22px] text-flare2">{drill.rest_seconds}s</div>
            <div className="text-[10.5px] font-bold tracking-[.1em] text-muted uppercase">{l('Descanso', 'Rest')}</div>
          </div>
        </div>

        {/* como fazer — passos numerados */}
        <div className="mb-4">
          <b className="mb-2 block text-xs font-extrabold tracking-[.14em] text-muted uppercase">
            {l('Como fazer', 'How to do it')}
          </b>
          <ol className="flex flex-col gap-2">
            {loc.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#D8ECE0]">
                <span className="mt-px flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-panel2 font-display text-[13px] text-grass">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mb-[22px] flex items-start gap-2.5 rounded-[14px] border border-[rgba(163,230,53,.3)] bg-[rgba(163,230,53,.1)] px-[15px] py-[13px]">
          <span className="mt-0.5 text-lime">
            <TargetIcon size={18} color="#A3E635" />
          </span>
          <div>
            <b className="mb-0.5 block text-xs tracking-[.1em] text-lime uppercase">{l('Dica-chave', 'Key cue')}</b>
            <span className="text-[15px]">{loc.cue}</span>
          </div>
        </div>

        <DrillTimer
          key={drill.id}
          sets={drill.sets}
          workSeconds={drill.work_seconds}
          restSeconds={drill.rest_seconds}
          onFinished={() => setSeriesDone(true)}
        />
      </div>

      <div className="border-t border-line px-[18px] pt-3.5 pb-[calc(16px+env(safe-area-inset-bottom))]">
        {seriesDone ? (
          <div
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-grass to-grassd p-4 font-display text-xl tracking-[.06em] text-[#052012]"
            style={{ boxShadow: '0 6px 0 #15803D, 0 0 30px rgba(34,197,94,.3)' }}
          >
            <BoltIcon size={19} color="#052012" />
            {l('Concluído', 'Complete')} · +{drill.xp} XP
          </div>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-panel p-4 text-center text-[13.5px] font-bold text-muted">
            ⏱️{' '}
            {l(
              'O exercício conclui-se sozinho quando o relógio terminar as séries',
              'The drill completes itself when the clock finishes your sets',
            )}
          </div>
        )}
      </div>
    </div>
  )
}
