import { useEffect, useState } from 'react'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type Phase = 'idle' | 'work' | 'rest' | 'done'

interface TimerState {
  phase: Phase
  setNo: number
  /** fim da fase atual em ms (Date.now()); null quando parado/pausado */
  endsAt: number | null
  /** segundos restantes quando em pausa */
  paused: number | null
}

interface Props {
  sets: number
  workSeconds: number
  restSeconds: number
}

/**
 * Temporizador de séries (Player Review 2026-08-18): trabalho → descanso →
 * série seguinte, automático. Conta por relógio de parede (timestamp de fim),
 * não por ticks — imune ao throttling de setInterval em background/ecrã
 * bloqueado no telemóvel.
 */
export function DrillTimer({ sets, workSeconds, restSeconds }: Props) {
  const [t, setT] = useState<TimerState>({ phase: 'idle', setNo: 1, endsAt: null, paused: null })
  const [, setTick] = useState(0) // só para re-render enquanto conta

  const running = t.endsAt !== null

  const remaining =
    t.phase === 'idle'
      ? workSeconds
      : t.phase === 'done'
        ? 0
        : t.endsAt !== null
          ? Math.max(0, Math.ceil((t.endsAt - Date.now()) / 1000))
          : (t.paused ?? 0)

  useEffect(() => {
    if (t.endsAt === null) return
    const id = window.setInterval(() => {
      const left = t.endsAt! - Date.now()
      if (left > 0) {
        setTick((n) => n + 1)
        return
      }
      // fase terminou — transitar (endsAt novo a partir de agora)
      setT((prev) => {
        if (prev.endsAt === null) return prev
        if (prev.phase === 'work') {
          return prev.setNo < sets
            ? { phase: 'rest', setNo: prev.setNo, endsAt: Date.now() + restSeconds * 1000, paused: null }
            : { phase: 'done', setNo: prev.setNo, endsAt: null, paused: null }
        }
        if (prev.phase === 'rest') {
          return { phase: 'work', setNo: prev.setNo + 1, endsAt: Date.now() + workSeconds * 1000, paused: null }
        }
        return prev
      })
    }, 250)
    return () => window.clearInterval(id)
  }, [t.endsAt, sets, workSeconds, restSeconds])

  const start = () =>
    setT({ phase: 'work', setNo: 1, endsAt: Date.now() + workSeconds * 1000, paused: null })

  const onButton = () => {
    if (t.phase === 'idle' || t.phase === 'done') return start()
    if (running) {
      // pausar: guardar os segundos restantes
      setT((prev) => ({
        ...prev,
        paused: Math.max(0, Math.ceil((prev.endsAt! - Date.now()) / 1000)),
        endsAt: null,
      }))
    } else {
      // continuar de onde ficou
      setT((prev) => ({ ...prev, endsAt: Date.now() + (prev.paused ?? 0) * 1000, paused: null }))
    }
  }

  const phaseLabel =
    t.phase === 'idle'
      ? `${sets} séries × ${workSeconds}s · descanso ${restSeconds}s`
      : t.phase === 'work'
        ? `Série ${t.setNo}/${sets}`
        : t.phase === 'rest'
          ? `Descanso · a seguir série ${t.setNo + 1}/${sets}`
          : 'Séries concluídas! 💪'

  const total = t.phase === 'rest' ? restSeconds : workSeconds
  const offset = t.phase === 'idle' ? 0 : CIRCUMFERENCE * (1 - remaining / total)
  const ringColor = t.phase === 'rest' ? '#F97316' : '#22C55E'

  const buttonLabel =
    t.phase === 'idle' ? 'Iniciar' : t.phase === 'done' ? 'Repetir' : running ? 'Parar' : 'Continuar'

  return (
    <div className="my-2 mb-5 flex flex-col items-center gap-3">
      <div
        className={`text-[13px] font-bold tracking-[.06em] uppercase ${
          t.phase === 'rest' ? 'text-flare2' : t.phase === 'done' ? 'text-lime' : 'text-muted'
        }`}
      >
        {phaseLabel}
      </div>
      <div className="relative h-[180px] w-[180px]">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={RADIUS} stroke="rgba(233,245,236,.12)" strokeWidth="10" fill="none" />
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            stroke={ringColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-[52px] tracking-[.02em]">
          {t.phase === 'done' ? '✓' : remaining}
        </div>
      </div>
      <button
        className="cursor-pointer rounded-xl border border-line bg-panel px-[22px] py-[11px] text-[15px] font-bold text-chalk"
        onClick={onButton}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
