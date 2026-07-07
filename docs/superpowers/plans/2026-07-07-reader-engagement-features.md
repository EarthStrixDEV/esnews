# Reader Engagement Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reading-progress bar, localStorage-backed article bookmarking (with a `/bookmarks` page), and an accessibility cleanup pass to the esnews SPA.

**Architecture:** Two new client-only React Contexts follow the existing `ThemeContext` pattern (localStorage-synced `useState`, provider wraps `App.tsx`, consumer hook throws outside provider). Two new presentational components (`ReadingProgressBar`, `BookmarkButton`) plug into existing pages. One new route/page (`BookmarksPage`) resolves saved ids against `useNews()`. The accessibility pass is a set of targeted edits to existing files — no new components.

**Tech Stack:** React 19 + TypeScript, Vite 6, Tailwind CSS v4 (`@theme` tokens in `src/index.css`), React Router v7. No test runner — `npm run build` (`tsc -b && vite build`) is the verification step.

## Global Constraints

- No backend, no login — all persistence is localStorage only.
- Follow the existing Context pattern exactly (see `src/context/ThemeContext.tsx`): `createContext<T | null>(null)`, a `use*` hook that throws if used outside its provider, `/* eslint-disable react-refresh/only-export-components */` at the top of the file since the file exports both the provider component and the hook.
- localStorage keys use the `esnews-*` prefix (existing key: `esnews-theme`).
- Nested-anchor rule: any interactive element placed inside a `<Link>`-wrapped card must not itself render an `<a>` — use a `<button>` with `preventDefault`/`stopPropagation` (see `CategoryBadge`'s `linked={false}` pattern for prior art on this constraint).
- Icon-only interactive elements require `aria-label` (existing precedent: `Navbar`'s search link and menu button already do this).
- `npm run build` must pass (this is both the type-check and the only verification command in this project) after every task.
- No test runner exists in this project — "tests" in this plan are manual verification steps in the dev preview, not automated test files.

---

## File Structure

- Create: `esnews-app/src/context/BookmarksContext.tsx` — `BookmarksProvider` + `useBookmarks()` hook, localStorage-synced array of article ids.
- Create: `esnews-app/src/components/ui/BookmarkButton.tsx` — icon-only toggle button, consumes `useBookmarks()`.
- Create: `esnews-app/src/components/ui/ReadingProgressBar.tsx` — fixed progress bar, takes a `ref` to measure.
- Create: `esnews-app/src/pages/BookmarksPage.tsx` — `/bookmarks` route, resolves ids via `useNews().getArticle`.
- Modify: `esnews-app/src/App.tsx` — add `BookmarksProvider` and `/bookmarks` route.
- Modify: `esnews-app/src/pages/ArticlePage.tsx` — mount `ReadingProgressBar`, add `BookmarkButton` next to `ListenButton`.
- Modify: `esnews-app/src/pages/CategoryPage.tsx` — add `BookmarkButton` to each card.
- Modify: `esnews-app/src/components/layout/Navbar.tsx` — add a Bookmarks nav link (desktop + mobile menu).
- Modify (accessibility pass, Task 6): `esnews-app/src/components/ui/CustomCursor.tsx`, `esnews-app/src/components/ui/MiniPlayer.tsx`, `esnews-app/src/components/ui/RefreshButton.tsx`, `esnews-app/src/components/ui/Pagination.tsx`, `esnews-app/src/components/ui/DateFilter.tsx`, `esnews-app/src/index.css` — audited and fixed in place, exact edits determined during the task (see Task 6 for the checklist).

---

## Task 1: BookmarksContext

**Files:**
- Create: `esnews-app/src/context/BookmarksContext.tsx`

**Interfaces:**
- Produces: `BookmarksProvider({ children }: { children: ReactNode })`, `useBookmarks(): { bookmarkedIds: string[]; isBookmarked: (id: string) => boolean; toggle: (id: string) => void }`

- [ ] **Step 1: Write the context file**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors (this file isn't wired into the app yet, so it's checked as dead code — `tsc` still type-checks unreferenced files that are part of the `src` program).

- [ ] **Step 3: Commit**

```bash
git add esnews-app/src/context/BookmarksContext.tsx
git commit -m "feat: add BookmarksContext for localStorage-backed article bookmarks"
```

---

## Task 2: Wire BookmarksProvider into App

**Files:**
- Modify: `esnews-app/src/App.tsx`

**Interfaces:**
- Consumes: `BookmarksProvider` from Task 1 (`esnews-app/src/context/BookmarksContext.tsx`).

- [ ] **Step 1: Add the import and wrap the provider tree**

In `esnews-app/src/App.tsx`, add the import next to the other context imports:

```tsx
import { BookmarksProvider } from './context/BookmarksContext'
```

Wrap `<PlayerProvider>` with `<BookmarksProvider>`, nested inside `NewsProvider`:

```tsx
function App() {
  return (
    <ThemeProvider>
      <NewsProvider>
        <BookmarksProvider>
          <PlayerProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<TopNewsPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </PlayerProvider>
        </BookmarksProvider>
      </NewsProvider>
    </ThemeProvider>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds — `BookmarksProvider` now used, no unused-import errors.

- [ ] **Step 3: Commit**

```bash
git add esnews-app/src/App.tsx
git commit -m "feat: wire BookmarksProvider into the app"
```

---

## Task 3: BookmarkButton component

**Files:**
- Create: `esnews-app/src/components/ui/BookmarkButton.tsx`

**Interfaces:**
- Consumes: `useBookmarks()` from Task 1 — `{ isBookmarked(id), toggle(id) }`.
- Produces: `BookmarkButton({ articleId, className }: { articleId: string; className?: string })`, a default export, usable both standalone (`ArticlePage`) and nested inside a `<Link>`-wrapped card (`CategoryPage`).

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add esnews-app/src/components/ui/BookmarkButton.tsx
git commit -m "feat: add BookmarkButton component"
```

---

## Task 4: ReadingProgressBar component + ArticlePage integration

**Files:**
- Create: `esnews-app/src/components/ui/ReadingProgressBar.tsx`
- Modify: `esnews-app/src/pages/ArticlePage.tsx`

**Interfaces:**
- Produces: `ReadingProgressBar({ targetRef }: { targetRef: RefObject<HTMLElement | null> })`, a default export. Measures scroll progress through the referenced element.
- Consumes (in `ArticlePage.tsx`): `BookmarkButton` from Task 3 (`articleId` prop).

- [ ] **Step 1: Write the ReadingProgressBar component**

```tsx
import { useEffect, useState, type RefObject } from 'react'

interface Props {
  targetRef: RefObject<HTMLElement | null>
}

function ReadingProgressBar({ targetRef }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const measure = () => {
      ticking = false
      const el = targetRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) {
        setProgress(100)
        return
      }

      const scrolled = -rect.top
      const pct = (scrolled / total) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [targetRef])

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
    >
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgressBar
```

- [ ] **Step 2: Type-check the new file**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 3: Integrate into ArticlePage**

In `esnews-app/src/pages/ArticlePage.tsx`, add imports:

```tsx
import { useRef } from 'react'
import ReadingProgressBar from '../components/ui/ReadingProgressBar'
import BookmarkButton from '../components/ui/BookmarkButton'
```

Add a ref and mount the progress bar, and place the bookmark button next to `ListenButton`. The body wrapper currently reads:

```tsx
function ArticlePage() {
  const { id } = useParams()
  const { articles, getArticle } = useNews()
  const article = id ? getArticle(id) : undefined

  if (!article) return <NotFound />
```

Change to:

```tsx
function ArticlePage() {
  const { id } = useParams()
  const { articles, getArticle } = useNews()
  const article = id ? getArticle(id) : undefined
  const bodyRef = useRef<HTMLDivElement>(null)

  if (!article) return <NotFound />
```

Then wrap the return in a fragment with the progress bar, and add the ref to the body wrapper div and the bookmark button next to the listen button:

```tsx
  return (
    <>
      <ReadingProgressBar targetRef={bodyRef} />
      <article>
        {/* Hero */}
        <div className="relative">
          {/* ...unchanged... */}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="mx-auto max-w-3xl px-4 py-14">
          <div className="mb-8 flex items-center gap-3">
            <ListenButton articles={[article]} label="Listen to this story" />
            <BookmarkButton articleId={article.id} />
          </div>
          {/* ...rest unchanged... */}
        </div>

        {/* Related */}
        {/* ...unchanged... */}
      </article>
    </>
  )
```

(Only the outer wrapper, the `bodyRef` addition, and the `mb-8` row change — the hero, paragraph rendering, source link, tags, and related-articles sections keep their existing JSX exactly as-is.)

- [ ] **Step 4: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 5: Manual verification**

Run: `npm --prefix esnews-app run dev`, open an article page in the browser.
Expected: a thin accent-colored bar appears fixed at the very top of the viewport and fills left-to-right as you scroll through the article body; it reaches 100% by the time you reach the bottom of the body text (before the related-articles section, since only the body div is measured). The bookmark star toggles between ☆ and ★ on click, next to the Listen button.

- [ ] **Step 6: Commit**

```bash
git add esnews-app/src/components/ui/ReadingProgressBar.tsx esnews-app/src/pages/ArticlePage.tsx
git commit -m "feat: add reading progress bar and bookmark button to ArticlePage"
```

---

## Task 5: BookmarksPage, route, and CategoryPage/Navbar integration

**Files:**
- Create: `esnews-app/src/pages/BookmarksPage.tsx`
- Modify: `esnews-app/src/App.tsx`
- Modify: `esnews-app/src/pages/CategoryPage.tsx`
- Modify: `esnews-app/src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `useBookmarks()` (Task 1), `useNews().getArticle(id)` (existing, returns `Article | undefined`), `BookmarkButton` (Task 3).

- [ ] **Step 1: Write BookmarksPage**

```tsx
import { Link } from 'react-router-dom'
import { useNews } from '../context/NewsContext'
import { useBookmarks } from '../context/BookmarksContext'
import CategoryBadge from '../components/ui/CategoryBadge'
import ArticleImage from '../components/ui/ArticleImage'
import BookmarkButton from '../components/ui/BookmarkButton'

function BookmarksPage() {
  const { getArticle } = useNews()
  const { bookmarkedIds } = useBookmarks()

  const items = bookmarkedIds
    .map((id) => getArticle(id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10 border-b border-ink/10 pb-8">
        <p className="font-display text-xs font-bold tracking-[0.3em] text-accent uppercase">
          Your Library
        </p>
        <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">
          Bookmarks
        </h1>
        <p className="mt-3 text-ink/50">
          {items.length} {items.length === 1 ? 'story' : 'stories'} saved
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-ink/60">
          No bookmarks yet. Browse the{' '}
          <Link to="/" className="font-semibold text-accent hover:underline">
            homepage
          </Link>{' '}
          and tap the ☆ on any story to save it here.
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <div key={a.id} className="group relative">
              <Link to={`/article/${a.id}`}>
                <div className="overflow-hidden rounded-xl">
                  <ArticleImage
                    src={a.image}
                    alt=""
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4">
                  <CategoryBadge category={a.category} linked={false} />
                  <h2 className="mt-3 line-clamp-2 font-display text-xl leading-snug font-bold transition-colors group-hover:text-accent">
                    {a.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>
                  <p className="mt-3 text-xs text-ink/40">
                    By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date} · {a.readTime}
                  </p>
                </div>
              </Link>
              <BookmarkButton
                articleId={a.id}
                className="absolute top-3 right-3"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
```

- [ ] **Step 2: Register the route**

In `esnews-app/src/App.tsx`, add the import:

```tsx
import BookmarksPage from './pages/BookmarksPage'
```

Add the route inside `<Route element={<Layout />}>`, after `/search`:

```tsx
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/contact" element={<ContactPage />} />
```

- [ ] **Step 3: Add BookmarkButton to CategoryPage cards**

In `esnews-app/src/pages/CategoryPage.tsx`, add the import:

```tsx
import BookmarkButton from '../components/ui/BookmarkButton'
```

Change the card wrapper from a bare `<Link>` to a `relative`-positioned wrapper with the button layered on top (same pattern as `BookmarksPage`):

```tsx
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="group relative">
            <Link to={`/article/${a.id}`}>
              <div className="overflow-hidden rounded-xl">
                <ArticleImage
                  src={a.image}
                  alt=""
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-4">
                <CategoryBadge category={a.category} linked={false} />
                <h2 className="mt-3 line-clamp-2 font-display text-xl leading-snug font-bold transition-colors group-hover:text-accent">
                  {a.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60">{a.excerpt}</p>
                <p className="mt-3 text-xs text-ink/40">
                  By <span className="font-semibold text-ink/60 uppercase">{a.author}</span> · {a.date} · {a.readTime}
                </p>
              </div>
            </Link>
            <BookmarkButton articleId={a.id} className="absolute top-3 right-3" />
          </div>
        ))}
      </div>
```

(The `key` moves from `<Link>` to the new outer `<div>`; everything inside `<Link>` is unchanged.)

- [ ] **Step 4: Add a Bookmarks link to Navbar**

In `esnews-app/src/components/layout/Navbar.tsx`, add the desktop nav link after `/news` and before the category links:

```tsx
          <NavLink to="/news" className={linkClass}>
            Top News
          </NavLink>
          <NavLink to="/bookmarks" className={linkClass}>
            Bookmarks
          </NavLink>
```

And the corresponding mobile menu link, after the mobile `/news` link:

```tsx
            <NavLink to="/news" className={linkClass} onClick={() => setOpen(false)}>
              Top News
            </NavLink>
            <NavLink to="/bookmarks" className={linkClass} onClick={() => setOpen(false)}>
              Bookmarks
            </NavLink>
```

- [ ] **Step 5: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 6: Manual verification**

Run: `npm --prefix esnews-app run dev`.
Expected: "Bookmarks" appears in the desktop navbar and the mobile menu, linking to `/bookmarks`. With no bookmarks saved, `/bookmarks` shows the empty state with a working link back to `/`. Bookmarking a story from a category page, then visiting `/bookmarks`, shows that story; unbookmarking it from either the category page or `/bookmarks` removes it after a refresh of `/bookmarks`. Reloading the page preserves bookmarks (localStorage persistence).

- [ ] **Step 7: Commit**

```bash
git add esnews-app/src/pages/BookmarksPage.tsx esnews-app/src/App.tsx esnews-app/src/pages/CategoryPage.tsx esnews-app/src/components/layout/Navbar.tsx
git commit -m "feat: add /bookmarks page and wire bookmark button into CategoryPage and nav"
```

---

## Task 6: Accessibility pass

**Files:**
- Modify: `esnews-app/src/components/ui/CustomCursor.tsx`
- Modify: `esnews-app/src/components/ui/MiniPlayer.tsx`
- Modify: `esnews-app/src/components/ui/RefreshButton.tsx`
- Modify: `esnews-app/src/components/ui/Pagination.tsx`
- Modify: `esnews-app/src/components/ui/DateFilter.tsx`
- Modify: `esnews-app/src/index.css` (only if a contrast fix from Step 1 requires a token-level change)

**Interfaces:**
- No new interfaces — this task only edits existing components' JSX attributes and, if needed, `index.css` token values. No component signatures change.

This task is an audit-and-fix pass, not a fixed diff — read each file first, then apply the specific fix from the checklist below that applies to it. Work through the files in order.

- [ ] **Step 1: Read and audit each file against this checklist**

Read `esnews-app/src/components/ui/CustomCursor.tsx`, `esnews-app/src/components/ui/MiniPlayer.tsx`, `esnews-app/src/components/ui/RefreshButton.tsx`, `esnews-app/src/components/ui/Pagination.tsx`, and `esnews-app/src/components/ui/DateFilter.tsx`. For each icon-only `<button>` or `<a>` (an interactive element whose only content is an emoji, SVG, or single glyph — no visible text), check:

1. Does it have `aria-label` (or visible text)? If not, add one describing the action (e.g. `aria-label="Play"`, `aria-label="Refresh articles"`, `aria-label="Next page"`).
2. Does it rely on `:hover` alone to show as interactive, with no `:focus-visible` state? Since `esnews-app/src/index.css` sets `cursor: none` globally (per the custom cursor), keyboard focus must remain visible without a mouse cursor as a fallback cue — if an element has a hover-only style (e.g. `hover:text-accent` with no focus equivalent), add a matching `focus-visible:` variant of the same style, e.g. `hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`.

For `CustomCursor.tsx` specifically: this component only draws the visual cursor; it doesn't own the hover targets it responds to. No change needed inside `CustomCursor.tsx` itself unless it renders any interactive element (verify by reading it — if it only renders decorative dot/ring `<div>`s with no `<button>`/`<a>`, skip it after confirming).

- [ ] **Step 2: Fix contrast on any low-contrast token usage found**

Read `esnews-app/src/index.css` and note the `@theme` color values for `ink`, `paper`, `cream`, `accent`, `accent-soft`, and the `cat-*` tokens. Cross-reference against any text/background pairing used at low opacity (e.g. `text-ink/40`, `text-ink/50`) on top of `bg-cream` or `bg-paper` seen across the files touched in Step 1 and in `ArticlePage.tsx`/`CategoryPage.tsx`/`BookmarksPage.tsx` from Tasks 4–5. Compute or estimate contrast ratio; anything below 4.5:1 for body text needs its opacity/color raised (e.g. `text-ink/40` → `text-ink/55`) at the specific usage site — do not change the shared `ink` token itself, since it's used site-wide and a global change has a much larger blast radius than this task's scope.

If no failing usages are found, state that explicitly rather than making speculative changes — this step is a check, not a mandate to change something.

- [ ] **Step 3: Verify heading order on the three pages touched by this plan**

Read `esnews-app/src/pages/ArticlePage.tsx`, `esnews-app/src/pages/CategoryPage.tsx`, `esnews-app/src/pages/BookmarksPage.tsx`. Confirm each has exactly one `h1` (ArticlePage's article title, CategoryPage's category name, BookmarksPage's "Bookmarks" title) and that any subheadings (e.g. "More in {category}" in ArticlePage) use `h2`, not `h1` or a skipped level. These three pages were written correctly in this plan already (ArticlePage's related-section heading is already `h2`; CategoryPage's and BookmarksPage's card titles are already `h2`) — this step is a verification read, not expected to require edits, but fix if a mismatch is found.

- [ ] **Step 4: Verify ArticleImage alt text usage is correct**

Read `esnews-app/src/components/ui/ArticleImage.tsx` and its call sites touched in this plan (`ArticlePage.tsx` hero image, `CategoryPage.tsx` and `BookmarksPage.tsx` card thumbnails). Confirm: the `ArticlePage` hero image uses a meaningful `alt` (it already does — `alt={article.title}`), and card thumbnails intentionally use `alt=""` because the adjacent heading already names the article (existing, correct pattern per `CLAUDE.md`) — no change needed, this is a confirmation step.

- [ ] **Step 5: Type-check**

Run: `npm --prefix esnews-app run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 6: Manual verification**

Run: `npm --prefix esnews-app run dev`. Using keyboard only (Tab/Shift+Tab, Enter/Space), navigate through the navbar, an article page's Listen/Bookmark buttons, a category page's bookmark buttons, and any player/refresh/pagination controls present on the page you're testing. Expected: every interactive element receives a visible focus indicator (outline or color change) as you Tab through it, and every icon-only control's purpose is announced (verify via the `aria-label` attribute in the DOM inspector, or a screen reader if available).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: accessibility pass — aria-labels, focus-visible states, contrast"
```

---

## Self-Review Notes

- **Spec coverage:** Reading Progress Bar → Task 4. Bookmark/Save Article + `/bookmarks` page → Tasks 1, 2, 3, 5. Accessibility Pass → Task 6 (contrast, icon-label audit, keyboard focus, alt text, heading order all covered). Error handling from the spec (localStorage failure fallback, stale-id filtering, zero-height clamp) is implemented directly in Tasks 1 and 4's code, not deferred.
- **Placeholder scan:** no TBD/TODO; every step has complete code or a fully specified manual-verification procedure.
- **Type consistency:** `useBookmarks()` returns `{ bookmarkedIds, isBookmarked, toggle }` in Task 1 and is consumed with exactly those names in Tasks 3 and 5. `BookmarkButton` takes `{ articleId, className }` in Task 3 and is called with those exact prop names in Tasks 4 and 5. `ReadingProgressBar` takes `{ targetRef }` in Task 4 and is called with `targetRef={bodyRef}` in the same task.
