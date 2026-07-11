import type { Article } from '../../data/articles'
import { usePlayer } from '../../context/PlayerContext'

interface Props {
  articles: Article[]
  label: string
  className?: string
}

function ListenButton({ articles, label, className = '' }: Props) {
  const { supported, playArticles } = usePlayer()

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={() => playArticles(articles)}
      className={`inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-sm font-bold text-white transition-transform hover:-translate-y-0.5 ${className}`}
    >
      🎧 {label}
    </button>
  )
}

export default ListenButton
