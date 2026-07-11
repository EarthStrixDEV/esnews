interface Props {
  from: string
  to: string
  onChange: (next: { from?: string; to?: string }) => void
  onClear: () => void
}

/** number of days each preset covers, or null for "All time" */
const PRESETS: { label: string; days: number | null }[] = [
  { label: 'All time', days: null },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
]

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function DateFilter({ from, to, onChange, onClear }: Props) {
  const active = Boolean(from || to)

  const applyPreset = (days: number | null) => {
    if (days === null) {
      onClear()
      return
    }
    const now = new Date()
    const start = new Date()
    start.setDate(now.getDate() - days)
    onChange({ from: toISODate(start), to: toISODate(now) })
  }

  // which preset (if any) matches the current range, for highlight
  const activePreset = (() => {
    if (!from && !to) return 'All time'
    if (!to) return null
    const spanDays = Math.round(
      (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000,
    )
    return PRESETS.find((p) => p.days === spanDays)?.label ?? null
  })()

  return (
    <div className="mb-8 rounded-2xl border border-ink/10 bg-cream p-5">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        {/* Date length presets */}
        <div>
          <p className="mb-2 font-display text-xs font-bold tracking-[0.15em] text-ink/60 uppercase">
            Date length
          </p>
          <div className="flex flex-wrap gap-1 rounded-lg bg-paper p-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.days)}
                className={`rounded-md px-3 py-1.5 font-display text-sm font-semibold transition-colors ${
                  activePreset === p.label
                    ? 'bg-accent text-white'
                    : 'text-ink/60 hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explicit range pickers */}
        <label className="block">
          <span className="mb-2 block font-display text-xs font-bold tracking-[0.15em] text-ink/60 uppercase">
            From
          </span>
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => onChange({ from: e.target.value })}
            className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display text-xs font-bold tracking-[0.15em] text-ink/60 uppercase">
            To
          </span>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => onChange({ to: e.target.value })}
            className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>

        {active && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto font-display text-sm font-bold text-accent hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  )
}

export default DateFilter
