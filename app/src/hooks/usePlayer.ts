import { useCallback, useState } from 'react'
import type { PlayerProfile } from '../types'

const STORAGE_KEY = 'treino-player-v1'

export const POSITIONS: { code: string; label: string; labelEn: string }[] = [
  { code: 'GR', label: 'Guarda-Redes', labelEn: 'Goalkeeper' },
  { code: 'DC', label: 'Defesa Central', labelEn: 'Centre-Back' },
  { code: 'LD', label: 'Lateral Direito', labelEn: 'Right-Back' },
  { code: 'LE', label: 'Lateral Esquerdo', labelEn: 'Left-Back' },
  { code: 'MDC', label: 'Médio Defensivo', labelEn: 'Defensive Mid' },
  { code: 'MC', label: 'Médio Centro', labelEn: 'Centre Mid' },
  { code: 'MCO', label: 'Médio Ofensivo', labelEn: 'Attacking Mid' },
  { code: 'EE', label: 'Extremo Esquerdo', labelEn: 'Left Winger' },
  { code: 'ED', label: 'Extremo Direito', labelEn: 'Right Winger' },
  { code: 'PL', label: 'Ponta de Lança', labelEn: 'Striker' },
]

export function positionLabel(code: string, lang: 'pt' | 'en' = 'pt'): string {
  const p = POSITIONS.find((pos) => pos.code === code)
  if (!p) return code
  return lang === 'en' ? p.labelEn : p.label
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
