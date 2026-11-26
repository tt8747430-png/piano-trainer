import { Fragment, type ReactNode } from 'react'
import { PAGE, PAGE_STRETCH } from '@/shared/lib'

/** What a page holds, top down: a system, or a heading with the system under it, kept together. */
interface PageBlock {
  readonly key: string
  readonly content: ReactNode
}

/**
 * An A4 page of a score as it prints (ADR 0096), its number at its foot. A page that is not the last
 * is filled to its height (ADR 0087), as LilyPond's and MuseScore's are: the gaps between its blocks
 * grow alike until its last system meets the bottom margin, each by `PAGE_STRETCH` at most; the last
 * page is left ragged.
 */
export function SheetPage({
  number,
  label,
  filled,
  gap,
  blocks,
}: {
  /** Its number, from 1. */
  number: number
  /** What a screen reader calls it. */
  label?: string | undefined
  /** Spread down to its bottom margin: every page but the last. */
  filled: boolean
  /** The room between blocks before any is spread, in CSS px. */
  gap: number
  blocks: readonly PageBlock[]
}) {
  return (
    <article
      aria-label={label}
      data-slot="sheet-page"
      className="relative flex flex-col bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
      style={{ width: PAGE.width, minHeight: PAGE.height, padding: PAGE.margin }}
    >
      {blocks.map((block, index) => (
        <Fragment key={block.key}>
          {index > 0 ? (
            <div
              aria-hidden
              data-slot="page-gap"
              style={{
                flexGrow: filled ? 1 : 0,
                flexShrink: 0,
                flexBasis: gap,
                maxHeight: gap + PAGE_STRETCH,
              }}
            />
          ) : null}
          {block.content}
        </Fragment>
      ))}
      {/* Its number at the head's outer corner, as an engraver prints it (and Flat): right on an odd page, left on an even one. */}
      <span
        aria-hidden
        className="absolute text-xs text-muted-foreground tabular-nums"
        style={{
          top: PAGE.margin / 2,
          ...(number % 2 === 1 ? { right: PAGE.margin } : { left: PAGE.margin }),
        }}
      >
        {number}
      </span>
    </article>
  )
}
