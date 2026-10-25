import { ChevronDown } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FoldBody } from './FoldBody'

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
 */
export function FoldSection({
  title,
  fold,
  detail,
  className,
  headingClassName = 'text-2xl',
  level = 2,
  children,
}: {
  title: string
  fold?: Fold | undefined
  detail?: ReactNode
  /** The section's own look (a card) and the room between its parts. */
  className?: string
  headingClassName?: string
  level?: keyof typeof HEADINGS
  children: ReactNode
}) {
  const headingId = useId()
  const bodyId = useId()
  const open = fold?.open ?? true
  const Heading = HEADINGS[level]
  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-3', className)}>
      <Heading id={headingId} className={headingClassName}>
        {fold ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={fold.toggle}
            // Its reach is 44px tall, grown over the room round the heading, which stays put.
            className="-my-2 flex min-h-11 w-full items-center gap-2 rounded-lg py-2 text-left"
          >
            {title}
            <ChevronDown
              aria-hidden
              className={cn(
                'size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                open ? '' : '-rotate-90',
              )}
            />
          </button>
        ) : (
          title
        )}
      </Heading>
      <FoldBody id={bodyId} open={open} className="flex flex-col gap-3">
        {detail}
        {children}
      </FoldBody>
    </section>
  )
}
