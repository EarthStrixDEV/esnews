import type { Article, Category } from '../data/articles'

const API_KEY = import.meta.env.VITE_NEWSDATA_KEY as string | undefined
const ENDPOINT = 'https://newsdata.io/api/1/latest'
const CACHE_KEY = 'esnews-live-v1'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min — stretches the 200-credit/day quota

interface NewsDataItem {
  article_id: string
  title: string
  link: string
  description: string | null
  pubDate: string
  image_url: string | null
  source_id: string
  source_name?: string
  creator: string[] | null
}

interface NewsDataResponse {
  status: string
  results?: NewsDataItem[]
  nextPage?: string
}

// page token from the last response, so Refresh pulls the *next* batch of
// stories instead of re-showing the same ones
let nextPageToken: string | null = null

/** keyword-based mapping into our five fixed categories */
function inferCategory(text: string): Category {
  const t = text.toLowerCase()
  if (/\b(ai|artificial intelligence|llm|gpt|claude|gemini|machine learning|neural|openai|anthropic|chatbot)\b/.test(t)) return 'AI'
  if (/\b(cloud|aws|azure|google cloud|kubernetes|serverless|saas|datacenter|data center)\b/.test(t)) return 'Cloud'
  if (/\b(security|breach|hack|ransomware|malware|phishing|vulnerabilit|cyberattack|zero-day)\b/.test(t)) return 'Security'
  if (/\b(enterprise|software|developer|programming|database|linux|windows|server|network)\b/.test(t)) return 'IT'
  return 'Tech'
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length
  return `${Math.max(2, Math.round(words / 40))} min read`
}

function toArticle(item: NewsDataItem, index: number): Article {
  const description =
    item.description ?? 'Read the full story at the original source.'
  const date = new Date(item.pubDate.replace(' ', 'T') + 'Z')

  return {
    id: `live-${item.article_id}`,
    title: item.title,
    excerpt: description,
    category: inferCategory(`${item.title} ${description}`),
    author: item.creator?.[0] ?? item.source_name ?? item.source_id,
    date: isNaN(date.getTime())
      ? item.pubDate
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
    readTime: estimateReadTime(description),
    publishedAt: isNaN(date.getTime()) ? undefined : date.toISOString(),
    image:
      item.image_url ??
      `https://picsum.photos/seed/${encodeURIComponent(item.article_id)}/1200/800`,
    content: [description],
    sourceUrl: item.link,
    sourceName: item.source_name ?? item.source_id,
    featured: index < 3,
    trending: index < 4,
  }
}

function readCache(): Article[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { ts, articles } = JSON.parse(raw) as { ts: number; articles: Article[] }
    if (Date.now() - ts > CACHE_TTL_MS) return null
    return articles
  } catch {
    return null
  }
}

function writeCache(articles: Article[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), articles }))
  } catch {
    /* storage full or unavailable — cache is best-effort */
  }
}

/**
 * @param force  skip the 30-min cache (used by the Refresh button)
 * @param paginate  request the next page token so Refresh returns fresh stories
 */
export async function fetchLiveArticles(
  signal?: AbortSignal,
  { force = false, paginate = false }: { force?: boolean; paginate?: boolean } = {},
): Promise<Article[]> {
  if (!API_KEY) throw new Error('VITE_NEWSDATA_KEY is not set')

  if (!force) {
    const cached = readCache()
    if (cached) return cached
  }

  let url = `${ENDPOINT}?apikey=${API_KEY}&language=en&category=technology&size=10`
  if (paginate && nextPageToken) url += `&page=${nextPageToken}`

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`NewsData responded ${res.status}`)

  const data: NewsDataResponse = await res.json()
  if (data.status !== 'success' || !data.results?.length) {
    throw new Error('NewsData returned no results')
  }

  // wrap around to the first page once the free tier runs out of pages
  nextPageToken = data.nextPage ?? null

  const articles = data.results
    .filter((it) => it.title && it.link)
    .map(toArticle)

  writeCache(articles)
  return articles
}
