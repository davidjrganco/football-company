import { useLang } from '../lib/i18n'
import { BallIcon, GridIcon, TrophyIcon, UserIcon } from './icons'

export type View = 'path' | 'programs' | 'profile' | 'futsal'

interface Props {
  view: View
  onChange: (view: View) => void
}

const TABS: { id: View; label: string; labelEn: string; Icon: typeof BallIcon; mutedWhenActive?: boolean }[] = [
  { id: 'path', label: 'Caminho', labelEn: 'Path', Icon: BallIcon },
  { id: 'programs', label: 'Programas', labelEn: 'Programs', Icon: TrophyIcon },
  { id: 'profile', label: 'Perfil', labelEn: 'Profile', Icon: UserIcon },
  // Futsal em último e discreto — ADR-0002: nunca ganha a cor de destaque
  { id: 'futsal', label: 'Futsal', labelEn: 'Futsal', Icon: GridIcon, mutedWhenActive: true },
]

export function BottomNav({ view, onChange }: Props) {
  const { lang } = useLang()
  return (
    <nav className="absolute inset-x-0 bottom-0 z-[15] flex h-[72px] border-t border-line bg-[rgba(10,19,15,.94)] pb-[env(safe-area-inset-bottom)] backdrop-blur-[10px]">
      {TABS.map(({ id, label, labelEn, Icon, mutedWhenActive }) => {
        const active = view === id
        const color = active && !mutedWhenActive ? '#22C55E' : '#8AA79A'
        return (
          <button
            key={id}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-[4px] border-none bg-transparent pt-3 text-[11px] tracking-[.03em] ${
              active && !mutedWhenActive ? 'font-extrabold text-grass' : 'font-bold text-muted'
            } ${id === 'futsal' ? 'opacity-75' : ''}`}
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} color={color} />
            {lang === 'en' ? labelEn : label}
          </button>
        )
      })}
    </nav>
  )
}
