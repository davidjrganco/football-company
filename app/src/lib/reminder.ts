// Lembrete diário (Iteração F): melhor esforço, sem servidores.
// Notification permission + Periodic Background Sync onde exista
// (Chromium/Android com a PWA instalada). Preferência em localStorage.

const PREF_KEY = 'treino-reminder-v1'

export function reminderEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) === '1'
  } catch {
    return false
  }
}

export type ReminderStatus = 'scheduled' | 'permission-only' | 'denied' | 'unsupported'

interface PeriodicSyncRegistration extends ServiceWorkerRegistration {
  periodicSync?: {
    register: (tag: string, opts: { minInterval: number }) => Promise<void>
    unregister: (tag: string) => Promise<void>
  }
}

export async function enableReminder(): Promise<ReminderStatus> {
  if (!('Notification' in window)) return 'unsupported'
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return 'denied'
  try {
    localStorage.setItem(PREF_KEY, '1')
  } catch {
    // segue
  }
  try {
    const reg = (await navigator.serviceWorker.ready) as PeriodicSyncRegistration
    if (reg.periodicSync) {
      await reg.periodicSync.register('treino-diario', { minInterval: 20 * 60 * 60 * 1000 })
      return 'scheduled'
    }
  } catch {
    // sem periodic sync — fica só a permissão
  }
  return 'permission-only'
}

export async function disableReminder(): Promise<void> {
  try {
    localStorage.setItem(PREF_KEY, '0')
  } catch {
    // segue
  }
  try {
    const reg = (await navigator.serviceWorker.ready) as PeriodicSyncRegistration
    await reg.periodicSync?.unregister('treino-diario')
  } catch {
    // nada a desligar
  }
}
