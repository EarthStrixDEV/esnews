# Reader Engagement Features — Design Spec

Date: 2026-07-07
Status: Approved

## Context

esnews is a static React SPA (no backend) for tech news. A brainstorming pass against 2026 news-site UX trends (personalization without intrusive tracking, accessibility as an SEO ranking factor, content-adaptive reading experience) identified a small backlog. Dark mode was already fully implemented (`ThemeContext` + `ThemeToggle`) and is out of scope. Three features remain:

1. Reading Progress Bar
2. Bookmark / Save Article (localStorage-backed, no login)
3. Accessibility Pass (WCAG-aligned fixes across the existing app)

All three are additive, client-only, and follow existing patterns (Context + hook, `esnews-*` localStorage keys, Tailwind v4 tokens).

## 1. Reading Progress Bar

**Purpose:** show how far the reader has scrolled through an article's body — a lightweight, content-adaptive reading cue.

**Component:** `src/components/ui/ReadingProgressBar.tsx`

- Fixed `<div>` pinned to the top of the viewport (`fixed inset-x-0 top-0 z-50 h-1`), rendered only inside `ArticlePage`.
- Tracks scroll position via a `scroll` listener (passive, `useEffect` + `requestAnimationFrame`-throttled) against the article body element's bounding box — progress = how much of the *article content* (excerpt through the end of `content[]`, excluding hero and related-articles section) has scrolled past the viewport top, clamped 0–100%.
- Renders an inner `<div style={{ width: `${progress}%` }}>` using `bg-accent`, with `transition: width 100ms linear` for smoothness.
- No visual element when progress is 0 (bar still mounted at 0 width — no layout shift).

**Integration:** mounted at the top of `ArticlePage.tsx`'s returned `<article>`, measuring a ref placed on the body `<div className="mx-auto max-w-3xl px-4 py-14">` (the existing content wrapper — no restructuring needed).

**Accessibility:** `role="progressbar"` with `aria-valuenow`/`aria-valuemin={0}`/`aria-valuemax={100}` and `aria-label="Reading progress"`.

## 2. Bookmark / Save Article

**Purpose:** let readers save articles for later without login — pure client-side personalization.

**State layer:** `src/context/BookmarksContext.tsx`, following the exact shape of `ThemeContext.tsx`:

```ts
interface BookmarksContextValue {
  bookmarkedIds: string[]
  isBookmarked: (id: string) => boolean
  toggle: (id: string) => void
}
```

- localStorage key: `esnews-bookmarks`, stored as a JSON array of article id strings.
- Initial state read synchronously in `useState(initializer)` (same pattern as `initialTheme()`), guarded by `typeof window === 'undefined'`.
- `useEffect` persists to localStorage whenever `bookmarkedIds` changes.
- `toggle(id)` adds if absent, removes if present.
- Wrapped in `App.tsx` alongside the other providers: `<ThemeProvider><NewsProvider><BookmarksProvider><PlayerProvider>...`. Bookmarks only need article ids, not `useNews()`, so it doesn't need to sit inside `NewsProvider` — placed after `NewsProvider` for consistency with provider-nesting order but has no dependency on it.

**UI — bookmark button:** `src/components/ui/BookmarkButton.tsx`

- Props: `{ articleId: string; className?: string }`.
- Icon-only button (☆/★ or outline/filled bookmark icon consistent with existing icon usage — check `ListenButton` for the icon pattern already used in the codebase and match it).
- `onClick` calls `toggle(articleId)`; stops propagation (`e.preventDefault(); e.stopPropagation()`) since it will sit inside card `<Link>` wrappers, same nested-interactive-element concern noted in CLAUDE.md for `CategoryBadge`.
- `aria-pressed={isBookmarked(articleId)}` and `aria-label` toggling between "Save article" / "Remove bookmark".

**Placement:**
- `ArticlePage.tsx`: next to `ListenButton` in the body section.
- Article cards (home sections, category page, search results, top news): add `BookmarkButton` in the corner of each card. Scope note: apply to the shared card component(s) actually reused across these lists rather than duplicating per-page — identify the common card component during planning; do not touch one-off layouts not already shared.

**New page:** `src/pages/BookmarksPage.tsx`, route `/bookmarks` in `App.tsx`.

