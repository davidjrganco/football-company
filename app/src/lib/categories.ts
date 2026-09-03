import type { Drill } from '../types'

// Cor por categoria (redesign 2026-08): cada família de exercícios tem a sua
// cor no caminho, nos programas e no ecrã do exercício.
export type CategoryKey =
  | 'dominio'
  | 'velocidade'
  | 'finalizacao'
  | 'pefraco'
  | 'forca'
  | 'defesa'
  | 'futsal'

export interface CategoryStyle {
  key: CategoryKey
  label: string
  color: string // cor principal
  dark: string // texto sobre a cor
  shadow: string // sombra 3D dos botões
  tintBg: string // fundo do cartão tingido
  tintBg2: string
}

export const CATEGORIES: Record<CategoryKey, CategoryStyle> = {
  dominio: {
    key: 'dominio',
    label: 'Domínio',
    color: '#22C55E',
    dark: '#052012',
    shadow: '#16A34A',
    tintBg: '#1A2E24',
    tintBg2: '#14231C',
  },
  velocidade: {
    key: 'velocidade',
    label: 'Velocidade',
    color: '#38BDF8',
    dark: '#04202F',
    shadow: '#0E7FBE',
    tintBg: '#16283A',
    tintBg2: '#101D2B',
  },
  finalizacao: {
    key: 'finalizacao',
    label: 'Finalização',
    color: '#FB923C',
    dark: '#241509',
    shadow: '#C2410C',
    tintBg: '#33200F',
    tintBg2: '#1F1409',
  },
  pefraco: {
    key: 'pefraco',
    label: 'Pé fraco',
    color: '#A3E635',
    dark: '#1A2405',
    shadow: '#65A30D',
    tintBg: '#26330F',
    tintBg2: '#171F09',
  },
  forca: {
    key: 'forca',
    label: 'Força',
    color: '#C084FC',
    dark: '#1E1035',
    shadow: '#7C3AED',
    tintBg: '#2A1B40',
    tintBg2: '#1B1029',
  },
  defesa: {
    key: 'defesa',
    label: 'Defesa',
    color: '#F87171',
    dark: '#2B0E0E',
    shadow: '#DC2626',
    tintBg: '#3A1515',
    tintBg2: '#240D0D',
  },
  futsal: {
    key: 'futsal',
    label: 'Futsal',
    color: '#8AA79A',
    dark: '#0C1712',
    shadow: '#5B7268',
    tintBg: '#1A2420',
    tintBg2: '#141C18',
  },
}

/** Categoria de um exercício, pelo prefixo do id (fb/sa/fin/wf/st/ft). */
export function categoryOfDrill(drill: Drill): CategoryStyle {
  if (drill.id.startsWith('sa-')) return CATEGORIES.velocidade
  if (drill.id.startsWith('fin-')) return CATEGORIES.finalizacao
  if (drill.id.startsWith('wf-')) return CATEGORIES.pefraco
  if (drill.id.startsWith('st-')) return CATEGORIES.forca
  if (drill.id.startsWith('df-')) return CATEGORIES.defesa
  if (drill.id.startsWith('ft-')) return CATEGORIES.futsal
  return CATEGORIES.dominio
}

/** Categoria de um programa, pelo id. */
export function categoryOfProgram(programId: string): CategoryStyle {
  if (programId === 'speedagility') return CATEGORIES.velocidade
  if (programId === 'finishing') return CATEGORIES.finalizacao
  if (programId === 'weakfoot') return CATEGORIES.pefraco
  return CATEGORIES.dominio
}
