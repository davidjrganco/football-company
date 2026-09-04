import type { BadgeIcon } from '../lib/achievements'
import {
  BallIcon,
  BoltIcon,
  CheckIcon,
  DumbbellIcon,
  FlameIcon,
  FootIcon,
  GridIcon,
  ShieldIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from './icons'

function CalendarGlyph({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  )
}

export function BadgeGlyph({ icon, size, color }: { icon: BadgeIcon; size: number; color: string }) {
  switch (icon) {
    case 'flame':
      return <FlameIcon size={size} color={color} />
    case 'bolt':
      return <BoltIcon size={size} color={color} />
    case 'trophy':
      return <TrophyIcon size={size} color={color} />
    case 'check':
      return <CheckIcon size={size} color={color} />
    case 'shield':
      return <ShieldIcon size={size} color={color} />
    case 'star':
      return <StarIcon size={size} color={color} />
    case 'ball':
      return <BallIcon size={size} color={color} />
    case 'dumbbell':
      return <DumbbellIcon size={size} color={color} />
    case 'foot':
      return <FootIcon size={size} color={color} />
    case 'target':
      return <TargetIcon size={size} color={color} />
    case 'users':
      return <UsersIcon size={size} color={color} />
    case 'grid':
      return <GridIcon size={size} color={color} />
    case 'calendar':
      return <CalendarGlyph size={size} color={color} />
  }
}

interface Props {
  icon: BadgeIcon
  color: string
  unlocked: boolean
  size?: number
}

/** Medalha circular — desbloqueada (a cor da conquista) ou bloqueada (cinza). */
export function Badge({ icon, color, unlocked, size = 56 }: Props) {
  return (
    <div
      className="flex flex-none items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: unlocked ? `linear-gradient(160deg, ${color}, ${color}bb)` : '#14231C',
        border: unlocked ? 'none' : '2px solid rgba(233,245,236,.12)',
        boxShadow: unlocked ? `0 6px 16px ${color}55` : 'none',
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      <BadgeGlyph icon={icon} size={size * 0.42} color={unlocked ? '#0C1712' : '#8AA79A'} />
    </div>
  )
}
