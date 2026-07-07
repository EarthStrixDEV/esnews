# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Premium tech-news site (AI / Tech / Cloud / IT / Security) built as a single React SPA. The app lives entirely in `esnews-app/` — the repo root only holds this file and `.claude/launch.json`.

Stack: React 19 + TypeScript, Vite 6, Tailwind CSS v4, React Router v7. No backend — all content is static mock data.

## Commands

Run everything from `esnews-app/`:

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # tsc -b && vite build (this is also the type-check; there is no separate lint/test setup)
npm run preview  # serve the production build
```

There are no tests or linter configured. `npm run build` is the verification step.

### Environment constraint (important)

The machine runs **Node v22.11.0**. Vite is intentionally pinned to **v6** (`vite@^6`, `@vitejs/plugin-react@^4`) because Vite 7/8 require Node ≥22.12 and Vite 8's rolldown native binding fails to install on this setup. Do not upgrade Vite past 6 unless Node has been upgraded first. `EBADENGINE` warnings during `npm install` are expected and harmless.

### Preview server

`.claude/launch.json` at the repo root defines the `esnews-app-dev` server (uses `npm --prefix esnews-app run dev`) for the preview tools. `preview_screenshot` has been flaky (timeouts) in this project — fall back to `preview_snapshot` + `preview_eval` for verification.

## Architecture

### Data layer — mock + live with fallback

All article-consuming components read from `useNews()` (`src/context/NewsContext.tsx`), never from `data/articles.ts` directly. `NewsProvider` (wrapped around routes in `App.tsx`) starts with mock data from `src/data/articles.ts`, then swaps in live articles from NewsData.io if the fetch succeeds — so the site never renders empty when the API is down or the quota is spent.

- `src/services/newsService.ts` — fetches NewsData.io (`VITE_NEWSDATA_KEY` in `esnews-app/.env`, gitignored), maps responses into the `Article` shape (keyword-based category inference, first 3 → `featured`, first 4 → `trending`), and caches in localStorage for 30 min to stretch the 200-credit/day free quota. Live articles get `id` prefixed `live-`, plus `sourceUrl`/`sourceName` (ArticlePage shows a "Read full story" external link because the free tier only provides the description, not full body text).
- `src/data/articles.ts` — mock fallback articles and the shared type definitions. The `Category` union type, `CATEGORIES` list, and `CATEGORY_COLORS` (Tailwind class map) live here — adding a category means updating all three, plus a `--color-cat-*` token in `index.css`, plus the keyword regexes in `newsService.ts`'s `inferCategory`.
- The "Trending on Hacker News" home section is separate: `hooks/useHackerNews.ts` calls the HN Firebase API directly (no key, CORS-open).

Note: calling NewsData.io from the browser exposes the API key in the bundle — accepted for dev. The production plan is a small proxy (e.g. Cloudflare Worker) holding the key; only the URL in `newsService.ts` should need to change.

### Routing — `src/App.tsx`

All routes nest under `components/layout/Layout.tsx`, which renders TopBar, Navbar, Footer, the global `CustomCursor`, and scroll-to-top on route change around an `<Outlet />`. Routes: `/`, `/category/:slug`, `/article/:id`, `/search` (query kept in `?q=` URL param), `/contact`, and `*` → NotFound. Category/article pages render `<NotFound />` inline for unknown slugs/ids.

### Component folders

- `components/layout/` — chrome shared by every page
- `components/ui/` — small reusable pieces (CustomCursor, CategoryBadge, SectionTitle)
- `components/home/` — sections composed by `pages/Home.tsx` in visual order: TrendingStrip → HeroCarousel → AdBanner → TopStories → WhatsNew (which embeds StayConnected)
- `pages/` — one file per route

### Gotcha: nested anchors

Most article cards wrap the whole card in a React Router `<Link>`. `CategoryBadge` is itself a link by default, so when a badge sits inside a card link you **must** pass `linked={false}` (renders a `<span>`) — nested `<a>` is invalid HTML and React logs hydration errors. This bug has already been fixed once; keep the pattern.

### Styling — Tailwind v4, no config file

Tailwind is configured entirely in `src/index.css` via `@theme`: fonts (`font-display` = Bricolage Grotesque, `font-body` = Figtree, loaded from Google Fonts), palette tokens (`ink`, `paper`, `cream`, `accent`, `accent-soft`), and per-category colors (`cat-ai`, `cat-tech`, …). The Tailwind Vite plugin is registered in `vite.config.ts`; there is no `tailwind.config.js`.

The custom cursor works by setting `cursor: none` globally in `index.css` (with a `@media (hover: none)` fallback for touch), while `CustomCursor.tsx` draws a dot + trailing ring via rAF. If you add new interactive element types, the cursor's hover-grow detection matches `a, button, [role="button"]`.

Images are placeholder URLs from `picsum.photos` (seeded for stability).
