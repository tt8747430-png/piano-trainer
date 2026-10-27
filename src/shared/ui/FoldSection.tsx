import { ChevronDown } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FoldBody } from './FoldBody'
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
  fold,
  detail,
  info,
  className,
  headingClassName = 'text-2xl',
  level = 2,
  children,
}: {
  title: string
  fold?: Fold | undefined
  detail?: ReactNode
  /** What the section is for, opened from the ⓘ beside its name. */
  info?: ReactNode
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
  const heading = (
    <Heading id={headingId} className={cn(info ? 'min-w-0' : undefined, headingClassName)}>
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
  )
  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-3', className)}>
      {info ? (
        // Beside the heading, not in it: the section is named by its title alone.
        <div className="flex items-center gap-2">
          {heading}
          <InfoTip name={title}>{info}</InfoTip>
        </div>
      ) : (
        heading
      )}
      <FoldBody id={bodyId} open={open} className="flex flex-col gap-3">
        {detail}
        {children}
      </FoldBody>
    </section>
  )
}
