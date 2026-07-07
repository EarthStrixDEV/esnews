import { useEffect, useState } from 'react'

const HN_API = 'https://hacker-news.firebaseio.com/v0'

export interface HNStory {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  descendants: number
}

interface State {
  stories: HNStory[]
  loading: boolean
  error: string | null
}

export function useHackerNews(count = 6): State {
  const [state, setState] = useState<State>({
    stories: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const ids: number[] = await fetch(`${HN_API}/topstories.json`, {
          signal: controller.signal,
        }).then((r) => {
          if (!r.ok) throw new Error(`HN API responded ${r.status}`)
          return r.json()
        })

        // fetch a few extra so we can drop non-story items (jobs, dead links)
        const items = await Promise.all(
          ids.slice(0, count + 4).map((id) =>
            fetch(`${HN_API}/item/${id}.json`, { signal: controller.signal })
              .then((r) => r.json())
              .catch(() => null),
          ),
        )

        const stories = items
          .filter((it): it is HNStory => Boolean(it && it.title && it.score))
          .slice(0, count)

        setState({ stories, loading: false, error: null })
      } catch (err) {
        if (controller.signal.aborted) return
        setState({
          stories: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load',
        })
      }
    }

    load()
    return () => controller.abort()
  }, [count])

  return state
}

export function timeAgo(unixSeconds: number): string {
  const diff = Math.floor(Date.now() / 1000 - unixSeconds)
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function domainOf(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}
