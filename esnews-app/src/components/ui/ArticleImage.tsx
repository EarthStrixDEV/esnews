import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  /** icon-only fallback for small thumbnails where the label doesn't fit */
  compact?: boolean
}

/**
 * <img> with a shimmer skeleton while loading and a styled "Image Not Found"
 * placeholder when the source fails — live NewsData image URLs break regularly.
 *
 * The passed className controls the box (size, aspect, rounding, hover-scale)
 * and is applied to a wrapper; the inner <img> just fills it with object-cover.
 * This keeps every call site's layout intact whether the parent sizes the box
 * (hero h-full) or the class does (aspect-[16/10], rounded-full).
 */
function ArticleImage({ compact = false, className = '', alt = '', src, ...rest }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // reset state whenever the source changes (e.g. mock → live swap)
  useEffect(() => {
    setFailed(false)
    setLoaded(false)
    // image may already be cached & complete before onLoad can fire
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* shimmer skeleton — visible until the image loads or fails */}
      {!loaded && !failed && <div className="img-skeleton absolute inset-0" />}

      {/* fallback placeholder */}
      {failed && (
        <div
          role="img"
          aria-label="Image not found"
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-cream to-accent-soft"
        >
          <svg
            className={compact ? 'h-5 w-5 text-accent/50' : 'h-8 w-8 text-accent/50'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            <circle cx="9" cy="9" r="1.8" />
            <path d="m21 15-3.5-3.5a1.5 1.5 0 0 0-2.1 0L7 20" />
            <path d="m3.5 3.5 17 17" />
          </svg>
          {!compact && (
            <span className="font-display text-[10px] font-bold tracking-[0.18em] text-ink/35 uppercase">
              Image Not Found
            </span>
          )}
        </div>
      )}

      {/* the image fades in once loaded */}
      {!failed && (
        <img
          {...rest}
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default ArticleImage
