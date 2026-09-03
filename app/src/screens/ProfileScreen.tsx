import { useRef, useState } from 'react'
import { PlayerForm } from '../components/PlayerForm'
import { BoltIcon, CheckIcon, FlameIcon, ShareIcon, TrophyIcon } from '../components/icons'
import { downloadBackup, readBackup, restoreBackup } from '../lib/backup'
import { generateShareImage, shareImage } from '../lib/shareCard'
import { drillsById } from '../lib/drills'
import { localizeDrill, useLang } from '../lib/i18n'
import { disableReminder, enableReminder, reminderEnabled } from '../lib/reminder'
import { TrainingCalendar } from '../components/TrainingCalendar'
import { positionLabel } from '../hooks/usePlayer'
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_ORDER,
  XP_PER_OVERALL_POINT,
  attributeValues,
  earnedMedals,
  overallRating,
  titleForRating,
} from '../lib/attributes'
import { allDrills, programs } from '../lib/drills'
import type { PlayerProfile, ProgressState } from '../types'

interface Props {
  progress: ProgressState
  player: PlayerProfile
  onSavePlayer: (profile: PlayerProfile) => void
}

/** Cartão de jogador premium (redesign 2026-08): brilho, círculo tático, grelha 3×3. */
export function ProfileScreen({ progress, player, onSavePlayer }: Props) {
  const { lang, setLang, l } = useLang()
  const [editing, setEditing] = useState(false)
  const [backupMsg, setBackupMsg] = useState<string | null>(null)
  const restoreInput = useRef<HTMLInputElement>(null)
  const values = attributeValues(progress, allDrills, programs)

  async function handleRestore(file: File | undefined) {
    if (!file) return
    try {
      const backup = await readBackup(file)
      const when = backup.exportedAt.slice(0, 10)
      const msg = l(
        `Repor a cópia de ${when}? O progresso atual é substituído.`,
        `Restore the ${when} backup? Your current progress will be replaced.`,
      )
      if (window.confirm(msg)) {
        restoreBackup(backup)
      }
    } catch (e) {
      setBackupMsg(e instanceof Error ? e.message : l('Não consegui ler esse ficheiro.', "Couldn't read that file."))
    }
  }
  const rating = overallRating(progress.xpTotal) // Geral sobe com o XP (decisão do Nicolas)
  const title = titleForRating(rating, lang)
  const medals = earnedMedals(progress, programs)
  const xpToNext = XP_PER_OVERALL_POINT - (progress.xpTotal % XP_PER_OVERALL_POINT)
  const nextPct = Math.round(((progress.xpTotal % XP_PER_OVERALL_POINT) / XP_PER_OVERALL_POINT) * 100)
  const [sharing, setSharing] = useState(false)
  const [reminder, setReminder] = useState(reminderEnabled)
  const [reminderMsg, setReminderMsg] = useState<string | null>(null)
  const recordEntries = Object.entries(progress.records)
    .map(([id, r]) => ({ drill: drillsById.get(id), ...r }))
    .filter((r) => r.drill?.record)

  async function toggleReminder() {
    if (reminder) {
      await disableReminder()
      setReminder(false)
      setReminderMsg(null)
      return
    }
    const status = await enableReminder()
    if (status === 'denied') {
      setReminderMsg(l('Sem permissão de notificações no telemóvel.', 'Notification permission was denied.'))
      return
    }
    if (status === 'unsupported') {
      setReminderMsg(l('Este dispositivo não suporta notificações.', "This device doesn't support notifications."))
      return
    }
    setReminder(true)
    setReminderMsg(
      status === 'scheduled'
        ? l('Lembrete ativo — todos os dias. 🔔', 'Reminder on — every day. 🔔')
        : l(
            'Permissão dada! Nota: o teu telemóvel pode só mostrar o lembrete com a app instalada no ecrã inicial.',
            'Permission granted! Note: your phone may only show reminders when the app is installed to the home screen.',
          ),
    )
  }

  async function handleShareCard() {
    if (sharing) return
    setSharing(true)
    try {
      const blob = await generateShareImage({
        player,
        rating,
        title,
        values,
        streak: progress.streak.current,
        medals,
        lang,
      })
      await shareImage(blob, lang === 'en' ? 'my-player-card.png' : 'o-meu-cartao.png')
    } catch {
      setBackupMsg(l('Não consegui gerar a imagem — tenta outra vez.', "Couldn't generate the image — try again."))
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="screen">
      <div className="mt-1.5 mb-3.5 flex items-center justify-between">
        <h2 className="font-display text-[23px] tracking-[.02em]">{l('O teu cartão', 'Your card')}</h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-full border border-line bg-panel p-1">
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
          <button
            className="cursor-pointer rounded-xl border border-line bg-panel px-3.5 py-2 text-[13px] font-bold text-chalk"
            onClick={() => setEditing(true)}
          >
            {l('Editar', 'Edit')}
          </button>
        </div>
      </div>

      {/* cartão dourado */}
      <div
        className="relative mb-3.5 overflow-hidden rounded-[22px] p-5 text-[#3A2C05]"
        style={{
          background: 'linear-gradient(155deg, #F6CE55 0%, #EAB308 38%, #D97706 100%)',
          boxShadow: '0 18px 40px rgba(0,0,0,.55), 0 0 40px rgba(234,179,8,.18)',
        }}
      >
        {/* brilho diagonal */}
        <div
          className="pointer-events-none absolute -top-[60px] -left-10 h-[420px] w-[220px] rotate-[18deg]"
          style={{ background: 'linear-gradient(115deg, rgba(255,255,255,.32) 0%, rgba(255,255,255,0) 55%)' }}
        />
        {/* círculo tático gravado */}
        <svg width="390" height="180" viewBox="0 0 390 180" className="pointer-events-none absolute -right-10 -bottom-8 opacity-10">
          <circle cx="300" cy="120" r="110" fill="none" stroke="#3A2C05" strokeWidth="2" strokeDasharray="5 9" />
          <circle cx="300" cy="120" r="55" fill="none" stroke="#3A2C05" strokeWidth="2" strokeDasharray="5 9" />
        </svg>

        <div className="relative flex items-start justify-between">
          <div>
            <div className="font-display text-[58px] leading-[.9]">{rating}</div>
            <div className="mt-1 font-display text-[19px]">
              {player.position} · {positionLabel(player.position, lang).toUpperCase()}
            </div>
          </div>
          <div className="max-w-[46%] text-right">
            <div className="inline-block rounded-full bg-[rgba(58,44,5,.85)] px-[11px] py-[5px] font-display text-[13px] tracking-[.1em] text-[#F6CE55] uppercase">
              {title}
            </div>
            {player.objective && (
              <div className="mt-1.5 text-[11.5px] leading-snug font-extrabold opacity-85">
                {l('Obj', 'Goal')}: {player.objective}
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-3.5 mb-3 border-t-[1.5px] border-[rgba(58,44,5,.25)] pt-2.5 font-display text-[24px] tracking-[.08em] uppercase">
          {player.name}
        </div>

        <div className="relative grid grid-cols-3 gap-x-3.5 gap-y-2">
          {ATTRIBUTE_ORDER.map((k) => (
            <div key={k}>
              <div className="flex justify-between text-[12.5px] font-extrabold">
                <span>{ATTRIBUTE_CODES[k]}</span>
                <span>{values[k]}</span>
              </div>
              <div className="mt-[3px] h-[5px] rounded bg-[rgba(58,44,5,.2)]">
                <div className="h-full rounded bg-[#3A2C05]" style={{ width: `${values[k]}%` }} />
              </div>
            </div>
          ))}
        </div>

        {medals.length > 0 && (
          <div className="relative mt-3.5 flex flex-wrap gap-2 border-t-[1.5px] border-[rgba(58,44,5,.25)] pt-2.5">
            {medals.map((m) => (
              <span
                key={`${m.name}-${m.level}`}
                className="flex items-center gap-1.5 rounded-full bg-[rgba(58,44,5,.85)] px-3 py-1.5 text-[12px] font-extrabold text-[#F6CE55]"
              >
                <TrophyIcon size={13} color="#F6CE55" />
                {m.name.toUpperCase()} · {l('NÍVEL', 'LEVEL')} {m.level}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* partilhar o cartão (Modo Amigos fase 1 — escolha do Nicolas) */}
      <button
        className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-none bg-gradient-to-br from-[#F6CE55] to-[#EAB308] p-3.5 font-display text-[16px] tracking-[.05em] text-[#3A2C05]"
        style={{ boxShadow: '0 5px 0 #A16207' }}
        onClick={handleShareCard}
        disabled={sharing}
      >
        <ShareIcon size={17} color="#3A2C05" />
        {sharing ? l('A GERAR…', 'GENERATING…') : l('PARTILHAR O MEU CARTÃO', 'SHARE MY CARD')}
      </button>

      {/* rumo ao próximo geral */}
      <div className="mb-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="tracking-[.1em] text-muted uppercase">
            {l(`Rumo ao Geral ${Math.min(99, rating + 1)}`, `Towards ${Math.min(99, rating + 1)} OVR`)}
          </span>
          <span className="text-lime">{l(`Faltam ${xpToNext} XP`, `${xpToNext} XP to go`)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[rgba(233,245,236,.1)]">
          <div
            className="h-full rounded bg-gradient-to-r from-grass to-lime"
            style={{ width: `${nextPct}%`, boxShadow: '0 0 10px rgba(163,230,53,.5)' }}
          />
        </div>
      </div>

      {/* estatísticas */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <FlameIcon size={22} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-display text-[26px] leading-none text-flare2">{progress.streak.current}</div>
              {progress.streak.shields > 0 && (
                <span className="rounded-full bg-[rgba(56,189,248,.14)] px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#38BDF8]">
                  🛡️×{progress.streak.shields}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-xs font-bold text-muted">{l('Streak atual', 'Current streak')}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <TrophyIcon size={22} color="#F4FBF6" />
          <div>
            <div className="font-display text-[26px] leading-none">{progress.streak.best}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">{l('Melhor streak', 'Best streak')}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <BoltIcon size={22} />
          <div>
            <div className="font-display text-[26px] leading-none text-lime">{progress.xpTotal}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">{l('XP total', 'Total XP')}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
          <CheckIcon size={22} color="#22C55E" />
          <div>
            <div className="font-display text-[26px] leading-none text-grass">{progress.drillsDone}</div>
            <div className="mt-0.5 text-xs font-bold text-muted">{l('Treinos feitos', 'Workouts done')}</div>
          </div>
        </div>
      </div>

      {/* calendário do mês — o "não quebres a corrente" à vista */}
      <TrainingCalendar trainingDays={progress.trainingDays} />

      {/* lembrete diário (melhor esforço, sem servidores) */}
      <div className="mt-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
        <button
          className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent p-0"
          onClick={toggleReminder}
        >
          <span className="text-[13.5px] font-extrabold text-chalk">
            🔔 {l('Lembrete diário de treino', 'Daily training reminder')}
          </span>
          <span
            className="relative h-[22px] w-[40px] flex-none rounded-full transition-colors"
            style={{ background: reminder ? '#22C55E' : 'rgba(233,245,236,.15)' }}
          >
            <span
              className="absolute top-[3px] h-4 w-4 rounded-full bg-chalk transition-all"
              style={{ left: reminder ? '21px' : '3px' }}
            />
          </span>
        </button>
        {reminderMsg && <div className="mt-2 text-[12px] font-bold text-muted">{reminderMsg}</div>}
      </div>

      {/* recordes pessoais (votação do Nicolas) */}
      {recordEntries.length > 0 && (
        <div className="mt-3 rounded-2xl border border-[rgba(234,179,8,.3)] bg-[rgba(234,179,8,.06)] px-[15px] py-[13px]">
          <div className="flex items-center gap-2 text-xs font-extrabold tracking-[.1em] text-[#F6CE55] uppercase">
            <TrophyIcon size={14} color="#F6CE55" />
            {l('Recordes pessoais', 'Personal records')}
          </div>
          <div className="mt-2.5 flex flex-col gap-2">
            {recordEntries.map((r) => {
              const rl = localizeDrill(r.drill!, lang)
              return (
                <div key={r.drill!.id} className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold">{rl.name}</span>
                  <span className="font-display text-[17px] text-[#F6CE55]">
                    {r.best} {rl.recordUnit}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* cópia de segurança — o progresso vive só neste telemóvel */}
      <div className="mt-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
        <div className="text-xs font-extrabold tracking-[.1em] text-muted uppercase">
          {l('Cópia de segurança', 'Backup')}
        </div>
        <p className="mt-1.5 mb-2.5 text-[13px] leading-snug text-muted">
          {l(
            'O teu progresso vive neste telemóvel. Guarda uma cópia de vez em quando — se trocares de telemóvel ou limpares o browser, é assim que a streak sobrevive.',
            'Your progress lives on this phone. Save a backup now and then — if you switch phones or clear the browser, this is how your streak survives.',
          )}
        </p>
        <div className="flex gap-2">
          <button
            className="flex-1 cursor-pointer rounded-xl border-none bg-grass px-3 py-2.5 font-display text-[13px] tracking-[.05em] text-[#052012]"
            style={{ boxShadow: '0 4px 0 #16A34A' }}
            onClick={() => {
              downloadBackup(player, progress)
              setBackupMsg(l('Cópia guardada nos teus ficheiros. 📁', 'Backup saved to your files. 📁'))
            }}
          >
            {l('GUARDAR CÓPIA', 'SAVE BACKUP')}
          </button>
          <button
            className="flex-1 cursor-pointer rounded-xl border border-line bg-panel2 px-3 py-2.5 text-[13px] font-bold text-chalk"
            onClick={() => restoreInput.current?.click()}
          >
            {l('Repor cópia', 'Restore backup')}
          </button>
        </div>
        <input
          ref={restoreInput}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => handleRestore(e.target.files?.[0])}
        />
        {backupMsg && <div className="mt-2 text-[12.5px] font-bold text-lime">{backupMsg}</div>}
      </div>

      <p className="mt-4 text-center text-[12.5px] leading-normal text-muted">
        {l('Cada treino conta para os atributos que trabalha.', 'Every workout counts towards the attributes it trains.')}
        <br />
        {lang === 'en' ? (
          <>
            Train in <b className="text-lime">different ways</b> to raise your whole card.
          </>
        ) : (
          <>
            Treina de <b className="text-lime">formas diferentes</b> para subir o cartão todo.
          </>
        )}
      </p>

      {editing && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(6,12,9,.8)] p-5 backdrop-blur-[3px]">
          <div className="w-full rounded-2xl border border-line bg-pitch p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg">{l('Editar cartão', 'Edit card')}</h3>
              <button
                className="cursor-pointer rounded-lg border border-line bg-panel px-2.5 py-1.5 text-[13px] font-bold text-muted"
                onClick={() => setEditing(false)}
              >
                {l('Fechar', 'Close')}
              </button>
            </div>
            <PlayerForm
              initial={player}
              submitLabel={l('GUARDAR', 'SAVE')}
              onSave={(p) => {
                onSavePlayer(p)
                setEditing(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
