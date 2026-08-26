import { useCallback, useRef, useState } from 'react'
import { BottomNav, type View } from './components/BottomNav'
import { ProgramCelebration } from './components/ProgramCelebration'
import { usePlayer } from './hooks/usePlayer'
import { localToday, useProgress } from './hooks/useProgress'
import { ATTRIBUTE_CODES, attributeValues, overallRating } from './lib/attributes'
import {
  allDrills,
  currentDrillIndex,
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

export default function App() {
  const { progress, completeDrill } = useProgress()
  const { player, savePlayer } = usePlayer()
  const [view, setView] = useState<View>('path')
  const [activeProgram, setActiveProgram] = useState<Program | null>(null)
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null)
  // programa de origem do exercício aberto (null = veio do caminho misto)
  const [drillOrigin, setDrillOrigin] = useState<Program | null>(null)
  const [sheetUp, setSheetUp] = useState(false)
  const [completion, setCompletion] = useState<CompletionData | null>(null)
  const [pendingProgramCele, setPendingProgramCele] = useState<Program | null>(null)
  const [programCelebration, setProgramCelebration] = useState<Program | null>(null)
  const closeTimer = useRef<number | null>(null)

  const openDrill = useCallback((drill: Drill, origin: Program | null) => {
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

      // conclusão + dias + recompensas numa só gravação (atómico)
      const result = completeDrill(drill, {
        dayProgramIds: containing.map((p) => p.id),
        claimProgramIds: claims.map((p) => p.id),
      })
      closeDrill()

      // próximo exercício no contexto de onde veio (programa aberto ou caminho misto)
      const contextDrills = drillOrigin ? programDrills(drillOrigin) : mainPathDrills
      const nextIdx = currentDrillIndex(contextDrills, completedNow)
      const next = nextIdx < contextDrills.length ? contextDrills[nextIdx] : null

      setCompletion({
        drill,
        xpGained: result.xpGained,
        streak: result.streak,
        attrDeltas,
        overallFrom: overallRating(progress.xpTotal),
        overallTo: overallRating(progress.xpTotal + drill.xp),
        xpTotalAfter: progress.xpTotal + drill.xp,
        programRows: containing.map((p) => {
          const days = progress.programTrainingDays[p.id] ?? []
          const dayCount = days.includes(localToday()) ? days.length : days.length + 1
          return { name: p.name, day: Math.min(dayCount, p.days), days: p.days, programId: p.id }
        }),
        nextDrill: next,
        wasNew: result.wasNew,
      })
      setPendingProgramCele(claims[0] ?? null)
    },
    [completeDrill, closeDrill, progress, drillOrigin],
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
        <PathScreen progress={progress} player={player} onOpenDrill={(d) => openDrill(d, null)} />
      )}
      {view === 'programs' &&
        (activeProgram ? (
          <ProgramScreen
            program={activeProgram}
            progress={progress}
            onBack={() => setActiveProgram(null)}
            onOpenDrill={(d) => openDrill(d, activeProgram)}
          />
        ) : (
          <ProgramsScreen progress={progress} onOpenProgram={setActiveProgram} />
        ))}
      {view === 'profile' && (
        <ProfileScreen progress={progress} player={player} onSavePlayer={savePlayer} />
      )}
      {view === 'futsal' && <FutsalScreen />}

      {activeDrill && (
        <DrillScreen drill={activeDrill} up={sheetUp} onBack={closeDrill} onComplete={handleComplete} />
      )}

      {completion && (
        <CompletionScreen
          data={completion}
          onNext={(d) => dismissCompletion(d)}
          onClose={() => dismissCompletion(null)}
        />
      )}
      {programCelebration && (
        <ProgramCelebration program={programCelebration} onDone={() => setProgramCelebration(null)} />
      )}

      <BottomNav view={view} onChange={setView} />
    </div>
  )
}
