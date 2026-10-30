import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

/**
 * A screen's bar: one row of one height on every screen, Back, the title (one line, cut short with an
 * ellipsis) and at most two actions, More holding the rest; a page's tabs its second row. A place
 * (Learn, Songs, Practice) or a detail page (a song, a course) is `large`: the same one row, its title
 * set larger and allowed a second line. A hairline marks the bar
 * once the page runs under it. It stays at the top, clear of the notch, slides away while reading down
 * and comes back as soon as the page turns up; it stays while focus is inside it.
 *
 * It must be a child of the page's root: a sticky bar goes no further than its parent does.
 */
export function ScreenHeader({
  title,
  back,
  actions,
  tabs,
  large = false,
}: {
  /** The screen's name: its title and the page's. */
  title: string
  back?: ReactNode
  /** Two at most, round; a third goes into a More menu. */
  actions?: ReactNode
  /** The page's views (`NavTabs`): the bar's second row. */
  tabs?: ReactNode
  /** A place's title, set larger in the same row. */
  large?: boolean
}) {
  const { shown, report, hold } = useScreenBar()
  const bar = useRef<HTMLElement>(null)
  const pageHeading = usePageHeading<HTMLHeadingElement>(title)
  const scrolled = useScrolled()
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
      onFocus={(event) => hold(event.target !== pageHeading.ref.current)}
      onBlur={(event) =>
        hold(
          event.relatedTarget !== pageHeading.ref.current &&
            event.currentTarget.contains(event.relatedTarget),
        )
      }
      className={cn(
        'sticky top-0 z-30 -mx-gutter -mt-safe border-b bg-background px-gutter pt-safe print:static print:mx-0 print:translate-y-0 print:border-0 print:px-0 duration-200 ease-out motion-safe:transition-[translate,border-color] data-hidden:-translate-y-full',
        scrolled ? 'border-hairline' : 'border-transparent',
      )}
    >
      <div className="flex min-h-14 items-center gap-2 py-1">
        {back ? <div className="shrink-0 print:hidden">{back}</div> : null}
        <h1
          {...pageHeading}
          className={cn(
            'min-w-0 flex-1 font-display font-semibold outline-none',
            // A name takes a second line rather than be cut (a lesson's, a song's): never an ellipsis
            // on a phone where two lines say it all.
            'line-clamp-2 leading-tight text-balance wrap-break-word',
            large ? 'text-[1.375rem] sm:text-2xl' : 'text-lg sm:text-xl',
          )}
        >
          {title}
        </h1>
        {actions ? (
          <div className="ms-auto flex shrink-0 items-center gap-1.5 print:hidden">{actions}</div>
        ) : null}
      </div>
      {tabs}
    </header>
  )
}

/** Whether the page has scrolled at all: the bar's hairline. */
function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > 0)
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [])
  return scrolled
}
