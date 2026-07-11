import { Link } from 'react-router-dom'
import { useNews } from '../../context/NewsContext'

function TopBar() {
  const { trending } = useNews()
  const headline = trending[0]
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-surface-dark text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 items-center gap-1 rounded bg-accent px-2 py-0.5 font-display font-bold tracking-wider uppercase">
            ⚡ Trending
          </span>
          <Link
            to={`/article/${headline.id}`}
            className="truncate text-white/80 transition-colors hover:text-white"
          >
            {headline.title}
          </Link>
        </div>
        <div className="hidden shrink-0 items-center gap-4 text-white/70 sm:flex">
          <span>📅 {today}</span>
          <span className="text-white/30">|</span>
          <span className="tracking-wider uppercase">Follow us :</span>
          <div className="flex gap-3">
            {['𝕏', 'in', 'f', '▶'].map((s) => (
              <a key={s} href="#" className="transition-colors hover:text-accent">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
