import { useMemo, useState } from 'react'
import { BoltIcon, CheckIcon, ChevronRightIcon, FlameIcon, TrophyIcon } from '../components/icons'
import { categoryOfDrill, categoryOfProgram } from '../lib/categories'
import { XP_PER_OVERALL_POINT } from '../lib/attributes'
import type { AttributeKey, Drill, FeedbackLevel } from '../types'

export interface AttrDelta {
  code: string
  key: AttributeKey
  from: number
  to: number
}

export interface CompletionData {
  drill: Drill
  xpGained: number
  streak: number
  attrDeltas: AttrDelta[]
  overallFrom: number
  overallTo: number
  xpTotalAfter: number
  programRows: { name: string; day: number; days: number; programId: string }[]
  nextDrill: Drill | null
  wasNew: boolean
  sessionBonus: number // XP extra por completar o Treino de Hoje
  sessionProgress: { done: number; total: number } | null
}

interface Props {
  data: CompletionData
  onNext: (drill: Drill) => void
  onClose: () => void
  onFeedback: (level: FeedbackLevel) => void
}

const CONFETTI_COLORS = ['#22C55E', '#A3E635', '#F97316', '#F4FBF6', '#38BDF8', '#EAB308']

/**
 * Ecrã de conclusão (redesign 2026-08): o coração do produto — treinaste na
 * vida real, o teu jogador sobe na app, à frente dos teus olhos.
 */
