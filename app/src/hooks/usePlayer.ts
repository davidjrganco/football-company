import { useCallback, useState } from 'react'
import type { PlayerProfile } from '../types'

const STORAGE_KEY = 'treino-player-v1'

export const POSITIONS: { code: string; label: string }[] = [
  { code: 'GR', label: 'Guarda-Redes' },
  { code: 'DC', label: 'Defesa Central' },
  { code: 'LD', label: 'Lateral Direito' },
  { code: 'LE', label: 'Lateral Esquerdo' },
  { code: 'MDC', label: 'Médio Defensivo' },
  { code: 'MC', label: 'Médio Centro' },
  { code: 'MCO', label: 'Médio Ofensivo' },
  { code: 'EE', label: 'Extremo Esquerdo' },
  { code: 'ED', label: 'Extremo Direito' },
  { code: 'PL', label: 'Ponta de Lança' },
]

export function positionLabel(code: string): string {
  return POSITIONS.find((p) => p.code === code)?.label ?? code
}

function load(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as PlayerProfile
    return p && p.name ? p : null
  } catch {
    return null
  }
}

/** Cartão do jogador — só no dispositivo, sem contas (ADR-0004). */
export function usePlayer() {
  const [player, setPlayer] = useState<PlayerProfile | null>(load)

  const savePlayer = useCallback((profile: PlayerProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // modo privado / sem espaço — segue em memória
    }
    setPlayer(profile)
  }, [])

  return { player, savePlayer }
}
