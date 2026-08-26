import { useEffect, useRef, useState } from 'react'
import {
  IDLE,
  pauseTimer,
  remainingSeconds,
  resumeTimer,
  startTimer,
  tickTimer,
  type TimerState,
} from '../lib/timerLogic'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// ---- som + vibração (Raio-X 2026-08: os olhos estão na bola, não no ecrã) ----
let audioCtx: AudioContext | null = null

function ensureAudio() {
  try {
    audioCtx ??= new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
  } catch {
    audioCtx = null // sem áudio — a vibração ainda funciona
  }
}

function beep(freq: number, delaySec: number, durSec = 0.14) {
  if (!audioCtx) return
  const t0 = audioCtx.currentTime + delaySec
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec)
  osc.connect(gain).connect(audioCtx.destination)
  osc.start(t0)
  osc.stop(t0 + durSec + 0.05)
}

function vibrate(pattern: number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // sem vibração — segue
  }
}

function signal(kind: 'rest' | 'work' | 'done') {
  if (kind === 'rest') {
    beep(660, 0)
    beep(520, 0.18)
    vibrate([200, 90, 200])
  } else if (kind === 'work') {
    beep(880, 0)
    vibrate([300])
  } else {
    beep(660, 0)
    beep(880, 0.16)
    beep(1100, 0.32, 0.22)
    vibrate([200, 90, 200, 90, 420])
  }
}

interface Props {
  sets: number
  workSeconds: number
  restSeconds: number
}

/**
 * Temporizador de séries: trabalho → descanso → série seguinte, automático.
 * Conta por relógio de parede (imune ao throttling com ecrã bloqueado) e
 * avisa com som + vibração em cada transição. Transições puras em
 * lib/timerLogic (testadas).
 */
export function DrillTimer({ sets, workSeconds, restSeconds }: Props) {
  const [t, setT] = useState<TimerState>(IDLE)
  const [, setTick] = useState(0) // só para re-render enquanto conta
  const prevPhase = useRef(t.phase)

  const running = t.endsAt !== null
  const remaining = remainingSeconds(t, t.phase === 'rest' ? restSeconds : workSeconds, Date.now())

  useEffect(() => {
    if (t.endsAt === null) return
    const id = window.setInterval(() => {
      setT((prev) => tickTimer(prev, sets, workSeconds, restSeconds, Date.now()))
      setTick((n) => n + 1)
    }, 250)
    return () => window.clearInterval(id)
  }, [t.endsAt, sets, workSeconds, restSeconds])

  // som + vibração quando a fase muda (fora do updater — seguro com StrictMode)
  useEffect(() => {
    const prev = prevPhase.current
    prevPhase.current = t.phase
    if (prev === 'work' && t.phase === 'rest') signal('rest')
    else if (prev === 'rest' && t.phase === 'work') signal('work')
    else if (prev === 'work' && t.phase === 'done') signal('done')
  }, [t.phase])

  const onButton = () => {
    ensureAudio() // criar o áudio num gesto do utilizador (regra dos browsers)
    if (t.phase === 'idle' || t.phase === 'done') setT(startTimer(workSeconds, Date.now()))
    else if (running) setT((prev) => pauseTimer(prev, Date.now()))
    else setT((prev) => resumeTimer(prev, Date.now()))
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
            style={{ filter: `drop-shadow(0 0 8px ${ringColor}99)` }}
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
