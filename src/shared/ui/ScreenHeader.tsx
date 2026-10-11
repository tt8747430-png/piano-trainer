import { useEffect, useRef, type ReactNode } from 'react'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

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
  /** The screen's name: its large title and the page's. */
  title: string
  back?: ReactNode
  actions?: ReactNode
  /** The subject's pages (`NavTabs`): the bar's second row, back with the title on the way up. */
  tabs?: ReactNode
}) {
  const { shown, report, hold } = useScreenBar()
  const bar = useRef<HTMLElement>(null)
  const heading = usePageHeading<HTMLHeadingElement>(title)
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
      // A control focused holds the bar; the heading, focused as the screen opens, does not.
      onFocus={(event) => hold(event.target !== heading.ref.current)}
      onBlur={(event) =>
        hold(
          event.relatedTarget !== heading.ref.current &&
            event.currentTarget.contains(event.relatedTarget),
        )
      }
      className="sticky top-0 z-30 -mx-gutter -mt-safe bg-background px-gutter pt-safe print:static print:mx-0 print:translate-y-0 print:px-0 duration-200 ease-out motion-safe:transition-transform data-hidden:-translate-y-full"
    >
      {/* The title takes the line beside the actions, wrapping between its words; only where its
          longest word (Последовательности) does not fit beside them do the actions go under it. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 pb-4 landscape-phone:pb-2">
        {back ? <div className="print:hidden">{back}</div> : null}
        <h1
          {...heading}
          className="min-w-[min(100%,min-content)] flex-[1_1_0%] outline-none text-3xl text-balance wrap-break-word sm:text-4xl lg:text-5xl landscape-phone:text-2xl"
        >
          {title}
        </h1>
        {actions ? (
          <div className="ms-auto flex shrink-0 items-center gap-2 print:hidden">{actions}</div>
        ) : null}
      </div>
      {tabs}
    </header>
  )
}
