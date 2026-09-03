// Modelo de dados — SPEC secção 5 + Fase 2 Iteração A (Player Review 2026-08-18)

export type AttributeKey =
  | 'controlo'
  | 'dominio'
  | 'passe'
  | 'remate'
  | 'defesa'
  | 'fisico'
  | 'resistencia'
  | 'velocidade'
  | 'iq'

export interface DrillVideo {
  type: 'pending' | 'youtube' | 'local'
  url: string
}

export interface Drill {
  id: string
  order: number
  name: string
  name_en: string
  skill: string
  difficulty: 1 | 2 | 3 | 4 | 5 // estrelas
  sets: number
  work_seconds: number
  rest_seconds: number
  xp: number
  description: string
  cue: string
  steps: string[]
  attributes: AttributeKey[] // atributos que este exercício treina
  // nº de pessoas EXTRA necessárias (regra do Nicolas: multi-jogador é opcional,
  // nunca bloqueia o caminho, e só entra no Treino de Hoje em dias acompanhados)
  needs_people?: number
  // exercício contável — a app guarda o máximo pessoal (votação do Nicolas)
  record?: { unit: string; prompt: string }
  video: DrillVideo
}

export interface DrillPath {
  id: string
  sport: 'futebol' | 'futsal'
  primary: boolean
  name: string
  category: string
  drills: Drill[]
}

// Programas multi-dia (Tarefa 3, respondida 2026-08-20)
export type ProgramReward =
  | { type: 'attributes'; points: Partial<Record<AttributeKey, number>> }
  | { type: 'medal'; name: string; level: number }

export interface Program {
  id: string
  name: string
  days: number
  minutes_per_day: string
  status: 'ready' | 'coming_soon'
  focus: string
  reward: ProgramReward
  drill_ids: string[]
}

// Caminho principal MISTO por níveis (Tarefa 3b: "como é no Footwork")
export interface MainPathLevel {
  name: string
  drill_ids: string[]
}

export interface DrillsData {
  meta: { version: string; language: string; note?: string }
  attributes?: Record<string, string>
  main_path?: { levels: MainPathLevel[] }
  programs?: Program[]
  paths: DrillPath[]
}

// Estado do jogador (localStorage) — SPEC secção 5 + contagens por exercício (v2)
export interface StreakState {
  current: number
  best: number
  lastTrainedDate: string | null // YYYY-MM-DD
}

// Sessão diária "Treino de Hoje" (Iteração D)
export interface DailyState {
  date: string // YYYY-MM-DD da sessão a que isto se refere
  doneIds: string[] // exercícios da sessão concluídos hoje
  bonusClaimed: boolean // bónus de sessão completa já entregue
  withFriends?: boolean // "hoje treino acompanhado" — inclui os exercícios 👥
}

export type FeedbackLevel = 'facil' | 'normal' | 'dificil'

export interface ProgressState {
  xpTotal: number
  drillsDone: number
  completedDrillIds: string[]
  completionCounts: Record<string, number> // nº de vezes que cada exercício foi feito
  claimedPrograms: string[] // programas completos cuja recompensa já foi entregue
  // dias (YYYY-MM-DD) em que treinou cada programa — a recompensa exige
  // todos os exercícios feitos E program.days dias de treino
  programTrainingDays: Record<string, string[]>
  daily: DailyState
  // "Como correu?" por exercício (semente da dificuldade adaptativa)
  feedback: Record<string, Record<FeedbackLevel, number>>
  // recordes pessoais por exercício contável (votação do Nicolas)
  records: Record<string, { best: number; date: string }>
  streak: StreakState
}

// Cartão de jogador (localStorage, sem contas — ADR-0004)
export interface PlayerProfile {
  name: string
  position: string // código, ex.: "EE"
  objective: string
}
