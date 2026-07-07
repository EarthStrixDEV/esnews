/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface BookmarksContextValue {
  bookmarkedIds: string[]
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null)
const STORAGE_KEY = 'esnews-bookmarks'

function initialBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(initialBookmarks)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds))
    } catch {
      // localStorage unavailable (e.g. privacy mode) — bookmarks stay session-only
    }
  }, [bookmarkedIds])

  const isBookmarked = (id: string) => bookmarkedIds.includes(id)

  const toggle = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <BookmarksContext.Provider value={{ bookmarkedIds, isBookmarked, toggle }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks(): BookmarksContextValue {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks must be used inside <BookmarksProvider>')
  return ctx
}
