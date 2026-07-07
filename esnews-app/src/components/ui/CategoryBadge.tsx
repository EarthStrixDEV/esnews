import { Link } from 'react-router-dom'
import { CATEGORY_COLORS, type Category } from '../../data/articles'

interface Props {
  category: Category
  /** set false when the badge sits inside another <a> — nested anchors are invalid HTML */
  linked?: boolean
  className?: string
}

function CategoryBadge({ category, linked = true, className = '' }: Props) {
  const classes = `inline-block rounded px-2.5 py-1 font-display text-[11px] font-bold tracking-widest text-white uppercase ${CATEGORY_COLORS[category]} ${className}`

  if (!linked) {
    return <span className={classes}>{category}</span>
  }

  return (
    <Link
      to={`/category/${category.toLowerCase()}`}
      className={`${classes} transition-transform hover:-translate-y-0.5`}
    >
      {category}
    </Link>
  )
}

export default CategoryBadge