- Reads `bookmarkedIds` from `useBookmarks()` and resolves each to a full `Article` via `useNews().getArticle(id)`, filtering out any `undefined` (e.g. a bookmarked live article that's since rotated out of the cache).
- Empty state: friendly message + link back to `/` when `bookmarkedIds` is empty or resolves to zero articles.
- Reuses the existing article-card grid layout/styles used elsewhere (e.g. category page grid) rather than inventing a new layout.

**Navigation:** add a "Bookmarks" link in `Navbar` (or `TopBar`, matching wherever `/search` or similar utility links live) pointing to `/bookmarks`.

## 3. Accessibility Pass

**Purpose:** bring the existing app closer to WCAG 2.1 AA, both because it's overdue and because Google's 2026 ranking factors include an accessibility score.

Scope — audit and fix across the existing app, no new components:

- **Color contrast:** check text/background combinations against the `index.css` `@theme` tokens (`ink`, `paper`, `cream`, `accent`, `accent-soft`, `cat-*`) for 4.5:1 (normal text) / 3:1 (large text, UI components). Fix any token usage that fails — prefer adjusting the specific low-contrast usage over changing shared tokens broadly, since tokens are used site-wide.
- **Icon-only buttons:** every icon-only interactive element (theme toggle, bookmark button, listen/player controls, search icon, mobile menu toggle, etc.) must have an `aria-label` or visible accessible text. Audit `components/ui/` and `components/layout/` for existing gaps, not just the new `BookmarkButton`.
- **Keyboard navigation:** all interactive elements (cards wrapped in `<Link>`, custom buttons, the custom cursor's hover targets) must be reachable and operable via keyboard — verify visible `:focus-visible` states exist (Tailwind's default focus ring or a custom one) since `cursor: none` is set globally and must not remove focus indication.
- **Image alt text:** audit `ArticleImage` usages for meaningful `alt` (article hero/detail images should describe the article; decorative/related-article thumbnails already using `alt=""` are correct and should stay that way).
- **Heading order:** verify each page has a single logical heading hierarchy (one `h1` per page, no skipped levels) — likely most relevant on `ArticlePage`, `CategoryPage`, `Home`.
- **New progress bar & bookmark button:** must themselves meet the same bar (already specified above) — called out here so the accessibility pass includes reviewing the two new features, not just pre-existing code.

Out of scope: screen-reader-only live regions, full WCAG AAA, automated axe-core test tooling (no test runner exists in this project per CLAUDE.md — this is a manual/inline fix pass, not a new testing framework).

## Data Flow Summary

```
BookmarksProvider (localStorage: esnews-bookmarks)
  └─ useBookmarks() → BookmarkButton (cards, ArticlePage)
  └─ useBookmarks() + useNews() → BookmarksPage (/bookmarks)

ArticlePage
  └─ ReadingProgressBar (scroll-derived, no shared state)

Accessibility pass: cross-cutting edits to existing components, no new state.
```

## Error Handling

- `BookmarksProvider`: if `localStorage.getItem` throws (e.g. privacy mode) or JSON parse fails, fall back to an empty array — never crash the app over bookmark persistence.
- `BookmarksPage`: bookmarked ids with no matching article (stale live-article id) are silently filtered out, not shown as broken cards.
- `ReadingProgressBar`: if the measured element has zero height (e.g. very short article), clamp progress to 100 rather than dividing by zero / producing `NaN`.

## Testing

No test runner is configured in this project (`npm run build` — i.e. `tsc -b && vite build` — is the verification step per CLAUDE.md). Verification for this work is:

- Type-check clean via `npm run build`.
- Manual verification in the dev preview: toggle bookmarks on cards and the article page, confirm persistence across reload, confirm `/bookmarks` reflects state and handles the empty state, confirm the progress bar advances while scrolling an article, and spot-check keyboard-only navigation + focus visibility on the new controls.

## Out of Scope

- Dark mode (already implemented).
- Any backend/account-based sync of bookmarks across devices.
- Automated accessibility testing tooling (axe, Lighthouse CI) — manual pass only.
- Reading history / "recently viewed" tracking (was considered during brainstorming, not selected).
