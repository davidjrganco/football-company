import { CategoryIcon } from '../components/PathNode'
import { BoltIcon } from '../components/icons'
import { categoryLabel, categoryOfDrill } from '../lib/categories'
import { localizeDrill, useLang } from '../lib/i18n'
import type { Drill } from '../types'

interface Props {
  drill: Drill
  onAccept: (drill: Drill) => void
  onDismiss: () => void
}

/**
 * Ecrã de "foste desafiado" — abre quando alguém chega por um link
 * nicoappp.netlify.app/?c=<exercício>. O laço viral: imagem chama, link traz.
 */
export function ChallengeReceived({ drill, onAccept, onDismiss }: Props) {
  const { lang, l } = useLang()
  const loc = localizeDrill(drill, lang)
  const cat = categoryOfDrill(drill)

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[rgba(6,12,9,.9)] px-8 text-center backdrop-blur-[4px]">
      <div className="cele-box flex flex-col items-center">
        <div className="text-[42px]">⚽🔥</div>
        <div className="mt-3 text-[11px] font-extrabold tracking-[.2em] text-flare2 uppercase">
          {l('Foste desafiado!', 'You were challenged!')}
        </div>
        <div
          className="my-5 flex h-[96px] w-[96px] items-center justify-center rounded-full"
          style={{ background: `linear-gradient(160deg, ${cat.tintBg}, ${cat.tintBg2})`, border: `2.5px solid ${cat.color}`, boxShadow: `0 0 26px ${cat.color}66` }}
        >
          <CategoryIcon drill={drill} color={cat.color} size={40} />
        </div>
        <div className="font-display text-[30px] leading-[1.05]">{loc.name}</div>
        <div className="mt-1 text-sm font-bold text-muted">
          {categoryLabel(cat, lang)} · {drill.sets} × {drill.work_seconds}s
        </div>
        <div className="mt-2 text-[13.5px] text-muted">
          {l('Consegues fazer isto? Aceita e mostra-lhe!', 'Can you do this? Accept and show them!')}
        </div>
        <button
          className="btn-raised mt-6 flex items-center gap-2 rounded-2xl border-none bg-gradient-to-br from-grass to-grassd px-7 py-3.5 font-display text-[17px] tracking-[.05em] text-[#052012]"
          style={{ boxShadow: '0 5px 0 #15803D' }}
          onClick={() => onAccept(drill)}
        >
          <BoltIcon size={18} color="#052012" />
          {l('ACEITAR DESAFIO', 'ACCEPT CHALLENGE')}
        </button>
        <button
          className="mt-3 cursor-pointer border-none bg-transparent text-[13.5px] font-bold text-muted"
          onClick={onDismiss}
        >
          {l('Ver a app primeiro', 'Explore the app first')}
        </button>
      </div>
    </div>
  )
}
