import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { cn } from '@/shared/lib'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

/**
 * A screen's bar: one row of one height on every screen, Back, the title (one line, cut short with an
 * ellipsis) and at most two actions, More holding the rest; a page's tabs its second row. A place
 * (Learn, Songs, Practice) is `large`: its title stands large on the page under the bar, its tabs under
 * that, and the bar takes the title, small, once the page has scrolled past it; on a laptop, whose
 * sidebar names the place, the bar is only its actions, at the right of the large title. A hairline marks the bar once the page runs
 * under it. It stays at the top, clear of the notch, slides away while reading down and comes back as
 * soon as the page turns up; it stays while focus is inside it.
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
  /** The page's views (`NavTabs`): the bar's second row, back with the title on the way up. */
  tabs?: ReactNode
  /** A place's large title on the page, the bar taking it once it is scrolled past. */
  large?: boolean
}) {
  const { shown, report, hold } = useScreenBar()
  const bar = useRef<HTMLElement>(null)
  const pageHeading = usePageHeading<HTMLHeadingElement>(title)
  const scrolled = useScrolled()
  const largeInView = useInView(pageHeading.ref, large)
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
  const smallTitle = 'min-w-0 flex-1 truncate font-display text-lg font-semibold sm:text-xl'
  return (
    <>
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
          // A laptop's sidebar names the place: its bar is only the actions, beside the large title.
          large && 'lg:border-transparent',
        )}
      >
        <div
          className={cn(
            'flex h-14 items-center gap-2 sm:h-16',
            large && 'lg:h-0 lg:items-start lg:overflow-visible lg:pt-2',
          )}
        >
          {back ? <div className="shrink-0 print:hidden">{back}</div> : null}
          {large ? (
            // The large title below is the heading; this is its echo while it is out of sight.
            <p
              aria-hidden
              className={cn(
                smallTitle,
                'transition-opacity duration-200 ease-out lg:hidden',
                largeInView ? 'opacity-0' : 'opacity-100',
              )}
            >
              {title}
            </p>
          ) : (
            <h1 {...pageHeading} className={cn(smallTitle, 'outline-none')}>
              {title}
            </h1>
          )}
          {actions ? (
            <div className="ms-auto flex shrink-0 items-center gap-1.5 print:hidden">
              {actions}
            </div>
          ) : null}
        </div>
        {large ? null : tabs}
      </header>
      {large ? (
        <>
          <h1
            {...pageHeading}
            className="pt-1 pb-4 font-display text-3xl text-balance wrap-break-word outline-none sm:text-4xl lg:pe-48 lg:pt-2 lg:text-5xl landscape-phone:pb-2 landscape-phone:text-2xl"
          >
            {title}
          </h1>
          {tabs}
        </>
      ) : null}
    </>
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

/** Whether `ref`'s element is in sight, watched only while `watch`: a place's large title. */
function useInView(ref: RefObject<HTMLElement | null>, watch: boolean): boolean {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const element = ref.current
    if (!watch || !element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true))
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, watch])
  return inView
}
