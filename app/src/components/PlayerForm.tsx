import { useState } from 'react'
import { POSITIONS } from '../hooks/usePlayer'
import type { PlayerProfile } from '../types'

interface Props {
  initial?: PlayerProfile | null
  submitLabel: string
  onSave: (profile: PlayerProfile) => void
}

/** Formulário do cartão (onboarding + editar no Perfil). Guardado só no dispositivo. */
export function PlayerForm({ initial, submitLabel, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [position, setPosition] = useState(initial?.position ?? 'EE')
  const [objective, setObjective] = useState(initial?.objective ?? '')

  const canSave = name.trim().length > 0

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSave) return
        onSave({ name: name.trim(), position, objective: objective.trim() })
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold tracking-[.1em] text-muted uppercase">O teu nome</span>
        <input
          className="rounded-xl border border-line bg-panel px-3.5 py-3 text-[16px] font-semibold text-chalk outline-none focus:border-grass"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Nicolas"
          maxLength={20}
          autoFocus
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold tracking-[.1em] text-muted uppercase">Posição</span>
        <select
          className="appearance-none rounded-xl border border-line bg-panel px-3.5 py-3 text-[16px] font-semibold text-chalk outline-none focus:border-grass"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          {POSITIONS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.code} · {p.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold tracking-[.1em] text-muted uppercase">O teu objetivo</span>
        <input
          className="rounded-xl border border-line bg-panel px-3.5 py-3 text-[16px] font-semibold text-chalk outline-none focus:border-grass"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Ex.: chegar à seleção distrital"
          maxLength={40}
        />
      </label>

      <button
        type="submit"
        disabled={!canSave}
        className={`btn-raised mt-2 w-full rounded-2xl border-none bg-grass p-4 font-display text-lg tracking-[.06em] text-[#052012] ${
          canSave ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
      >
        {submitLabel}
      </button>
    </form>
  )
}
