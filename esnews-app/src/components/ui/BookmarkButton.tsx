import { useBookmarks } from '../../context/BookmarksContext'

interface Props {
  articleId: string
  className?: string
}

function BookmarkButton({ articleId, className = '' }: Props) {
  const { isBookmarked, toggle } = useBookmarks()
  const bookmarked = isBookmarked(articleId)

  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(articleId)
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors ${
        bookmarked ? 'bg-accent text-white' : 'bg-white/80 text-ink hover:text-accent'
      } ${className}`}
    >
      {bookmarked ? '★' : '☆'}
    </button>
  )
}

export default BookmarkButton
