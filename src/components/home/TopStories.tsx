import { Link } from 'react-router-dom'
import { useNews } from '../../context/NewsContext'
import SectionTitle from '../ui/SectionTitle'
import ArticleImage from '../ui/ArticleImage'

function TopStories() {
  const { articles } = useNews()
  const stories = articles.slice(4, 8)

  return (
    <section className="bg-cream py-14">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle title="Top Stories" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((a) => (
            <Link key={a.id} to={`/article/${a.id}`} className="group">
              <div className="overflow-hidden rounded-xl">
                <ArticleImage
                  src={a.image}
                  alt=""
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 font-display text-[10px] font-bold tracking-[0.2em] text-ink/40 uppercase">
                {a.category}
              </p>
              <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug font-bold transition-colors group-hover:text-accent">
                {a.title}
              </h3>
              <p className="mt-2 text-xs text-ink/40">
                By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopStories
