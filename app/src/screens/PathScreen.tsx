import { CategoryIcon, PathNode, type NodeState } from '../components/PathNode'
import { BoltIcon, CheckIcon, FlameIcon, TrophyIcon, UsersIcon } from '../components/icons'
import { CATEGORIES, categoryLabel, categoryOfDrill } from '../lib/categories'
import { localizeDrill, useLang } from '../lib/i18n'
import { SESSION_BONUS_XP, buildDailySession, sessionMinutes } from '../lib/dailySession'
import { localToday } from '../hooks/useProgress'
import { currentSoloDrillIndex, mainPathDrills, mainPathLevels } from '../lib/drills'
import type { Drill, PlayerProfile, ProgressState } from '../types'

interface Props {
  progress: ProgressState
  player: PlayerProfile
  withFriends: boolean
  onToggleFriends: (v: boolean) => void
  onOpenDrill: (drill: Drill) => void
  onOpenSessionDrill: (drill: Drill) => void
}

/**
 * Ecrã principal (redesign 2026-08): responde logo "o que faço agora?" com o
 * hero PRÓXIMO TREINO, e o caminho misto por níveis com cor por categoria.
 */
export function PathScreen({
  progress,
  player,
  withFriends,
  onToggleFriends,
  onOpenDrill,
  onOpenSessionDrill,
}: Props) {
  const { lang, l } = useLang()
  // o "atual" é sempre um exercício a solo — os 👥 nunca bloqueiam (regra do Nicolas)
  const cur = currentSoloDrillIndex(mainPathDrills, progress.completedDrillIds)
  const nextDrill = cur < mainPathDrills.length ? mainPathDrills[cur] : null
  const doneCount = mainPathDrills.filter((d) => progress.completedDrillIds.includes(d.id)).length
  const levelIdx = Math.max(
    0,
    mainPathLevels.findIndex((l) => l.drills.some((d) => d.id === nextDrill?.id)),
  )

  // TREINO DE HOJE — a app diz o que fazer (Iteração D)
  const session = buildDailySession(new Date(), progress, withFriends)
  const doneToday = progress.daily.date === localToday() ? progress.daily.doneIds : []
  const sessionDone = session.filter((d) => doneToday.includes(d.id)).length
  const sessionComplete = session.length > 0 && sessionDone >= session.length
  const nextSessionDrill = session.find((d) => !doneToday.includes(d.id)) ?? null

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
            <div className="text-[11px] font-bold tracking-[.16em] text-muted uppercase">
              {l('Vamos treinar', "Let's train")}
            </div>
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

      {/* TREINO DE HOJE (hero) — a app diz-te o que fazer (Iteração D) */}
      {session.length > 0 && (
        <div
          className="relative mb-2 overflow-hidden rounded-[18px] px-4 py-3.5"
          style={{
            background: 'linear-gradient(135deg, #2E2410, #1C1609)',
            border: '1px solid rgba(234,179,8,.45)',
            boxShadow: '0 10px 24px rgba(0,0,0,.45), 0 0 26px rgba(234,179,8,.12)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[.16em] text-[#F6CE55] uppercase">
                <TrophyIcon size={13} color="#F6CE55" />
                {l('Treino de Hoje', "Today's Training")}
              </div>
              <div className="mt-[3px] font-display text-[21px] leading-[1.05]">
                {sessionComplete
                  ? l('Sessão completa!', 'Session complete!')
                  : l(
                      `${session.length} exercícios · ~${sessionMinutes(session)} min`,
                      `${session.length} drills · ~${sessionMinutes(session)} min`,
                    )}
              </div>
            </div>
            {sessionComplete ? (
              <span className="flex items-center gap-1.5 rounded-xl bg-[rgba(234,179,8,.18)] px-3.5 py-2.5 font-display text-sm whitespace-nowrap text-[#F6CE55]">
                <CheckIcon size={15} color="#F6CE55" />+{SESSION_BONUS_XP} XP
              </span>
            ) : (
              <button
                className="cursor-pointer rounded-xl border-none bg-[#EAB308] px-5 py-3 font-display text-[15px] tracking-[.06em] whitespace-nowrap text-[#2E2410]"
                style={{ boxShadow: '0 5px 0 #A16207' }}
                onClick={() => nextSessionDrill && onOpenSessionDrill(nextSessionDrill)}
              >
                {sessionDone > 0 ? l('CONTINUAR', 'CONTINUE') : l('COMEÇAR', 'START')}
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            {session.map((d) => {
              const done = doneToday.includes(d.id)
              const cat = categoryOfDrill(d)
              const isNext = d === nextSessionDrill
              return (
                <div
                  key={d.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 ${done ? 'opacity-60' : ''}`}
                  style={{
                    background: isNext ? `${cat.color}14` : 'rgba(233,245,236,.05)',
                    border: isNext ? `1px solid ${cat.color}59` : '1px solid transparent',
                  }}
                  onClick={() => onOpenSessionDrill(d)}
                >
                  <CategoryIcon drill={d} color={cat.color} size={16} />
                  <span className={`flex-1 text-[13.5px] font-bold ${done ? 'line-through' : ''}`}>
                    {localizeDrill(d, lang).name}
                  </span>
                  {done ? (
                    <CheckIcon size={14} color="#22C55E" />
                  ) : (
                    <span className="text-[11px] font-extrabold text-muted">
                      {d.sets}×{d.work_seconds}s
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-2.5 h-[6px] overflow-hidden rounded-full bg-[rgba(233,245,236,.1)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#EAB308] to-[#F6CE55]"
              style={{ width: `${Math.round((sessionDone / session.length) * 100)}%` }}
            />
          </div>

          {/* toggle "hoje treino acompanhado" — inclui os exercícios 👥 do Nicolas */}
          <button
            className="mt-2.5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-line bg-[rgba(233,245,236,.05)] px-3 py-2.5"
            onClick={() => onToggleFriends(!withFriends)}
          >
            <span className="flex items-center gap-2 text-[12.5px] font-extrabold text-chalk">
              <UsersIcon size={15} color={withFriends ? '#F6CE55' : '#8AA79A'} />
              {l('Hoje treino acompanhado', "Training with others today")}
            </span>
            <span
              className="relative h-[22px] w-[40px] rounded-full transition-colors"
              style={{ background: withFriends ? '#EAB308' : 'rgba(233,245,236,.15)' }}
            >
              <span
                className="absolute top-[3px] h-4 w-4 rounded-full bg-chalk transition-all"
                style={{ left: withFriends ? '21px' : '3px' }}
              />
            </span>
          </button>
        </div>
      )}

      {/* progresso do caminho */}
      <div className="mb-1.5 rounded-2xl border border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-extrabold tracking-[.12em] text-muted uppercase">
            {nextDrill ? l(`Nível ${levelIdx + 1}`, `Level ${levelIdx + 1}`) : l('Caminho completo', 'Path complete')}
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

      {/* trilho por níveis */}
      {mainPathLevels.map((level) => {
        const start = offset
        offset += level.drills.length
        return (
          <div key={level.name}>
            <div className="mt-5 mb-3 flex items-center gap-3">
              <span className="font-display text-sm tracking-[.14em] text-muted">
                {lang === 'en' ? level.name.replace('NÍVEL', 'LEVEL') : level.name}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="relative py-1">
              {level.drills.map((d, i) => {
                const globalIndex = start + i
                const state: NodeState = progress.completedDrillIds.includes(d.id)
                  ? 'done'
                  : d.needs_people != null
                    ? 'open' // 👥 sempre desbloqueado, nunca bloqueia (regra do Nicolas)
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
        {(['dominio', 'velocidade', 'finalizacao', 'pefraco', 'forca', 'defesa'] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: CATEGORIES[k].color }} />
            {categoryLabel(CATEGORIES[k], lang)}
          </span>
        ))}
      </div>
      <p className="mt-2 text-center text-[12.5px] leading-normal text-muted">
        {l(
          'Um pouco de tudo, todos os dias — cada treino conta também para os teus Programas.',
          'A bit of everything, every day — each drill also counts towards your Programs.',
        )}
      </p>
    </div>
  )
}
