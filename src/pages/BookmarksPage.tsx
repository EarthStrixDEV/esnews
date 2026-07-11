import { Link } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import { useBookmarks } from '../context/BookmarksContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import BookmarkButton from '../components/ui/BookmarkButton'

function BookmarksPage() {
  const { getArticle } = useNews()
  const { bookmarkedIds } = useBookmarks()

  const items = bookmarkedIds
    .map((id) => getArticle(id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10 border-b border-ink/10 pb-8">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Your Library
        </p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
          Bookmarks
        </h1>
        <p className="mt-3 text-ink/60">
          {items.length} {items.length === 1 ? 'story' : 'stories'} saved
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-ink/60">
          No bookmarks yet. Browse the{' '}
          <Link to="/" className="font-semibold text-accent hover:underline">
            homepage
          </Link>{' '}
          and tap the ☆ on any story to save it here.
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="group relative">
              <Link to={`/article/${a.id}`}>
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
                    {a.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>
                  <p className="mt-3 text-xs text-ink/60">
                    By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date} · {a.readTime}
                  </p>
                </div>
              </Link>
              <BookmarkButton
                articleId={a.id}
                className="absolute top-3 right-3"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
