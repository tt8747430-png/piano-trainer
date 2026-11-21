import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'

/** Whether a section shows its body, and how its heading changes that. */
export interface Fold {
  readonly open: boolean
  toggle(): void
}

/** A section's heading by its rank: a page's section, or one inside another (a level 3). */
const HEADINGS = { 2: 'h2', 3: 'h3' } as const

/**
 * A titled section of a page; given a `fold`, its heading is the button that folds its body away,
 * a chevron saying which way it is, the heading itself staying in sight. Its `detail` is a line
 * under the heading that folds with the body. A section inside another heads itself at `level` 3.
 * What it is for, where its name does not say, is an `InfoTip` beside the name (`info`, ADR 0096),
 * never a line under it.
 */
export function FoldSection({
  title,
  count,
  mark,
  fold,
  detail,
  info,
  action,
  className,
  headingClassName = 'font-sans text-xl font-bold',
  level = 2,
  children,
}: {
  title: string
  /** How many it holds, quiet after its name ("Folders 4"). */
  count?: number | undefined
  /** A word after the count, quiet as it ("· Hidden"). */
  mark?: string | undefined
  fold?: Fold | undefined
  detail?: ReactNode
  /** What the section is for, opened from the ⓘ beside its name. */
  info?: ReactNode
  /** What opens the whole section, at the heading's end: a `SeeAll`. */
  action?: ReactNode
  /** The section's own look (a card) and the room between its parts. */
  className?: string
  headingClassName?: string
  level?: keyof typeof HEADINGS
  children: ReactNode
}) {
  const headingId = useId()
  const bodyId = useId()
  const open = fold?.open ?? true
  // Only a body the learner unfolds fades in; on the page's first paint it stands, as everything.
  const [folded, setFolded] = useState(false)
  const Heading = HEADINGS[level]
  const heading = (
    <Heading
      id={headingId}
      className={cn(
        info || action ? 'min-w-0' : undefined,
        action && 'flex-1',
        headingClassName,
        // A folding heading's line is 24, its 44 reach grown 10 over and under it (the boards' folds).
        fold && 'leading-6',
      )}
    >
      {fold ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => {
            setFolded(true)
            fold.toggle()
          }}
          // Its reach is 44px tall, grown over the room round the heading, which stays put.
          className="-my-2.5 flex min-h-11 w-full items-center gap-2 rounded-control py-2.5 text-left"
        >
          {title}
          {count === undefined ? null : (
            <span className="font-sans text-base text-muted-foreground">{count}</span>
          )}
          {mark ? (
            <span className="font-sans text-base text-muted-foreground">· {mark}</span>
          ) : null}
          <ChevronDown
            aria-hidden
            strokeWidth={2.2}
            className={cn(
              'size-4.5 shrink-0 text-foreground/55 transition-transform duration-200 ease-out',
              open ? '' : '-rotate-90',
            )}
          />
        </button>
      ) : (
        <>
          {title}
          {count === undefined ? null : (
            <span className="ml-2 font-sans text-base text-muted-foreground">{count}</span>
          )}
        </>
      )}
    </Heading>
  )
  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-3', className)}>
      {info || action ? (
        // Beside the heading, not in it: the section is named by its title alone.
        <div className="flex items-center gap-2">
          {heading}
          {info ? <InfoTip name={title}>{info}</InfoTip> : null}
          {action}
        </div>
      ) : (
        heading
      )}
      {/* Folded, the body is gone at once, out of reach of the keyboard and a screen reader; unfolded,
          it stands at once and fades in from 4 above, as the editor's palette (only opacity and
          transform move, never its height); at once under reduced motion. */}
      <div
        id={bodyId}
        hidden={!open}
        className={cn(
          'flex flex-col gap-3',
          folded &&
            'transition-[opacity,translate] duration-200 ease-out starting:-translate-y-1 starting:opacity-0 motion-reduce:transition-none',
        )}
      >
        {detail}
        {children}
      </div>
    </section>
  )
}
