import { PlayerForm } from '../components/PlayerForm'
import type { PlayerProfile } from '../types'

interface Props {
  onSave: (profile: PlayerProfile) => void
}

/** Primeiro arranque: criar o cartão de jogador (sem contas — fica no telemóvel). */
export function OnboardingScreen({ onSave }: Props) {
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
    </div>
  )
}
