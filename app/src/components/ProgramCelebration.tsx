import { useEffect, useMemo } from 'react'
import { rewardText } from '../lib/attributes'
import { useLang } from '../lib/i18n'
import type { Program } from '../types'

interface Props {
  program: Program
  onDone: () => void
}

const COLORS = ['#22C55E', '#A3E635', '#F97316', '#F4FBF6', '#EAB308']
const PIECES = 44

/** Celebração especial de programa completo, com a recompensa. */
export function ProgramCelebration({ program, onDone }: Props) {
  const { lang, l } = useLang()
  useEffect(() => {
    const t = window.setTimeout(onDone, 3200)
    return () => window.clearTimeout(t)
  }, [onDone])

  const confetti = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        background: COLORS[i % COLORS.length],
        animationDuration: `${1 + Math.random() * 1.4}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[rgba(6,12,9,.8)] backdrop-blur-[4px]" onClick={onDone}>
      {confetti.map((c, i) => (
        <div key={i} className="confetti" style={c} />
      ))}
      <div className="cele-box px-6 text-center">
        <div className="text-[52px] leading-none">🏆</div>
        <div className="mt-2 font-display text-[38px] leading-none text-lime">
          {l('PROGRAMA COMPLETO', 'PROGRAM COMPLETE')}
        </div>
        <div className="mt-2 font-display text-[20px] text-chalk">{program.name}</div>
        <div className="mt-3 inline-block rounded-full bg-[rgba(163,230,53,.16)] px-4 py-2 text-[14px] font-bold text-lime">
          {l('Ganhaste:', 'You earned:')} {rewardText(program, lang)}
        </div>
        <div className="mt-3 text-[13px] text-muted">
          {l('O teu cartão já subiu. És uma máquina!', 'Your card just went up. You machine!')}
        </div>
      </div>
    </div>
  )
}