export function CompletionScreen({ data, onNext, onClose, onFeedback }: Props) {
  const cat = categoryOfDrill(data.drill)
  const [feedbackGiven, setFeedbackGiven] = useState<FeedbackLevel | null>(null)
  const giveFeedback = (level: FeedbackLevel) => {
    if (feedbackGiven) return
    setFeedbackGiven(level)
    onFeedback(level)
  }
  const xpToNext = XP_PER_OVERALL_POINT - (data.xpTotalAfter % XP_PER_OVERALL_POINT)
  const overallPct = Math.round(((data.xpTotalAfter % XP_PER_OVERALL_POINT) / XP_PER_OVERALL_POINT) * 100)

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        animationDuration: `${1.2 + Math.random() * 1.4}s`,
        animationDelay: `${Math.random() * 0.4}s`,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center overflow-y-auto bg-[radial-gradient(120%_60%_at_50%_0%,#16351F_0%,rgba(22,53,31,0)_60%),linear-gradient(180deg,#0C1712_0%,#0A130F_100%)] px-[22px]">
      {confetti.map((c, i) => (
        <div key={i} className="confetti" style={c} />
      ))}

      {/* emblema */}
      <div
        className="cele-box relative mt-11 flex h-[92px] w-[92px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-grass to-grassd"
        style={{ boxShadow: '0 0 46px rgba(34,197,94,.55)' }}
      >
        <div className="absolute -inset-2.5 rounded-full border-2 border-[rgba(34,197,94,.4)]" />
        <CheckIcon size={42} />
      </div>

      <div className="mt-4 text-center font-display text-[32px] tracking-[.03em]">TREINO CONCLUÍDO</div>
      <div className="mt-0.5 text-sm font-bold text-muted">
        {data.drill.name} · {cat.label}
      </div>

      {/* XP + streak */}
      <div className="mt-4 flex gap-2.5">
        <div className="flex items-center gap-2 rounded-[14px] border border-[rgba(163,230,53,.35)] bg-[rgba(163,230,53,.12)] px-4 py-2.5">
          <BoltIcon size={17} />
          <span className="font-display text-[22px] text-lime">+{data.xpGained} XP</span>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] border border-[rgba(251,146,60,.35)] bg-[rgba(251,146,60,.12)] px-4 py-2.5">
          <FlameIcon size={17} />
          <span className="font-display text-[22px] text-flare2">
            {data.streak} {data.streak === 1 ? 'DIA' : 'DIAS'}
          </span>
        </div>
      </div>

      {/* sessão do dia completa → bónus */}
      {data.sessionBonus > 0 && (
        <div className="cele-box mt-3 flex items-center gap-2 rounded-[14px] border border-[rgba(234,179,8,.45)] bg-[rgba(234,179,8,.14)] px-4 py-2.5">
          <TrophyIcon size={17} color="#EAB308" />
          <span className="font-display text-[18px] text-[#F6CE55]">
            TREINO DE HOJE COMPLETO · +{data.sessionBonus} XP
          </span>
        </div>
      )}

      {/* como correu? — semente da dificuldade adaptativa */}
      <div className="mt-4 w-full rounded-[18px] border border-line bg-panel px-[17px] py-[13px]">
        <div className="text-[11px] font-extrabold tracking-[.14em] text-muted uppercase">Como correu?</div>
        <div className="mt-2.5 flex gap-2">
          {(
            [
              ['facil', '😌 Fácil'],
              ['normal', '🙂 Normal'],
              ['dificil', '🔥 Difícil'],
            ] as [FeedbackLevel, string][]
          ).map(([level, label]) => (
            <button
              key={level}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-[13.5px] font-extrabold transition-opacity ${
                feedbackGiven === level
                  ? 'border-grass bg-[rgba(34,197,94,.16)] text-grass'
                  : feedbackGiven
                    ? 'cursor-default border-line bg-panel2 text-muted opacity-40'
                    : 'cursor-pointer border-line bg-panel2 text-chalk'
              }`}
              onClick={() => giveFeedback(level)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* o teu jogador subiu */}
      <div className="mt-4 w-full rounded-[18px] border border-line bg-panel px-[17px] py-[15px] shadow-card">
        <div className="text-[11px] font-extrabold tracking-[.14em] text-grass uppercase">O teu jogador</div>
        <div className="mt-3 flex flex-col gap-2.5">
          {data.attrDeltas.map((a) => (
            <div key={a.key} className="flex items-center gap-2.5">
              <span className="w-11 font-display text-[15px]">{a.code}</span>
              <div className="flex h-2 flex-1 overflow-hidden rounded bg-[rgba(233,245,236,.1)]">
                <div className="h-full" style={{ width: `${a.from}%`, background: cat.color }} />
                {a.to > a.from && (
                  <div
                    className="h-full bg-chalk"
                    style={{ width: `${a.to - a.from}%`, boxShadow: '0 0 8px rgba(244,251,246,.8)' }}
                  />
                )}
              </div>
              <span className="w-14 text-right font-display text-[15px]" style={{ color: a.to > a.from ? cat.color : '#F4FBF6' }}>
                {a.to > a.from ? `${a.from} → ${a.to}` : a.to}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2.5">
            <span className="w-11 font-display text-[15px]">GERAL</span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-[rgba(233,245,236,.1)]">
              <div
                className="h-full rounded bg-gradient-to-r from-grass to-lime"
                style={{ width: `${overallPct}%`, boxShadow: '0 0 8px rgba(163,230,53,.5)' }}
              />
            </div>
            <span className="w-20 text-right text-[11.5px] font-extrabold text-lime">
              {data.overallTo > data.overallFrom ? `${data.overallFrom} → ${data.overallTo}!` : `faltam ${xpToNext} XP`}
            </span>
          </div>
        </div>
      </div>

      {/* desafios que avançaram + desbloqueio */}
      <div className="mt-3 flex w-full flex-col gap-2">
        {data.sessionProgress && data.sessionBonus === 0 && (
          <div className="flex items-center justify-between rounded-[14px] border border-[rgba(234,179,8,.3)] bg-[rgba(234,179,8,.08)] px-[15px] py-[11px]">
            <span className="flex items-center gap-2 text-[13.5px] font-extrabold">
              <TrophyIcon size={15} color="#EAB308" />
              Treino de Hoje
            </span>
            <span className="text-[12.5px] font-extrabold text-[#F6CE55]">
              {data.sessionProgress.done}/{data.sessionProgress.total}
            </span>
          </div>
        )}
        {data.programRows.map((p) => {
          const pcat = categoryOfProgram(p.programId)
          return (
            <div
              key={p.programId}
              className="flex items-center justify-between rounded-[14px] px-[15px] py-[11px]"
              style={{ background: `${pcat.color}14`, border: `1px solid ${pcat.color}40` }}
            >
              <span className="flex items-center gap-2 text-[13.5px] font-extrabold">
                <TrophyIcon size={15} color={pcat.color} />
                {p.name}
              </span>
              <span className="text-[12.5px] font-extrabold" style={{ color: pcat.color }}>
                Dia {p.day}/{p.days} ✓
              </span>
            </div>
          )
        })}
        {data.wasNew && data.nextDrill && (
          <div className="flex items-center justify-between rounded-[14px] border border-[rgba(34,197,94,.25)] bg-[rgba(34,197,94,.08)] px-[15px] py-[11px]">
            <span className="text-[13.5px] font-extrabold">Desbloqueaste</span>
            <span className="text-[12.5px] font-extrabold text-grass">{data.nextDrill.name}</span>
          </div>
        )}
      </div>

      {/* ações */}
      <div className="mt-auto mb-6 flex w-full flex-col gap-3 pt-5">
        {data.nextDrill && (
          <button
            className="btn-raised flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-none bg-gradient-to-br from-grass to-grassd p-4 font-display text-[19px] tracking-[.06em] text-[#052012]"
            style={{ boxShadow: '0 6px 0 #15803D, 0 0 30px rgba(34,197,94,.3)' }}
            onClick={() => onNext(data.nextDrill!)}
          >
            PRÓXIMO TREINO
            <ChevronRightIcon size={18} color="#052012" />
          </button>
        )}
        <button
          className="cursor-pointer border-none bg-transparent text-center text-[13.5px] font-bold text-muted"
          onClick={onClose}
        >
          Voltar ao caminho
        </button>
      </div>
    </div>
  )
}
