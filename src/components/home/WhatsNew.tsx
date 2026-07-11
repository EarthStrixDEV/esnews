import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, type Category } from '../../data/articles'
import { useNews } from '../../context/NewsContext'
import SectionTitle from '../ui/SectionTitle'
import ArticleImage from '../ui/ArticleImage'
import StayConnected from './StayConnected'

function WhatsNew() {
  const { getByCategory } = useNews()
  const [active, setActive] = useState<Category>('AI')
  const items = getByCategory(active)
  const [lead, ...rest] = items

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle title="What's New">
            <div className="flex flex-wrap gap-1 rounded-lg bg-cream p-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`rounded-md px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
                    active === cat
                      ? 'bg-accent text-white'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionTitle>

          <div className="grid gap-8 md:grid-cols-2">
            {lead && (
              <Link to={`/article/${lead.id}`} className="group">
                <div className="relative overflow-hidden rounded-xl">
                  <ArticleImage
                    src={lead.image}
                    alt=""
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-4 left-4 rounded bg-accent px-2.5 py-1 font-display text-[11px] font-bold tracking-widest text-white uppercase">
                    {lead.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug font-bold transition-colors group-hover:text-accent">
                  {lead.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60">{lead.excerpt}</p>
              </Link>
            )}

            <div className="flex flex-col gap-6">
              {rest.slice(0, 3).map((a, i) => (
                <Link key={a.id} to={`/article/${a.id}`} className="group flex gap-4">
                  <div className="relative shrink-0">
                    <ArticleImage
                      compact
                      src={a.image}
                      alt=""
                      className="h-20 w-24 rounded-lg object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute -bottom-2 -left-2 grid h-6 w-6 place-items-center rounded-full bg-accent font-display text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[10px] font-bold tracking-[0.2em] text-ink/40 uppercase">
                      {a.category}
                    </p>
                    <h4 className="mt-1 line-clamp-2 font-display leading-snug font-bold transition-colors group-hover:text-accent">
                      {a.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-ink/40">📅 {a.date}</p>
                  </div>
                </Link>
              ))}
              {rest.length === 0 && (
                <p className="text-sm text-ink/40">
                  More {active} stories coming soon.
                </p>
              )}
            </div>
          </div>
        </div>

        <StayConnected />
      </div>
    </section>
  )
}

export default WhatsNew
