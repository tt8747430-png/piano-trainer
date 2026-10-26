import { ChevronDown } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FoldBody } from './FoldBody'

/**
 * A titled group that folds under its heading: the heading is its button, with what the group holds
 * of its whole at the end of it (`count`, "3 / 10 learned") and a bar of it (`progress`, 0 to 1); a
 * line on what it is under it (`detail`). Folded, its list stays in the page, hidden, the button
 * pointing at it. Its children are `li`s.
 */
export function FoldGroup({
  title,
  detail,
  count,
  progress,
  open,
  onToggle,
  listClassName = 'grid-cards gap-2 *:card',
  children,
}: {
  title: string
  detail?: string | undefined
  count?: string | undefined
  progress?: number | undefined
  open: boolean
  onToggle: () => void
  listClassName?: string
  children: ReactNode
}) {
  const listId = useId()
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h2 className="text-2xl">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
          // Its reach is 44px tall, grown over the room round the heading, which stays put.
          className="-my-2 flex min-h-11 w-full items-baseline justify-between gap-3 rounded-lg py-2 text-left"
        >
          <span className="flex items-center gap-2">
            <ChevronDown
              aria-hidden
              className={cn(
                'size-5 shrink-0 self-center text-muted-foreground transition-transform duration-200 ease-out',
                open ? '' : '-rotate-90',
              )}
            />
            {title}
          </span>
          {count ? (
            <span className="shrink-0 font-sans text-base text-muted-foreground tabular-nums">
              {count}
            </span>
          ) : null}
        </button>
      </h2>
      {detail ? <p className="text-muted-foreground text-pretty">{detail}</p> : null}
      {progress === undefined ? null : (
        <div aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
      <FoldBody id={listId} open={open}>
        <ul className={cn('mt-1', listClassName)}>{children}</ul>
      </FoldBody>
    </section>
  )
}
