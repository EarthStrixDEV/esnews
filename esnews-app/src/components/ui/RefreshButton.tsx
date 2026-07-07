import { useState } from 'react'
import { useNews } from '../../context/NewsContext'

function RefreshButton() {
  const { refresh, refreshing } = useNews()
  const [flash, setFlash] = useState<'ok' | 'fail' | null>(null)

  const handle = async () => {
    if (refreshing) return
    const ok = await refresh()
    setFlash(ok ? 'ok' : 'fail')
    window.setTimeout(() => setFlash(null), 2000)
  }

  const label = refreshing
    ? 'Refreshing…'
    : flash === 'ok'
      ? 'Updated!'
      : flash === 'fail'
        ? 'No new stories'
        : 'Refresh'

  return (
    <button
      type="button"
      onClick={handle}
      disabled={refreshing}
      className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 font-display text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={refreshing ? 'animate-spin' : ''}
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
      {label}
    </button>
  )
}

export default RefreshButton
