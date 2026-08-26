import { futsalPath } from '../lib/drills'

/** Secção secundária e discreta — ADR-0002: nunca com o destaque do futebol. */
export function FutsalScreen() {
  const drills = futsalPath?.drills ?? []
  return (
    <div className="screen">
      <h2 className="mt-1.5 mb-3.5 font-display text-[22px] tracking-[.02em]">Futsal</h2>
      <span className="mb-3 inline-block rounded-full border border-line px-2.5 py-1 text-[11px] font-bold tracking-[.12em] text-muted uppercase">
        Secção secundária
      </span>
      <p className="mb-4 text-[12.5px] leading-normal text-muted">
        Uns extras de futsal, para variar. O foco do teu treino é o futebol.
      </p>
      <div>
        {drills.map((d) => (
          <div
            key={d.id}
            className="mb-2.5 flex items-center gap-3 rounded-[14px] border border-line bg-panel px-3.5 py-3 opacity-[.92]"
          >
            <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-panel2 text-lg">
              ▦
            </div>
            <div>
              <div className="text-[15px] font-bold">{d.name}</div>
              <div className="text-[12.5px] text-muted">{d.skill}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
