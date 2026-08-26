import { useRef, useState } from 'react'
import { PlayerForm } from '../components/PlayerForm'
import { readBackup, restoreBackup } from '../lib/backup'
import type { PlayerProfile } from '../types'

interface Props {
  onSave: (profile: PlayerProfile) => void
}

/** Primeiro arranque: criar o cartão de jogador (sem contas — fica no telemóvel). */
export function OnboardingScreen({ onSave }: Props) {
  const restoreInput = useRef<HTMLInputElement>(null)
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null)

  async function handleRestore(file: File | undefined) {
    if (!file) return
    try {
      restoreBackup(await readBackup(file))
    } catch (e) {
      setRestoreMsg(e instanceof Error ? e.message : 'Não consegui ler esse ficheiro.')
    }
  }

  return (
    <div className="screen flex flex-col justify-center">
      <div className="mb-6 text-center">
        <div className="text-xs font-bold tracking-[.14em] text-grass uppercase">Bem-vindo</div>
        <h1 className="mt-1 font-display text-[30px] leading-[1.1]">
          Cria o teu cartão
          <br />
          de jogador
        </h1>
        <p className="mt-2 text-[13.5px] leading-normal text-muted">
          Começas com 40 em tudo — cada treino faz o teu cartão subir.
          <br />
          Fica só no teu telemóvel e podes mudar no Perfil.
        </p>
      </div>
      <PlayerForm submitLabel="CRIAR O MEU CARTÃO" onSave={onSave} />

      {/* vindo de outro telemóvel? repor a cópia de segurança */}
      <button
        className="mt-5 cursor-pointer border-none bg-transparent text-center text-[13px] font-bold text-muted underline decoration-[rgba(233,245,236,.3)] underline-offset-4"
        onClick={() => restoreInput.current?.click()}
      >
        Já treinavas noutro telemóvel? Repor cópia de segurança
      </button>
      <input
        ref={restoreInput}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => handleRestore(e.target.files?.[0])}
      />
      {restoreMsg && <div className="mt-2 text-center text-[12.5px] font-bold text-flare2">{restoreMsg}</div>}
    </div>
  )
}
