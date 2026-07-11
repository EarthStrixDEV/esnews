import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/articles'
import { useNews } from '../../context/NewsContext'

function Footer() {
  const { articles } = useNews()
  const recent = articles.slice(0, 3)

  return (
    <footer className="bg-surface-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-xl font-extrabold">
              e
            </span>
            <span className="font-display text-2xl font-extrabold">esnews</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Premium coverage of AI, Tech, Cloud Computing and IT — the signal,
            without the noise.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold">Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/category/${cat.toLowerCase()}`}
                  className="transition-colors hover:text-accent"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold">Recent Posts</h3>
          <ul className="mt-4 space-y-3">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/article/${a.id}`}
                  className="line-clamp-2 text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © 2026 esnews — AI · Tech · Cloud · IT. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
