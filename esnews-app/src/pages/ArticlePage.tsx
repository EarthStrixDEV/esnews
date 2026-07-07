import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import ListenButton from '../components/ui/ListenButton'
import BookmarkButton from '../components/ui/BookmarkButton'
import ReadingProgressBar from '../components/ui/ReadingProgressBar'
import NotFound from './NotFound'

function ArticlePage() {
  const { id } = useParams()
  const { articles, getArticle } = useNews()
  const article = id ? getArticle(id) : undefined
  const bodyRef = useRef<HTMLDivElement>(null)

  if (!article) return <NotFound />

  const related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  return (
    <>
      <ReadingProgressBar targetRef={bodyRef} />
      <article>
      {/* Hero */}
      <div className="relative">
        <ArticleImage
          src={article.image}
          alt={article.title}
          className="h-[55svh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0">
          <div className="mx-auto max-w-4xl px-4 pb-12">
            <CategoryBadge category={article.category} />
            <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold text-white md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display font-bold text-white">
                {article.author[0]}
              </span>
              <span className="font-semibold text-white uppercase">
                {article.author}
              </span>
              <span>📅 {article.date}</span>
              <span>⏱ {article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div ref={bodyRef} className="mx-auto max-w-3xl px-4 py-14">
        <div className="mb-8 flex items-center gap-3">
          <ListenButton articles={[article]} label="Listen to this story" />
          <BookmarkButton articleId={article.id} />
        </div>
        <p className="border-l-4 border-accent pl-5 font-display text-xl leading-relaxed font-medium text-ink/80">
          {article.excerpt}
        </p>
        <div className="mt-10 space-y-7 text-lg leading-relaxed text-ink/75">
          {article.content.map((para, i) => (
            <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-extrabold first-letter:text-accent' : ''}>
              {para}
            </p>
          ))}
        </div>

        {article.sourceUrl && (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase transition-transform hover:-translate-y-0.5"
          >
            Read full story at {article.sourceName ?? 'source'} →
          </a>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-8">
          <div className="flex gap-2">
            {['#' + article.category, '#esnews', '#2026'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink/60"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            to="/"
            className="font-display text-sm font-bold text-accent hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-cream py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 font-display text-2xl font-bold">
              More in {article.category}
              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {related.map((a) => (
                <Link key={a.id} to={`/article/${a.id}`} className="group">
                  <div className="overflow-hidden rounded-xl">
                    <ArticleImage
                      src={a.image}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-display leading-snug font-bold transition-colors group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink/60">{a.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
    </>
  )
}

export default ArticlePage
