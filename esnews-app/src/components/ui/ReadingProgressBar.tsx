import { useEffect, useState, type RefObject } from 'react'

interface Props {
  targetRef: RefObject<HTMLElement | null>
}

function ReadingProgressBar({ targetRef }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false
      const el = targetRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) {
        setProgress(100)
        return
      }

      const scrolled = -rect.top
      const pct = (scrolled / total) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [targetRef])

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"
    >
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgressBar
