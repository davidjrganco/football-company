import { useMemo, useState } from 'react'
import type { Achievement } from '../lib/achievements'
import { useLang } from '../lib/i18n'
import { Badge } from './Badge'
import { ShareIcon } from './icons'

interface Props {
  achievements: Achievement[]
  onShare: (a: Achievement) => void
  onDone: () => void
}

const CONFETTI_COLORS = ['#22C55E', '#A3E635', '#F97316', '#F4FBF6', '#EAB308', '#38BDF8']

/** Marco desbloqueado (estilo Duolingo): medalha grande, confetti, partilhar. */
export function AchievementCelebration({ achievements, onShare, onDone }: Props) {
  const { lang, l } = useLang()
  const [idx, setIdx] = useState(0)
  const a = achievements[idx]
  const last = idx >= achievements.length - 1

  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        animationDuration: `${1.2 + Math.random() * 1.4}s`,
        animationDelay: `${Math.random() * 0.4}s`,
      })),
    [idx],
  )

  if (!a) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[rgba(6,12,9,.85)] px-8 backdrop-blur-[4px]">
      {confetti.map((c, i) => (
        <div key={i} className="confetti" style={c} />
      ))}
      <div className="cele-box flex flex-col items-center text-center">
        <div className="text-[11px] font-extrabold tracking-[.2em] uppercase" style={{ color: a.color }}>
          {l('Conquista desbloqueada', 'Achievement unlocked')}
        </div>
        <div className="my-5">
          <Badge icon={a.icon} color={a.color} unlocked size={120} />
        </div>
        <div className="font-display text-[34px] leading-[1.05]">{a.title[lang === 'en' ? 1 : 0]}</div>
        <div className="mt-2 text-sm font-bold text-muted">{a.desc[lang === 'en' ? 1 : 0]}</div>
        {achievements.length > 1 && (
          <div className="mt-3 text-[12px] font-bold text-muted">
            {idx + 1} / {achievements.length}
          </div>
        )}
        <button
          className="mt-6 flex items-center gap-2 rounded-2xl border-none px-6 py-3 font-display text-[16px] tracking-[.05em]"
          style={{ background: a.color, color: '#0C1712', boxShadow: `0 5px 0 ${a.color}88` }}
          onClick={() => onShare(a)}
        >
          <ShareIcon size={17} color="#0C1712" />
          {l('PARTILHAR', 'SHARE')}
        </button>
        <button
          className="mt-3 cursor-pointer border-none bg-transparent text-[13.5px] font-bold text-muted"
          onClick={() => (last ? onDone() : setIdx((n) => n + 1))}
        >
          {last ? l('Continuar', 'Continue') : l('Próxima', 'Next')}
        </button>
      </div>
    </div>
  )
}
