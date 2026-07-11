import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="grid min-h-[60svh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">
          This story doesn't exist
        </h1>
        <p className="mt-2 text-ink/50">
          The page you're looking for was moved, removed, or never published.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-display text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
