// Ícones da app — SVG desenhados (sem emojis), stroke consistente.
interface IconProps {
  size?: number
  color?: string
}

export function FlameIcon({ size = 16, color = '#FB923C' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1 4-4 6-4 10a4 4 0 0 0 8 0c0-1.5-.6-2.7-1.3-3.8C13.6 9.7 15 8 15 6c1.8 1.4 4 4.6 4 8a7 7 0 0 1-14 0c0-5 5-8 7-12z" />
    </svg>
  )
}

export function BoltIcon({ size = 16, color = '#A3E635' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

export function TrophyIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4.5a3 3 0 0 0 3 4.5M17 6h2.5a3 3 0 0 1-3 4.5M12 14v4M8.5 20h7" />
    </svg>
  )
}

export function LockIcon({ size = 18, color = '#8AA79A' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function CheckIcon({ size = 22, color = '#052012' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5 10 18 19.5 7" />
    </svg>
  )
}

export function PlayIcon({ size = 24, color = '#052012' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}

export function TargetIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  )
}

export function StarIcon({ size = 12, filled = true, color = '#A3E635' }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'rgba(233,245,236,.22)'}>
      <path d="M12 2.5 15 9l7 .8-5.2 4.7 1.5 6.9L12 17.8 5.7 21.4l1.5-6.9L2 9.8 9 9z" />
    </svg>
  )
}

export function BallIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5 16 10.5 14.5 15h-5L8 10.5z" fill={color} stroke="none" />
    </svg>
  )
}

export function UserIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" />
    </svg>
  )
}

export function GridIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 18, color = '#F4FBF6' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 5 8 12l6.5 7" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 5 16 12l-6.5 7" />
    </svg>
  )
}

export function BootIcon({ size = 20, color = 'currentColor' }: IconProps) {
  // bota com pitões — velocidade
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15V5l5 4 3-1 2 3h4a3 3 0 0 1 3 3v1H4z" />
      <path d="M6 18v2M11 18v2M16 18v2" />
    </svg>
  )
}

export function FootIcon({ size = 20, color = 'currentColor' }: IconProps) {
  // pé/meia — pé fraco
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v7l-3.5 5A3.5 3.5 0 0 0 8.5 20H12a4 4 0 0 0 4-4V9a6 6 0 0 0-2-4.5L13 3z" />
    </svg>
  )
}
