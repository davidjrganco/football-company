import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Drill } from '../types'

// Opção PT/EN (pedido do David, 2026-09-03). PT-PT é a língua-mãe da app;
// o inglês abre-a aos colegas de equipa e ao mundo. As traduções do CONTEÚDO
// (exercícios) vivem no drills.json (campos *_en); as da INTERFACE vivem
// junto de cada texto, via l('pt', 'en') — fáceis de auditar.

export type Lang = 'pt' | 'en'

const STORAGE_KEY = 'treino-lang-v1'

function loadLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt'
  }
}

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** l('texto em português', 'text in English') */
  l: (pt: string, en: string) => string
}

const LangContext = createContext<LangContextValue>({
  lang: 'pt',
  setLang: () => undefined,
  l: (pt) => pt,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)
  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // modo privado — fica só em memória
    }
    setLangState(next)
  }, [])
  const l = useCallback((pt: string, en: string) => (lang === 'en' ? en : pt), [lang])
  return <LangContext.Provider value={{ lang, setLang, l }}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  return useContext(LangContext)
}

/** Conteúdo do exercício na língua escolhida (EN cai para PT se faltar). */
export function localizeDrill(drill: Drill, lang: Lang) {
  if (lang === 'en') {
    return {
      name: drill.name_en || drill.name,
      skill: drill.skill_en || drill.skill,
      description: drill.description_en || drill.description,
      cue: drill.cue_en || drill.cue,
      steps: drill.steps_en?.length ? drill.steps_en : drill.steps,
      recordUnit: drill.record?.unit_en || drill.record?.unit,
      recordPrompt: drill.record?.prompt_en || drill.record?.prompt,
    }
  }
  return {
    name: drill.name,
    skill: drill.skill,
    description: drill.description,
    cue: drill.cue,
    steps: drill.steps,
    recordUnit: drill.record?.unit,
    recordPrompt: drill.record?.prompt,
  }
}
