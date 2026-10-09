import { useEffect, useRef, type ReactNode } from 'react'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'

/**
 * A screen's large title, with an optional way back before it and actions after it, over the
 * subject's tabs where the screen is one of several: the screen's bar. It stays at the top, clear of
 * the notch, slides away once the page has scrolled down past it and comes back as soon as it
 * scrolls up; it stays while focus is inside it.
 *
 * It must be a child of the page's root: a sticky bar goes no further than its parent does.
 */
export function ScreenHeader({
  title,
  back,
  actions,
  tabs,
}: {
  title: ReactNode
  back?: ReactNode
  actions?: ReactNode
  /** The subject's pages (`NavTabs`): the bar's second row, back with the title on the way up. */
  tabs?: ReactNode
}) {
  const { shown, report, hold } = useScreenBar()
  const bar = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = bar.current
    if (!element) return
    // What stays at the top sits under the bar's rows; the page scrolls past its whole box.
    const observer = new ResizeObserver(([entry]) =>
      report({
        rows: entry?.contentBoxSize[0]?.blockSize ?? 0,
        box: entry?.borderBoxSize[0]?.blockSize ?? 0,
      }),
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      report(NO_BAR_SIZE)
      hold(false)
    }
  }, [report, hold])
  return (
    <header
      ref={bar}
      data-slot="screen-bar"
      data-hidden={shown ? undefined : ''}
      onFocus={() => hold(true)}
      onBlur={(event) => hold(event.currentTarget.contains(event.relatedTarget))}
      className="sticky top-0 z-30 -mx-gutter -mt-safe bg-background px-gutter pt-safe duration-200 ease-out motion-safe:transition-transform data-hidden:-translate-y-full"
    >
      <div className="flex items-center gap-3 pt-2 pb-4">
        {back}
        <h1 className="min-w-0 flex-1 text-4xl text-balance hyphens-auto wrap-break-word lg:text-5xl">
          {title}
        </h1>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {tabs}
    </header>
  )
}
