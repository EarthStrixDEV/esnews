import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, articleTime, type Category } from '../data/articles'
import { useNews } from '../context/NewsContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import DateFilter from '../components/ui/DateFilter'
import Pagination from '../components/ui/Pagination'

const PER_PAGE = 20
const DAY_MS = 86_400_000

function TopNewsPage() {
  const { allArticles } = useNews()
  const [params, setParams] = useSearchParams()

  const categoryParam = params.get('category')
  const category = CATEGORIES.find(
    (c) => c.toLowerCase() === categoryParam?.toLowerCase(),
  ) as Category | undefined

  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const fromMs = from ? new Date(from).getTime() : null
  // include the whole "to" day by pushing the bound to its end
  const toMs = to ? new Date(to).getTime() + DAY_MS : null

  const items = allArticles.filter((a) => {
    if (category && a.category !== category) return false
    if (fromMs === null && toMs === null) return true
    const t = articleTime(a)
    if (Number.isNaN(t)) return true // never drop a story over an unparseable date
    if (fromMs !== null && t < fromMs) return false
    if (toMs !== null && t >= toMs) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1),
  )
  const pageItems = items.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Layout only scrolls to top on pathname change — page/category are query params
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page, category, from, to])

  const buildQuery = (overrides: {
    category?: Category | undefined
    page?: number
    from?: string
    to?: string
  }) => {
    const cat = 'category' in overrides ? overrides.category : category
    const pg = overrides.page ?? 1
    const f = 'from' in overrides ? overrides.from : from
    const t = 'to' in overrides ? overrides.to : to
    const q = new URLSearchParams()
    if (cat) q.set('category', cat.toLowerCase())
    if (f) q.set('from', f)
    if (t) q.set('to', t)
    if (pg > 1) q.set('page', String(pg))
    return q
  }

  const makeLink = (targetPage: number, targetCategory = category) => {
    const qs = buildQuery({ category: targetCategory, page: targetPage }).toString()
    return `/news${qs ? `?${qs}` : ''}`
  }

  // date changes reset to page 1
  const setDates = (next: { from?: string; to?: string }) => {
    setParams(buildQuery({ ...next, page: 1 }))
  }
  const clearDates = () => {
    setParams(buildQuery({ from: '', to: '', page: 1 }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Full List
        </p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
          Top News
        </h1>
        <p className="mt-3 text-ink/50">
          {items.length} {items.length === 1 ? 'story' : 'stories'}
          {category ? ` in ${category}` : ' across all categories'}
          {(from || to) && ' · filtered by date'}
        </p>
      </header>

      {/* category tabs */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-lg bg-cream p-1">
        <Link
          to={makeLink(1, undefined)}
          className={`rounded-md px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
            !category ? 'bg-accent text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={makeLink(1, cat)}
            className={`rounded-md px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
              category === cat ? 'bg-accent text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* date range filter */}
      <DateFilter from={from} to={to} onChange={setDates} onClear={clearDates} />

      {/* stacked list */}
      <div className="divide-y divide-ink/10">
        {pageItems.map((a, i) => (
          <Link
            key={a.id}
            to={`/article/${a.id}`}
            className="group flex gap-5 py-6 first:pt-0"
          >
            <span className="hidden w-10 shrink-0 pt-1 font-display text-lg font-extrabold text-ink/20 transition-colors group-hover:text-accent sm:block">
              {String((page - 1) * PER_PAGE + i + 1).padStart(2, '0')}
            </span>
            <ArticleImage
              compact
              src={a.image}
              alt=""
              className="h-24 w-32 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105 sm:h-28 sm:w-44"
              loading="lazy"
            />
            <div className="min-w-0">
              <CategoryBadge category={a.category} linked={false} />
              <h2 className="mt-2 line-clamp-2 font-display text-lg leading-snug font-bold transition-colors group-hover:text-accent sm:text-xl">
                {a.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 hidden text-sm text-ink/60 sm:block">
                {a.excerpt}
              </p>
              <p className="mt-2 text-xs text-ink/40">
                By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date} · {a.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {pageItems.length === 0 && (
        <div className="rounded-2xl bg-cream py-16 text-center">
          <p className="font-display text-2xl font-bold">No stories in this range</p>
          <p className="mt-2 text-ink/50">
            Try a wider date range or another category.
          </p>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} makeLink={makeLink} />
    </div>
  )
}

export default TopNewsPage
