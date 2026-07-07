import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, type Category } from '../data/articles'
import { useNews } from '../context/NewsContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import NotFound from './NotFound'

function CategoryPage() {
  const { slug } = useParams()
  const { getByCategory } = useNews()
  const category = CATEGORIES.find((c) => c.toLowerCase() === slug)

  if (!category) return <NotFound />

  const items = getByCategory(category as Category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10 border-b border-ink/10 pb-8">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Category
        </p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
          {category}
        </h1>
        <p className="mt-3 text-ink/50">
          {items.length} {items.length === 1 ? 'story' : 'stories'} in {category}
        </p>
      </header>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
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
                {a.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>
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

export default CategoryPage
