import { categoryOfDrill } from '../lib/categories'
import type { Drill } from '../types'
import { CheckIcon, LockIcon, TargetIcon, BootIcon, FootIcon, BallIcon } from './icons'

export type NodeState = 'done' | 'current' | 'locked'

function CategoryIcon({ drill, color, size }: { drill: Drill; color: string; size: number }) {
  const cat = categoryOfDrill(drill)
  if (cat.key === 'velocidade') return <BootIcon size={size} color={color} />
  if (cat.key === 'finalizacao') return <TargetIcon size={size} color={color} />
  if (cat.key === 'pefraco') return <FootIcon size={size} color={color} />
  return <BallIcon size={size} color={color} />
}

interface Props {
  drill: Drill
  index: number
  state: NodeState
  onOpen: (drill: Drill) => void
}

/** Nó do caminho — quadro tático com cor por categoria (redesign 2026-08). */
export function PathNode({ drill, state, onOpen }: Props) {
  const cat = categoryOfDrill(drill)
  const clickable = state !== 'locked'

  return (
    <div
      className={`node ${state} relative z-[2] flex items-center gap-3.5 py-[9px] ${clickable ? 'cursor-pointer' : ''}`}
      onClick={clickable ? () => onOpen(drill) : undefined}
    >
      {state === 'done' ? (
        <div
          className="relative flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(160deg, ${cat.color}, ${cat.shadow})`,
            boxShadow: `0 8px 18px ${cat.color}59`,
          }}
        >
          <CheckIcon size={24} color={cat.dark} />
          <span className="absolute -top-1.5 -right-3 rounded-full border border-line bg-pitch px-1.5 py-px font-display text-[10px] text-lime">
            +{drill.xp}
          </span>
        </div>
      ) : state === 'current' ? (
        <div
          className="node-dot-current relative flex h-[64px] w-[64px] flex-none items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(160deg, ${cat.tintBg}, ${cat.tintBg2})`,
            border: `2.5px solid ${cat.color}`,
            boxShadow: `0 0 22px ${cat.color}66`,
            ['--pulse-color' as string]: cat.color,
          }}
        >
          <CategoryIcon drill={drill} color={cat.color} size={26} />
        </div>
      ) : (
        <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full border-2 border-line bg-panel opacity-50">
          <LockIcon size={20} />
        </div>
      )}

      <div className={`min-w-0 flex-1 ${state === 'locked' ? 'opacity-50' : ''}`}>
        <div className="text-[17px] leading-[1.1] font-bold">{drill.name}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: cat.color, opacity: state === 'locked' ? 0.5 : 1 }} />
          {drill.skill}
        </div>
      </div>

      {state === 'current' && (
        <button
          className="cursor-pointer rounded-xl border-none px-4 py-[11px] font-display text-sm tracking-[.05em]"
          style={{ background: cat.color, color: cat.dark, boxShadow: `0 5px 0 ${cat.shadow}` }}
          onClick={(e) => {
            e.stopPropagation()
            onOpen(drill)
          }}
        >
          COMEÇAR
        </button>
      )}
    </div>
  )
}
