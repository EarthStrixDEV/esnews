import { useEffect, useRef } from 'react'

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let ringX = 0
    let ringY = 0
    let mouseX = 0
    let mouseY = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      const interactive = (e.target as HTMLElement).closest(
        'a, button, [role="button"]',
      )
      ring.dataset.hover = interactive ? 'true' : 'false'
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden>
      <div
        ref={dotRef}
        className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border-2 border-accent/60 transition-[width,height,margin,background-color] duration-200 data-[hover=true]:-top-6 data-[hover=true]:-left-6 data-[hover=true]:h-12 data-[hover=true]:w-12 data-[hover=true]:bg-accent/10"
      />
    </div>
  )
}

export default CustomCursor
