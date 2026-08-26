import type { PlayerProfile, ProgressState } from '../types'

// Cópia de segurança do progresso (Raio-X 2026-08: o localStorage é o único
// sítio onde vive a streak — um "limpar dados" apagava meses de treino).
// Sem contas nem servidores: um ficheiro que o próprio jogador guarda (ADR-0004).

export interface BackupFile {
  app: 'treino-nicolas'
  version: 1
  exportedAt: string
  player: PlayerProfile | null
  progress: ProgressState
}

export function makeBackup(player: PlayerProfile | null, progress: ProgressState): BackupFile {
  return {
    app: 'treino-nicolas',
    version: 1,
    exportedAt: new Date().toISOString(),
    player,
    progress,
  }
}

/** Descarrega a cópia como ficheiro .json. */
export function downloadBackup(player: PlayerProfile | null, progress: ProgressState) {
  const data = JSON.stringify(makeBackup(player, progress), null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const today = new Date()
  const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  a.href = url
  a.download = `treino-backup-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Valida e lê uma cópia. Lança com mensagem em PT se o ficheiro não servir. */
export async function readBackup(file: File): Promise<BackupFile> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('Esse ficheiro não é uma cópia válida (não é JSON).')
  }
  const b = parsed as Partial<BackupFile>
  if (b?.app !== 'treino-nicolas' || !b.progress || typeof b.progress.xpTotal !== 'number') {
    throw new Error('Esse ficheiro não é uma cópia de segurança desta app.')
  }
  return b as BackupFile
}

const PROGRESS_KEY = 'treino-progress-v1'
const PLAYER_KEY = 'treino-player-v1'

/** Aplica a cópia e recarrega a app (o load() faz as migrações normais). */
export function restoreBackup(backup: BackupFile) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(backup.progress))
  if (backup.player) localStorage.setItem(PLAYER_KEY, JSON.stringify(backup.player))
  window.location.reload()
}
