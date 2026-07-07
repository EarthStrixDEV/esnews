import { useMemo, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import { parseQuery, searchArticles, highlight } from '../utils/search'

/** render text with matched terms wrapped in <mark> */
function Highlighted({ text, terms }: { text: string; terms: ReturnType<typeof parseQuery> }): ReactNode {
  return highlight(text, terms).map((seg, i) =>
    seg.hit ? (
      <mark key={i} className="rounded bg-accent/20 text-accent">
        {seg.text}
      </mark>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  )
}

function SearchPage() {
  const [params, setParams] = useSearchParams()
  const { articles } = useNews()
  const query = params.get('q') ?? ''

  const terms = useMemo(() => parseQuery(query), [query])
  const results = useMemo(
    () => searchArticles(articles, query),
    [query, articles],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Search
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Find a story
        </h1>
        <div className="relative mt-8 max-w-2xl">
          <svg
            className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink/40"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) =>
              setParams(e.target.value ? { q: e.target.value } : {}, {
                replace: true,
              })
            }
            placeholder="Try  cloud secur*  or  *gpt*  — words match anywhere"
            autoFocus
            className="w-full rounded-xl border-2 border-ink/10 bg-cream py-4 pr-5 pl-13 font-display text-lg font-medium transition-colors placeholder:text-ink/30 focus:border-accent focus:outline-none"
          />
        </div>
        {query ? (
          <p className="mt-4 text-sm text-ink/50">
            {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-semibold text-ink">"{query}"</span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-ink/40">
            Multiple words all have to match (any field). Use{' '}
            <code className="rounded bg-cream px-1.5 py-0.5 font-semibold text-ink/60">*</code>{' '}
            as a wildcard — e.g.{' '}
            <button
              type="button"
              onClick={() => setParams({ q: 'secur*' }, { replace: true })}
              className="font-semibold text-accent hover:underline"
            >
              secur*
            </button>
            .
          </p>
        )}
      </header>

      {query && results.length === 0 && (
        <div className="rounded-2xl bg-cream py-16 text-center">
          <p className="font-display text-2xl font-bold">No stories found</p>
          <p className="mt-2 text-ink/50">
            Try fewer words or a wildcard — e.g.{' '}
            <span className="font-semibold text-ink/70">clou*</span> instead of{' '}
            <span className="font-semibold text-ink/70">cloud computing</span>.
          </p>
        </div>
      )}

      {!query && (
        <div className="rounded-2xl bg-cream py-16 text-center">
          <p className="font-display text-2xl font-bold">Start typing to search</p>
          <p className="mt-2 text-ink/50">
            Searches title, summary, author, category and full text across{' '}
            {articles.length} stories.
          </p>
        </div>
      )}

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <Link key={a.id} to={`/article/${a.id}`} className="group">
            <div className="overflow-hidden rounded-xl">
              <ArticleImage
                src={a.image}
                alt=""
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-4">
              <CategoryBadge category={a.category} linked={false} />
              <h2 className="mt-3 line-clamp-2 font-display text-xl leading-snug font-bold transition-colors group-hover:text-accent">
                <Highlighted text={a.title} terms={terms} />
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-ink/60">
                <Highlighted text={a.excerpt} terms={terms} />
              </p>
              <p className="mt-3 text-xs text-ink/40">
                By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date} · {a.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
