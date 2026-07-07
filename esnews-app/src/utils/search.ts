import type { Article } from '../data/articles'

/** every text field a query can match against, lower-cased once */
function haystack(a: Article): string {
  return [a.title, a.excerpt, a.category, a.author, a.content.join(' ')]
    .join('  ') // separator that can't appear in content
    .toLowerCase()
}

/**
 * Turn one search term into a RegExp.
 * - `*` is a wildcard (any run of characters)
 * - every other regex metacharacter is escaped, so user input is safe
 * - a term with no `*` behaves like a plain substring match
 */
function termToRegExp(term: string): RegExp {
  const pattern = term
    .split('*')
    .map((chunk) => chunk.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(pattern, 'i')
}

export interface SearchTerm {
  raw: string
  regex: RegExp
}

/** split a raw query into terms (whitespace-separated), each compiled once */
export function parseQuery(query: string): SearchTerm[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => ({ raw, regex: termToRegExp(raw) }))
}

/**
 * An article matches when EVERY term matches somewhere in its combined text
 * (terms are AND-ed; a term may hit any field — nothing is fixed to title only).
 */
export function searchArticles(articles: Article[], query: string): Article[] {
  const terms = parseQuery(query)
  if (terms.length === 0) return []
  return articles.filter((a) => {
    const text = haystack(a)
    return terms.every((t) => t.regex.test(text))
  })
}

/**
 * Split `text` into segments, flagging which ones matched a term, so the UI can
 * highlight hits. Wildcards expand within a single word/run of characters.
 */
export interface Segment {
  text: string
  hit: boolean
}

export function highlight(text: string, terms: SearchTerm[]): Segment[] {
  if (terms.length === 0) return [{ text, hit: false }]

  // Only literal terms are highlighted. Wildcard terms (`.*`) would match
  // greedily across a whole line when split-highlighting, so we skip them —
  // they still drive filtering, just not the visual highlight.
  const literals = terms
    .filter((t) => !t.raw.includes('*'))
    .map((t) => t.raw.replace(/[.+?^${}()|[\]\\*]/g, '\\$&'))
    .filter(Boolean)
  const combined = literals.join('|')
  if (!combined) return [{ text, hit: false }]

  let re: RegExp
  try {
    re = new RegExp(`(${combined})`, 'gi')
  } catch {
    return [{ text, hit: false }]
  }

  const segments: Segment[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0
    if (start > last) segments.push({ text: text.slice(last, start), hit: false })
    if (m[0]) segments.push({ text: m[0], hit: true })
    last = start + m[0].length
  }
  if (last < text.length) segments.push({ text: text.slice(last), hit: false })
  return segments
}
