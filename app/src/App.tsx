import { useCallback, useRef, useState } from 'react'
import { BottomNav, type View } from './components/BottomNav'
import { ProgramCelebration } from './components/ProgramCelebration'
import { usePlayer } from './hooks/usePlayer'
import { localToday, useProgress } from './hooks/useProgress'
import {
  ATTRIBUTE_CODES,
  attributeValues,
  earnedMedals,
  overallRating,
  titleForRating,
} from './lib/attributes'
import { SESSION_BONUS_XP, buildDailySession } from './lib/dailySession'
import { localizeDrill, useLang } from './lib/i18n'
import { generateShareImage, shareImage } from './lib/shareCard'
import {
  allDrills,
  currentDrillIndex,
  currentSoloDrillIndex,
  futsalDrills,
  isProgramComplete,
  mainPathDrills,
  programDrills,
  programs,
  programsContainingDrill,
} from './lib/drills'
import { CompletionScreen, type CompletionData } from './screens/CompletionScreen'
import { DrillScreen } from './screens/DrillScreen'
import { FutsalScreen } from './screens/FutsalScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { PathScreen } from './screens/PathScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProgramScreen } from './screens/ProgramScreen'
import { ProgramsScreen } from './screens/ProgramsScreen'
import type { Drill, Program } from './types'

const SHEET_MS = 280

// de onde veio o exercício aberto — decide o "próximo" no auto-avanço
type DrillOrigin = { kind: 'main' } | { kind: 'session' } | { kind: 'futsal' } | { kind: 'program'; program: Program }

