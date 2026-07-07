import { Link } from 'react-router-dom'

interface Props {
  page: number
  totalPages: number
  /** builds the target URL for a given page number */
  makeLink: (page: number) => string
}

function Pagination({ page, totalPages, makeLink }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const navClass = (disabled: boolean) =>
    `grid h-10 w-10 place-items-center rounded-lg font-display font-bold transition-colors ${
      disabled
        ? 'pointer-events-none text-ink/20'
        : 'text-ink hover:bg-accent hover:text-white'
    }`

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <Link to={makeLink(page - 1)} aria-label="Previous page" className={navClass(page <= 1)}>
        ←
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          to={makeLink(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`grid h-10 w-10 place-items-center rounded-lg font-display font-bold transition-colors ${
            p === page
              ? 'bg-accent text-white'
              : 'bg-cream text-ink hover:bg-accent hover:text-white'
          }`}
        >
          {p}
        </Link>
      ))}
      <Link to={makeLink(page + 1)} aria-label="Next page" className={navClass(page >= totalPages)}>
        →
      </Link>
    </nav>
  )
}

export default Pagination
