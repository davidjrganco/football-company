import { PathNode, type NodeState } from '../components/PathNode'
import { BoltIcon, FlameIcon } from '../components/icons'
import { CATEGORIES, categoryOfDrill } from '../lib/categories'
import { currentDrillIndex, mainPathDrills, mainPathLevels } from '../lib/drills'
import type { Drill, PlayerProfile, ProgressState } from '../types'

interface Props {
  progress: ProgressState
  player: PlayerProfile
  onOpenDrill: (drill: Drill) => void
}

/**
 * Ecrã principal (redesign 2026-08): responde logo "o que faço agora?" com o
 * hero PRÓXIMO TREINO, e o caminho misto por níveis com cor por categoria.
 */
export function PathScreen({ progress, player, onOpenDrill }: Props) {
  const cur = currentDrillIndex(mainPathDrills, progress.completedDrillIds)
  const nextDrill = cur < mainPathDrills.length ? mainPathDrills[cur] : null
  const nextCat = nextDrill ? categoryOfDrill(nextDrill) : CATEGORIES.dominio
  const doneCount = mainPathDrills.filter((d) => progress.completedDrillIds.includes(d.id)).length
  const levelIdx = Math.max(
    0,
    mainPathLevels.findIndex((l) => l.drills.some((d) => d.id === nextDrill?.id)),
  )

  let offset = 0

  return (
    <div className="screen relative">
      {/* meia-lua de giz do círculo central */}
      <svg
        width="430"
        height="200"
        viewBox="0 0 430 200"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 opacity-[.16]"
      >
        <circle cx="215" cy="-40" r="170" fill="none" stroke="#F4FBF6" strokeWidth="2" strokeDasharray="4 10" />
        <circle cx="215" cy="-40" r="60" fill="none" stroke="#F4FBF6" strokeWidth="2" strokeDasharray="4 10" />
      </svg>

      {/* topo: avatar, nome, streak, XP */}
      <header className="relative mb-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-grass bg-gradient-to-br from-[#2A4A3A] to-[#1C3328] font-display text-xl text-grass"
            style={{ boxShadow: '0 0 18px rgba(34,197,94,.35)' }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.16em] text-muted uppercase">Vamos treinar</div>
            <div className="font-display text-[26px] leading-none tracking-[.01em]">{player.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-panel px-[11px] py-[7px]">
            <FlameIcon size={16} />
            <span className="font-display text-lg tracking-[.02em] text-flare2">{progress.streak.current}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-panel px-[11px] py-[7px]">
            <BoltIcon size={16} />
            <span className="font-display text-lg tracking-[.02em] text-lime">{progress.xpTotal}</span>
          </div>
        </div>
      </header>

      {/* PRÓXIMO TREINO (hero) */}
      {nextDrill ? (
        <div
          className="relative mb-1.5 cursor-pointer overflow-hidden rounded-[18px] px-4 py-3.5"
          style={{
            background: `linear-gradient(135deg, ${nextCat.tintBg}, ${nextCat.tintBg2})`,
            border: `1px solid ${nextCat.color}66`,
            boxShadow: `0 10px 24px rgba(0,0,0,.45), 0 0 26px ${nextCat.color}1F`,
          }}
          onClick={() => onOpenDrill(nextDrill)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-extrabold tracking-[.16em] uppercase" style={{ color: nextCat.color }}>
                Próximo treino
              </div>
              <div className="mt-[3px] font-display text-[23px] leading-[1.05]">{nextDrill.name}</div>
              <div className="mt-1 text-xs font-bold text-muted">
                {nextCat.label} · {nextDrill.sets} × {nextDrill.work_seconds}s · +{nextDrill.xp} XP
              </div>
            </div>
            <button
              className="cursor-pointer rounded-xl border-none px-5 py-3 font-display text-[15px] tracking-[.06em] whitespace-nowrap"
              style={{ background: nextCat.color, color: nextCat.dark, boxShadow: `0 5px 0 ${nextCat.shadow}` }}
              onClick={(e) => {
                e.stopPropagation()
                onOpenDrill(nextDrill)
              }}
            >
              COMEÇAR
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10.5px] font-extrabold tracking-[.12em] text-muted uppercase">
              Nível {levelIdx + 1}
            </span>
            <div className="flex flex-1 gap-1">
              {mainPathLevels.map((level, i) => {
                const levelDone = level.drills.filter((d) => progress.completedDrillIds.includes(d.id)).length
                const pct = level.drills.length ? Math.round((levelDone / level.drills.length) * 100) : 0
                return (
                  <div key={level.name} className="h-[5px] flex-1 overflow-hidden rounded bg-[rgba(233,245,236,.1)]">
                    <div
                      className="h-full rounded bg-grass"
                      style={{ width: `${pct}%`, boxShadow: i === levelIdx ? '0 0 8px rgba(34,197,94,.5)' : undefined }}
                    />
                  </div>
                )
              })}
            </div>
            <span className="text-[11px] font-extrabold text-lime">
              {doneCount}/{mainPathDrills.length}
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-1.5 rounded-[18px] border border-line bg-panel px-4 py-3.5 text-center font-display text-lg text-lime">
          Caminho completo — és uma máquina!
        </div>
      )}

      {/* trilho por níveis */}
      {mainPathLevels.map((level) => {
        const start = offset
        offset += level.drills.length
        return (
          <div key={level.name}>
            <div className="mt-5 mb-3 flex items-center gap-3">
              <span className="font-display text-sm tracking-[.14em] text-muted">{level.name}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="relative py-1">
              {level.drills.map((d, i) => {
                const globalIndex = start + i
                const state: NodeState = progress.completedDrillIds.includes(d.id)
                  ? 'done'
                  : globalIndex === cur
                    ? 'current'
                    : 'locked'
                return <PathNode key={d.id} drill={d} index={globalIndex} state={state} onOpen={onOpenDrill} />
              })}
            </div>
          </div>
        )
      })}

      {/* legenda de categorias */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        {(['dominio', 'velocidade', 'finalizacao', 'pefraco'] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: CATEGORIES[k].color }} />
            {CATEGORIES[k].label}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[12.5px] leading-normal text-muted">
        Um pouco de tudo, todos os dias — cada treino conta também para os teus Programas.
      </p>
    </div>
  )
}
