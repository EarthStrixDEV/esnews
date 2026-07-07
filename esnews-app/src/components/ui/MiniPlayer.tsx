import { Link } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'

function MiniPlayer() {
  const { supported, status, tracks, index, rate, toggle, next, prev, cycleRate, stop } =
    usePlayer()

  if (!supported || status === 'idle') return null

  const track = tracks[index]
  const playing = status === 'playing'

  return (
    <div className="fixed right-4 bottom-4 z-[60] w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-dark p-4 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        {/* equalizer */}
        <div className="flex h-8 w-8 shrink-0 items-end justify-center gap-[3px] rounded-lg bg-accent/20 p-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-accent"
              style={{
                animation: `eq 0.9s ease-in-out ${i * 0.15}s infinite`,
                animationPlayState: playing ? 'running' : 'paused',
                height: playing ? undefined : '35%',
              }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">
            {playing ? 'Now Playing' : 'Paused'}
          </p>
          <Link
            to={`/article/${track.articleId}`}
            className="mt-0.5 block truncate font-display text-sm font-semibold hover:text-accent"
            title={track.title}
          >
            {track.title}
          </Link>
        </div>
        <button
          type="button"
          onClick={stop}
          aria-label="Close player"
          className="shrink-0 text-white/40 transition-colors hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={cycleRate}
          className="w-12 rounded-md bg-white/10 py-1 font-display text-xs font-bold transition-colors hover:bg-white/20"
          aria-label="Playback speed"
        >
          {rate}x
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous story"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            ⏮
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="grid h-11 w-11 place-items-center rounded-full bg-accent text-lg transition-transform hover:scale-105"
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= tracks.length - 1}
            aria-label="Next story"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            ⏭
          </button>
        </div>
        <span className="w-12 text-right font-display text-xs font-bold text-white/50">
          {index + 1}/{tracks.length}
        </span>
      </div>
    </div>
  )
}

export default MiniPlayer
