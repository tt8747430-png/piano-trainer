import { ChevronDown } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FoldBody } from './FoldBody'

/** Whether a section shows its body, and how its heading changes that. */
export interface Fold {
  readonly open: boolean
  toggle(): void
}

/**
 * A titled section of a page; given a `fold`, its heading is the button that folds its body away,
 * a chevron saying which way it is, the heading itself staying in sight. Its `detail` is a line
 * under the heading that folds with the body.
 */
export function FoldSection({
  title,
  fold,
  detail,
  className,
  headingClassName = 'text-2xl',
  children,
}: {
  title: string
  fold?: Fold | undefined
  detail?: ReactNode
  /** The section's own look (a card) and the room between its parts. */
  className?: string
  headingClassName?: string
  children: ReactNode
}) {
  const headingId = useId()
  const bodyId = useId()
  const open = fold?.open ?? true
  return (
    <section aria-labelledby={headingId} className={cn('flex flex-col gap-3', className)}>
      <h2 id={headingId} className={headingClassName}>
        {fold ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={fold.toggle}
            className="flex w-full items-center gap-2 rounded-lg text-left"
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
      </h2>
      <FoldBody id={bodyId} open={open} className="flex flex-col gap-3">
        {detail}
        {children}
      </FoldBody>
    </section>
  )
}
