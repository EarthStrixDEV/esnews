import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CATEGORIES } from '../../data/articles'
import ThemeToggle from '../ui/ThemeToggle'

function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-display text-[15px] font-semibold transition-colors ${
      isActive ? 'text-accent' : 'text-ink hover:text-accent'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-xl font-extrabold text-white">
            e
          </span>
          <div className="leading-none">
            <span className="font-display text-2xl font-extrabold tracking-tight">
              esnews
            </span>
            <p className="mt-0.5 text-[10px] tracking-[0.3em] text-ink/50 uppercase">
              ai · tech · cloud
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/news" className={linkClass}>
            Top News
          </NavLink>
          {CATEGORIES.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className={linkClass}
            >
              {cat}
            </NavLink>
          ))}
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/search"
            aria-label="Search"
            className={({ isActive }) =>
              `hidden transition-colors hover:text-accent sm:block ${
                isActive ? 'text-accent' : 'text-ink/60'
              }`
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </NavLink>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="text-ink lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/news" className={linkClass} onClick={() => setOpen(false)}>
              Top News
            </NavLink>
            {CATEGORIES.map((cat) => (
              <NavLink
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {cat}
              </NavLink>
            ))}
            <NavLink to="/search" className={linkClass} onClick={() => setOpen(false)}>
              Search
            </NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
