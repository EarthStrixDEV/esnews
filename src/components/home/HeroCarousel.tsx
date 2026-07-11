import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNews } from '../../context/NewsContext'
import CategoryBadge from '../ui/CategoryBadge'
import ArticleImage from '../ui/ArticleImage'

const AUTOPLAY_MS = 5000

function HeroCarousel() {
  const { articles, featured } = useNews()
  const slides = featured
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  )
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [next, paused])

  const sideArticles = articles.filter((a) => !a.featured).slice(0, 3)

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-3">
      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-2xl lg:col-span-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.id}`}
              className="group relative aspect-[16/10] w-full shrink-0"
            >
              <ArticleImage
                src={a.image}
                alt={a.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-8">
                <CategoryBadge category={a.category} linked={false} />
                <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight font-bold text-white md:text-4xl">
                  {a.title}
                </h2>
                <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                  <span className="font-semibold text-white uppercase">
                    By {a.author}
                  </span>
                  <span>📅 {a.date}</span>
                  <span>⏱ {a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-accent"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute top-1/2 right-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-accent"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute right-8 bottom-8 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-accent' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side stories */}
      <div className="flex flex-col justify-between gap-6">
        {sideArticles.map((a) => (
          <Link key={a.id} to={`/article/${a.id}`} className="group flex gap-4">
            <ArticleImage
              compact
              src={a.image}
              alt=""
              className="h-24 w-28 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="min-w-0">
              <CategoryBadge category={a.category} linked={false} />
              <h3 className="mt-2 line-clamp-2 font-display leading-snug font-bold transition-colors group-hover:text-accent">
                {a.title}
              </h3>
              <p className="mt-2 text-[11px] text-ink/40">
                By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel
