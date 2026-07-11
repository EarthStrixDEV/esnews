import { useHackerNews, timeAgo, domainOf } from '../../hooks/useHackerNews'

function HackerNewsTrending() {
  const { stories, loading, error } = useHackerNews(6)

  return (
    <section className="bg-surface-dark py-14 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Trending on Hacker News
            <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full bg-[#ff6600] align-middle" />
          </h2>
          <a
            href="https://news.ycombinator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-bold text-white/50 transition-colors hover:text-[#ff6600]"
          >
            news.ycombinator.com →
          </a>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-white/5 py-10 text-center">
            <p className="font-display font-bold">Couldn't reach Hacker News</p>
            <p className="mt-1 text-sm text-white/50">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => {
              const domain = domainOf(s.url)
              return (
                <a
                  key={s.id}
                  href={s.url ?? `https://news.ycombinator.com/item?id=${s.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-[#ff6600]/60 hover:bg-white/10"
                >
                  <span className="font-display text-2xl font-extrabold text-white/20 transition-colors group-hover:text-[#ff6600]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-display leading-snug font-semibold transition-colors group-hover:text-[#ff6600]">
                      {s.title}
                    </h3>
                    {domain && (
                      <p className="mt-1 truncate text-xs text-white/40">{domain}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
                      <span className="font-bold text-[#ff6600]">▲ {s.score}</span>
                      <span>by {s.by}</span>
                      <span>💬 {s.descendants ?? 0}</span>
                      <span>{timeAgo(s.time)}</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default HackerNewsTrending
