import { AlignLeft, Book, ChevronRight, Heart, History, type LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import type { FoldIcon, PatternFold } from '../model/pattern-folds'

/** A fold's picture by what it holds (the board's `iRecent`, `iFav`, `iBook`, `iNone`). */
const ICONS: Readonly<Record<FoldIcon, LucideIcon>> = {
  recent: History,
  favourites: Heart,
  book: Book,
  list: AlignLeft,
}

/**
 * A fold of the Pattern sheet (the PlayerApp board's): a card whose heading is the button that folds
 * it, a chevron turning as it opens, its picture, name and count; open, its rows under it, a method
 * book's groups under their names in small capitals.
 */
export function PatternFoldCard({
  fold,
  open,
  onToggle,
  row,
}: {
  fold: PatternFold
  open: boolean
  onToggle: () => void
  row: (item: PatternFold['parts'][number]['rows'][number]) => ReactNode
}) {
  const body = useId()
  const Icon = ICONS[fold.icon]
  return (
    <section aria-label={fold.title} className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={body}
        onClick={onToggle}
        className={cn(
          'flex min-h-12.5 w-full items-center gap-2 bg-card pr-4 pl-3 text-left transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
          open ? 'rounded-t-control' : 'rounded-control',
        )}
      >
        <ChevronRight
          aria-hidden
          strokeWidth={2.4}
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out',
            open ? 'rotate-90' : '',
          )}
        />
        <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-bold">{fold.title}</span>
        <span className="shrink-0 text-[0.8125rem] text-muted-foreground tabular-nums">
          {fold.count}
        </span>
      </button>
      {open ? (
        <div id={body} className="flex flex-col overflow-hidden rounded-b-control">
          {fold.parts.map((part) => (
            <div key={part.title ?? ''} className="flex flex-col">
              {part.title ? (
                <h3 className="border-t border-hairline bg-card px-3.5 font-sans pt-3 pb-1 text-xs font-semibold tracking-[0.04em] text-muted-foreground uppercase">
                  {part.title}
                </h3>
              ) : null}
              {part.rows.map(row)}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