export default function App() {
  const { lang } = useLang()
  const { progress, completeDrill, recordFeedback, saveRecord, setWithFriends } = useProgress()
  const { player, savePlayer } = usePlayer()
  const withFriends =
    progress.daily.date === localToday() ? (progress.daily.withFriends ?? false) : false
  const [view, setView] = useState<View>('path')
  const [activeProgram, setActiveProgram] = useState<Program | null>(null)
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null)
  const [drillOrigin, setDrillOrigin] = useState<DrillOrigin>({ kind: 'main' })
  const [sheetUp, setSheetUp] = useState(false)
  const [completion, setCompletion] = useState<CompletionData | null>(null)
  const [pendingProgramCele, setPendingProgramCele] = useState<Program | null>(null)
  const [programCelebration, setProgramCelebration] = useState<Program | null>(null)
  const closeTimer = useRef<number | null>(null)

  const openDrill = useCallback((drill: Drill, origin: DrillOrigin) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setActiveDrill(drill)
    setDrillOrigin(origin)
    // dois rAF para garantir que o estado inicial (em baixo) é pintado antes da transição
    requestAnimationFrame(() => requestAnimationFrame(() => setSheetUp(true)))
  }, [])

  const closeDrill = useCallback(() => {
    setSheetUp(false)
    closeTimer.current = window.setTimeout(() => setActiveDrill(null), SHEET_MS)
  }, [])

  const handleComplete = useCallback(
    (drill: Drill) => {
      const wasNew = !progress.completedDrillIds.includes(drill.id)
      const completedNow = wasNew
        ? [...progress.completedDrillIds, drill.id]
        : progress.completedDrillIds

      // o treino conta para TODOS os programas que incluem este exercício
      const containing = programsContainingDrill(drill.id)
      const claims = containing.filter((program) => {
        if (progress.claimedPrograms.includes(program.id)) return false
        if (!isProgramComplete(program, completedNow)) return false
        const days = progress.programTrainingDays[program.id] ?? []
        const daysAfter = days.includes(localToday()) ? days.length : days.length + 1
        return daysAfter >= program.days
      })

      // sessão "Treino de Hoje" — o exercício conta venha de onde vier
      const session = buildDailySession(new Date(), progress, withFriends)
      const sessionIds = session.map((d) => d.id)

      // deltas de atributos (antes → depois) para o ecrã de conclusão
      const before = attributeValues(progress, allDrills, programs)
      const afterProgress = {
        ...progress,
        completionCounts: {
          ...progress.completionCounts,
          [drill.id]: (progress.completionCounts[drill.id] ?? 0) + 1,
        },
        claimedPrograms: [...progress.claimedPrograms, ...claims.map((p) => p.id)],
      }
      const after = attributeValues(afterProgress, allDrills, programs)
      const attrDeltas = drill.attributes.map((key) => ({
        key,
        code: ATTRIBUTE_CODES[key],
        from: before[key],
        to: after[key],
      }))

      // conclusão + dias + sessão + recompensas numa só gravação (atómico)
      const result = completeDrill(drill, {
        dayProgramIds: containing.map((p) => p.id),
        claimProgramIds: claims.map((p) => p.id),
        sessionIds,
        sessionBonusXp: SESSION_BONUS_XP,
      })
      closeDrill()

      // próximo exercício, no contexto de onde este veio
      let next: Drill | null = null
      if (drillOrigin.kind === 'session') {
        const doneToday = progress.daily.date === localToday() ? progress.daily.doneIds : []
        next = session.find((d) => d.id !== drill.id && !doneToday.includes(d.id)) ?? null
      } else if (drillOrigin.kind === 'program') {
        const drills = programDrills(drillOrigin.program)
        const nextIdx = currentDrillIndex(drills, completedNow)
        next = nextIdx < drills.length ? drills[nextIdx] : null
      } else if (drillOrigin.kind === 'futsal') {
        const nextIdx = currentDrillIndex(futsalDrills, completedNow)
        next = nextIdx < futsalDrills.length ? futsalDrills[nextIdx] : null
      } else {
        // no caminho, o próximo é sempre a solo — os 👥 nunca se abrem sozinhos
        const nextIdx = currentSoloDrillIndex(mainPathDrills, completedNow)
        next = nextIdx < mainPathDrills.length ? mainPathDrills[nextIdx] : null
      }

      const doneTodayAfter =
        (progress.daily.date === localToday() ? progress.daily.doneIds : []).filter((id) =>
          sessionIds.includes(id),
        ).length + (sessionIds.includes(drill.id) ? 1 : 0)

      setCompletion({
        drill,
        xpGained: result.xpGained,
        streak: result.streak,
        attrDeltas,
        overallFrom: overallRating(progress.xpTotal),
        overallTo: overallRating(progress.xpTotal + drill.xp + result.sessionBonus),
        xpTotalAfter: progress.xpTotal + drill.xp + result.sessionBonus,
        programRows: containing.map((p) => {
          const days = progress.programTrainingDays[p.id] ?? []
          const dayCount = days.includes(localToday()) ? days.length : days.length + 1
          return { name: p.name, day: Math.min(dayCount, p.days), days: p.days, programId: p.id }
        }),
        nextDrill: next,
        wasNew: result.wasNew,
        sessionBonus: result.sessionBonus,
        sessionProgress: sessionIds.length
          ? { done: Math.min(doneTodayAfter, sessionIds.length), total: sessionIds.length }
          : null,
      })
      setPendingProgramCele(claims[0] ?? null)
    },
    [completeDrill, closeDrill, progress, drillOrigin, withFriends],
  )

  /** Partilha do recorde como imagem story (Modo Amigos fase 1). */
  const shareRecord = useCallback(
    async (drill: Drill, value: number) => {
      if (!player || !drill.record) return
      try {
        const values = attributeValues(progress, allDrills, programs)
        const rating = overallRating(progress.xpTotal)
        const loc = localizeDrill(drill, lang)
        const blob = await generateShareImage({
          player,
          rating,
          title: titleForRating(rating, lang),
          values,
          streak: progress.streak.current,
          medals: earnedMedals(progress, programs),
          record: { value, unit: loc.recordUnit ?? drill.record.unit, drillName: loc.name },
          lang,
        })
        await shareImage(blob, lang === 'en' ? 'new-record.png' : 'novo-recorde.png')
      } catch {
        // partilha falhou/cancelada — sem drama
      }
    },
    [player, progress, lang],
  )

  const dismissCompletion = useCallback(
    (nextDrill: Drill | null) => {
      const cele = pendingProgramCele
      setCompletion(null)
      setPendingProgramCele(null)
      if (cele) {
        setProgramCelebration(cele) // celebração especial de programa completo
      } else if (nextDrill) {
        openDrill(nextDrill, drillOrigin)
      }
    },
    [pendingProgramCele, drillOrigin, openDrill],
  )

  if (!player) {
    return (
      <div className="phone">
        <OnboardingScreen onSave={savePlayer} />
      </div>
    )
  }

  return (
    <div className="phone">
      {view === 'path' && (
        <PathScreen
          progress={progress}
          player={player}
          withFriends={withFriends}
          onToggleFriends={setWithFriends}
          onOpenDrill={(d) => openDrill(d, { kind: 'main' })}
          onOpenSessionDrill={(d) => openDrill(d, { kind: 'session' })}
        />
      )}
      {view === 'programs' &&
        (activeProgram ? (
          <ProgramScreen
            program={activeProgram}
            progress={progress}
            onBack={() => setActiveProgram(null)}
            onOpenDrill={(d) => openDrill(d, { kind: 'program', program: activeProgram })}
          />
        ) : (
          <ProgramsScreen progress={progress} onOpenProgram={setActiveProgram} />
        ))}
      {view === 'profile' && (
        <ProfileScreen progress={progress} player={player} onSavePlayer={savePlayer} />
      )}
      {view === 'futsal' && (
        <FutsalScreen progress={progress} onOpenDrill={(d) => openDrill(d, { kind: 'futsal' })} />
      )}

      {activeDrill && (
        <DrillScreen drill={activeDrill} up={sheetUp} onBack={closeDrill} onComplete={handleComplete} />
      )}

      {completion && (
        <CompletionScreen
          data={completion}
          onNext={(d) => dismissCompletion(d)}
          onClose={() => dismissCompletion(null)}
          onFeedback={(level) => recordFeedback(completion.drill.id, level)}
          onSaveRecord={(value) => saveRecord(completion.drill.id, value)}
          onShareRecord={(value) => void shareRecord(completion.drill, value)}
        />
      )}
      {programCelebration && (
        <ProgramCelebration program={programCelebration} onDone={() => setProgramCelebration(null)} />
      )}

      <BottomNav view={view} onChange={setView} />
    </div>
  )
}
