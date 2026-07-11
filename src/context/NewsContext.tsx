/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  articles as mockArticles,
  type Article,
  type Category,
} from '../data/articles'
import { fetchLiveArticles } from '../services/newsService'

interface NewsContextValue {
  articles: Article[]
  /** live + mock combined — the full archive, used by the Top News list */
  allArticles: Article[]
  featured: Article[]
  trending: Article[]
  /** true once articles come from NewsData.io instead of mock data */
  isLive: boolean
  /** true while a manual refresh is in flight */
  refreshing: boolean
  /** re-fetch fresh stories, bypassing the cache; returns true on success */
  refresh: () => Promise<boolean>
  getArticle: (id: string) => Article | undefined
  getByCategory: (cat: Category) => Article[]
}

const NewsContext = createContext<NewsContextValue | null>(null)

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isLive, setIsLive] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const refreshController = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchLiveArticles(controller.signal)
      .then((live) => {
        // need enough stories to fill the layout — otherwise stay on mock
        if (live.length >= 4) {
          setArticles(live)
          setIsLive(true)
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.warn('[esnews] live news unavailable, using mock data:', err)
      })

    return () => controller.abort()
  }, [])

  const refresh = useCallback(async () => {
    refreshController.current?.abort()
    const controller = new AbortController()
    refreshController.current = controller
    setRefreshing(true)

    try {
      const live = await fetchLiveArticles(controller.signal, {
        force: true,
        paginate: true,
      })
      if (live.length >= 4) {
        setArticles(live)
        setIsLive(true)
        return true
      }
      return false
    } catch (err) {
      if (controller.signal.aborted) return false
      console.warn('[esnews] refresh failed:', err)
      return false
    } finally {
      if (refreshController.current === controller) {
        setRefreshing(false)
        refreshController.current = null
      }
    }
  }, [])

  const value = useMemo<NewsContextValue>(() => {
    const allArticles = isLive ? [...articles, ...mockArticles] : articles
    return {
      articles,
      allArticles,
      featured: articles.filter((a) => a.featured),
      trending: articles.filter((a) => a.trending),
      isLive,
      refreshing,
      refresh,
      getArticle: (id) => allArticles.find((a) => a.id === id),
      getByCategory: (cat) => articles.filter((a) => a.category === cat),
    }
  }, [articles, isLive, refreshing, refresh])

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>
}

export function useNews(): NewsContextValue {
  const ctx = useContext(NewsContext)
  if (!ctx) throw new Error('useNews must be used inside <NewsProvider>')
  return ctx
}
