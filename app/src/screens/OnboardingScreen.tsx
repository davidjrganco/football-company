import { useRef, useState } from 'react'
import { PlayerForm } from '../components/PlayerForm'
import { readBackup, restoreBackup } from '../lib/backup'
import { useLang } from '../lib/i18n'
import type { PlayerProfile } from '../types'

interface Props {
  onSave: (profile: PlayerProfile) => void
}

/** Primeiro arranque: criar o cartão de jogador (sem contas — fica no telemóvel). */
export function OnboardingScreen({ onSave }: Props) {
  const { lang, setLang, l } = useLang()
  const restoreInput = useRef<HTMLInputElement>(null)
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null)

  async function handleRestore(file: File | undefined) {
    if (!file) return
    try {
      restoreBackup(await readBackup(file))
    } catch (e) {
      setRestoreMsg(
        e instanceof Error ? e.message : l('Não consegui ler esse ficheiro.', "Couldn't read that file."),
      )
    }
  }

  return (
    <div className="screen flex flex-col justify-center">
      {/* idioma logo à entrada — os amigos podem não falar português */}
      <div className="absolute top-4 right-4 flex gap-1 rounded-full border border-line bg-panel p-1">
        {(['pt', 'en'] as const).map((code) => (
          <button
            key={code}
            className={`cursor-pointer rounded-full border-none px-2.5 py-1 text-[11px] font-extrabold uppercase ${
              lang === code ? 'bg-grass text-[#052012]' : 'bg-transparent text-muted'
            }`}
            onClick={() => setLang(code)}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="mb-6 text-center">
        <div className="text-xs font-bold tracking-[.14em] text-grass uppercase">{l('Bem-vindo', 'Welcome')}</div>
        <h1 className="mt-1 font-display text-[30px] leading-[1.1]">
          {l('Cria o teu cartão', 'Create your')}
          <br />
          {l('de jogador', 'player card')}
        </h1>
        <p className="mt-2 text-[13.5px] leading-normal text-muted">
          {l('Começas com 40 em tudo — cada treino faz o teu cartão subir.', 'You start at 40 in everything — every workout raises your card.')}
          <br />
          {l('Fica só no teu telemóvel e podes mudar no Perfil.', 'It stays on your phone only, editable in your Profile.')}
        </p>
      </div>
      <PlayerForm submitLabel={l('CRIAR O MEU CARTÃO', 'CREATE MY CARD')} onSave={onSave} />

      {/* vindo de outro telemóvel? repor a cópia de segurança */}
      <button
        className="mt-5 cursor-pointer border-none bg-transparent text-center text-[13px] font-bold text-muted underline decoration-[rgba(233,245,236,.3)] underline-offset-4"
        onClick={() => restoreInput.current?.click()}
      >
        {l('Já treinavas noutro telemóvel? Repor cópia de segurança', 'Trained on another phone? Restore your backup')}
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
