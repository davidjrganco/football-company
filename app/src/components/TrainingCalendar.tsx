import { useLang } from '../lib/i18n'

// Calendário do mês (Iteração F): os dias treinados pintados de relva —
// o "não quebres a corrente" à vista, estilo GitHub.

interface Props {
  trainingDays: string[]
}

const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK_PT = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
const WEEK_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function TrainingCalendar({ trainingDays }: Props) {
  const { lang, l } = useLang()
  const trained = new Set(trainingDays)
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const todayStr = `${year}-${pad(month + 1)}-${pad(now.getDate())}`
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // semana a começar na segunda-feira
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const monthName = (lang === 'en' ? MONTHS_EN : MONTHS_PT)[month]
  const trainedThisMonth = Array.from({ length: daysInMonth }, (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`)
    .filter((d) => trained.has(d)).length

  return (
    <div className="mt-3 rounded-2xl border border-line bg-panel px-[15px] py-[13px]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-extrabold tracking-[.1em] text-muted uppercase">
          {l('O teu mês', 'Your month')} · {monthName}
        </div>
        <span className="text-[11.5px] font-extrabold text-grass">
          {trainedThisMonth}{' '}
          {trainedThisMonth === 1 ? l('dia treinado', 'day trained') : l('dias treinados', 'days trained')}
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-7 gap-1.5">
        {(lang === 'en' ? WEEK_EN : WEEK_PT).map((w, i) => (
          <div key={`h${i}`} className="text-center text-[10px] font-extrabold text-muted">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const isTrained = trained.has(dateStr)
          const isToday = dateStr === todayStr
          return (
            <div
              key={dateStr}
              className="flex h-7 items-center justify-center rounded-lg text-[11px] font-bold"
              style={{
                background: isTrained ? 'linear-gradient(160deg,#22C55E,#16A34A)' : 'rgba(233,245,236,.06)',
                color: isTrained ? '#052012' : '#8AA79A',
                border: isToday ? '1.5px solid #A3E635' : '1.5px solid transparent',
                boxShadow: isTrained ? '0 0 8px rgba(34,197,94,.35)' : undefined,
              }}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
