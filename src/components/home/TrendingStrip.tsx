import { Link } from 'react-router-dom'
import { useNews } from '../../context/NewsContext'
import ArticleImage from '../ui/ArticleImage'

function TrendingStrip() {
  const { trending: trendingArticles } = useNews()
  return (
    <section className="border-b border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {trendingArticles.slice(0, 4).map((a, i) => (
          <Link key={a.id} to={`/article/${a.id}`} className="group flex items-center gap-4">
            <div className="relative shrink-0">
              <ArticleImage
                compact
                src={a.image}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-ink font-display text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-[10px] font-bold tracking-[0.2em] text-ink/40 uppercase">
                {a.category}
              </p>
              <h3 className="mt-1 line-clamp-2 font-display text-sm leading-snug font-semibold transition-colors group-hover:text-accent">
                {a.title}
              </h3>
              <p className="mt-1 text-[11px] text-ink/40">📅 {a.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TrendingStrip
