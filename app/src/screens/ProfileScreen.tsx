import { useState } from 'react'
import { PlayerForm } from '../components/PlayerForm'
import { BoltIcon, CheckIcon, FlameIcon, TrophyIcon } from '../components/icons'
import { positionLabel } from '../hooks/usePlayer'
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_ORDER,
  XP_PER_OVERALL_POINT,
  attributeValues,
  earnedMedals,
  overallRating,
  titleForRating,
} from '../lib/attributes'
import { allDrills, programs } from '../lib/drills'
import type { PlayerProfile, ProgressState } from '../types'

interface Props {
  progress: ProgressState
  player: PlayerProfile
  onSavePlayer: (profile: PlayerProfile) => void
}

/** Cartão de jogador premium (redesign 2026-08): brilho, círculo tático, grelha 3×3. */
export function ProfileScreen({ progress, player, onSavePlayer }: Props) {
  const [editing, setEditing] = useState(false)
  const values = attributeValues(progress, allDrills, programs)
  const rating = overallRating(progress.xpTotal) // Geral sobe com o XP (decisão do Nicolas)
  const title = titleForRating(rating)
  const medals = earnedMedals(progress, programs)
  const xpToNext = XP_PER_OVERALL_POINT - (progress.xpTotal % XP_PER_OVERALL_POINT)
  const nextPct = Math.round(((progress.xpTotal % XP_PER_OVERALL_POINT) / XP_PER_OVERALL_POINT) * 100)

  return (
    <div className="screen">
      <div className="mt-1.5 mb-3.5 flex items-center justify-between">
        <h2 className="font-display text-[23px] tracking-[.02em]">O teu cartão</h2>
        <button
          className="cursor-pointer rounded-xl border border-line bg-panel px-3.5 py-2 text-[13px] font-bold text-chalk"
          onClick={() => setEditing(true)}
        >
          Editar
        </button>
      </div>

      {/* cartão dourado */}
      <div
        className="relative mb-3.5 overflow-hidden rounded-[22px] p-5 text-[#3A2C05]"
        style={{
          background: 'linear-gradient(155deg, #F6CE55 0%, #EAB308 38%, #D97706 100%)',
          boxShadow: '0 18px 40px rgba(0,0,0,.55), 0 0 40px rgba(234,179,8,.18)',
        }}
      >
        {/* brilho diagonal */}
        <div
          className="pointer-events-none absolute -top-[60px] -left-10 h-[420px] w-[220px] rotate-[18deg]"
          style={{ background: 'linear-gradient(115deg, rgba(255,255,255,.32) 0%, rgba(255,255,255,0) 55%)' }}
        />
        {/* círculo tático gravado */}
        <svg width="390" height="180" viewBox="0 0 390 180" className="pointer-events-none absolute -right-10 -bottom-8 opacity-10">
          <circle cx="300" cy="120" r="110" fill="none" stroke="#3A2C05" strokeWidth="2" strokeDasharray="5 9" />
          <circle cx="300" cy="120" r="55" fill="none" stroke="#3A2C05" strokeWidth="2" strokeDasharray="5 9" />
        </svg>

        <div className="relative flex items-start justify-between">
          <div>
            <div className="font-display text-[58px] leading-[.9]">{rating}</div>
            <div className="mt-1 font-display text-[19px]">
              {player.position} · {positionLabel(player.position).toUpperCase()}
            </div>
          </div>
          <div className="max-w-[46%] text-right">
            <div className="inline-block rounded-full bg-[rgba(58,44,5,.85)] px-[11px] py-[5px] font-display text-[13px] tracking-[.1em] text-[#F6CE55] uppercase">
              {title}
            </div>
            {player.objective && (
              <div className="mt-1.5 text-[11.5px] leading-snug font-extrabold opacity-85">
                Obj: {player.objective}
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-3.5 mb-3 border-t-[1.5px] border-[rgba(58,44,5,.25)] pt-2.5 font-display text-[24px] tracking-[.08em] uppercase">
          {player.name}
        </div>

        <div className="relative grid grid-cols-3 gap-x-3.5 gap-y-2">
          {ATTRIBUTE_ORDER.map((k) => (
            <div key={k}>
              <div className="flex justify-between text-[12.5px] font-extrabold">
                <span>{ATTRIBUTE_CODES[k]}</span>
                <span>{values[k]}</span>
              </div>
              <div className="mt-[3px] h-[5px] rounded bg-[rgba(58,44,5,.2)]">
                <div className="h-full rounded bg-[#3A2C05]" style={{ width: `${values[k]}%` }} />
              </div>
            </div>
          ))}
        </div>

        {medals.length > 0 && (
          <div className="relative mt-3.5 flex flex-wrap gap-2 border-t-[1.5px] border-[rgba(58,44,5,.25)] pt-2.5">
            {medals.map((m) => (
              <span
                key={`${m.name}-${m.level}`}
                className="flex items-center gap-1.5 rounded-full bg-[rgba(58,44,5,.85)] px-3 py-1.5 text-[12px] font-extrabold text-[#F6CE55]"
              >
                <TrophyIcon size={13} color="#F6CE55" />
                {m.name.toUpperCase()} · NÍVEL {m.level}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* rumo ao próximo geral */}
      <div className="mb-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="tracking-[.1em] text-muted uppercase">Rumo ao Geral {Math.min(99, rating + 1)}</span>
          <span className="text-lime">Faltam {xpToNext} XP</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[rgba(233,245,236,.1)]">
          <div
            className="h-full rounded bg-gradient-to-r from-grass to-lime"
            style={{ width: `${nextPct}%`, boxShadow: '0 0 10px rgba(163,230,53,.5)' }}
          />
        </div>
      </div>

      {/* estatísticas */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <FlameIcon size={22} />
          <div>
            <div className="font-display text-[26px] leading-none text-flare2">{progress.streak.current}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">Streak atual</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <TrophyIcon size={22} color="#F4FBF6" />
          <div>
            <div className="font-display text-[26px] leading-none">{progress.streak.best}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">Melhor streak</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <BoltIcon size={22} />
          <div>
            <div className="font-display text-[26px] leading-none text-lime">{progress.xpTotal}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">XP total</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <CheckIcon size={22} color="#22C55E" />
          <div>
            <div className="font-display text-[26px] leading-none text-grass">{progress.drillsDone}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">Treinos feitos</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[12.5px] leading-normal text-muted">
        Cada treino conta para os atributos que trabalha.
        <br />
        Treina de <b className="text-lime">formas diferentes</b> para subir o cartão todo.
      </p>

      {editing && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(6,12,9,.8)] p-5 backdrop-blur-[3px]">
          <div className="w-full rounded-2xl border border-line bg-pitch p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg">Editar cartão</h3>
              <button
                className="cursor-pointer rounded-lg border border-line bg-panel px-2.5 py-1.5 text-[13px] font-bold text-muted"
                onClick={() => setEditing(false)}
              >
                Fechar
              </button>
            </div>
            <PlayerForm
              initial={player}
              submitLabel="GUARDAR"
              onSave={(p) => {
                onSavePlayer(p)
                setEditing(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
