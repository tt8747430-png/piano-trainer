import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { NO_BAR_SIZE, useScreenBar } from './screen-bar'
import { usePageHeading } from './use-page-heading'

type ScreenHeaderProps = {
  /** The screen's name: its title and the page's. */
  title: string
  back?: ReactNode
  /**
   * The bar's end, always in this order whatever order they are given (A3, DESIGN.md Placement): the
   * screen's tools (Search, MIDI, an act on the item such as a lesson's Learned), its Settings (the
   * gear), More (⋯, commands only) and Edit ⇄ Done at the very end.
   */
  tools?: ReactNode
  settings?: ReactNode
  more?: ReactNode
  edit?: ReactNode
  /** The page shows its title itself, large under the bar (a document in Edit): on a phone the bar
   * keeps it for a screen reader alone and leaves its room to the bar's tools. */
  titleOnPage?: boolean
} & (
  | {
      /** A place's title, set larger in the same row. */
      large: true
      /** A place's views, in the title's place (a `Segmented`): only a place has them in its bar. */
      switcher?: ReactNode
    }
  | { large?: false; switcher?: never }
)

/**
 * A screen's bar: one row of one height on every screen, Back, the title (one line, cut short with an
 * ellipsis) and at most two actions, More holding the rest; never a second row (R29-P1: a page's
 * views are a segmented control in its content). A place (Learn, Songs, Practice) or a detail page (a
 * song, a course) is `large`: the same one row, its title set larger and allowed a second line; a
 * place's views (`switcher`, Learn's Lessons · Courses) take the title's place, the title kept for a
 * screen reader. A hairline marks the bar
 * once the page runs under it. It stays at the top, clear of the notch, slides away while reading down
 * and comes back as soon as the page turns up; it stays while focus is inside it.
 *
 * It must be a child of the page's root: a sticky bar goes no further than its parent does.
 */
export function ScreenHeader({
  title,
  back,
  tools,
  settings,
  more,
  edit,
  switcher,
  large = false,
  titleOnPage = false,
}: ScreenHeaderProps) {
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
        {switcher ? <div className="flex min-w-0 flex-1 items-center">{switcher}</div> : null}
        <h1
          {...pageHeading}
          className={cn(
            'min-w-0 flex-1 font-display font-semibold outline-none',
            // A name takes a second line rather than be cut (a lesson's, a song's): never an ellipsis
            // on a phone where two lines say it all.
            'line-clamp-2 leading-tight text-balance wrap-break-word',
            large ? 'text-[1.375rem] sm:text-2xl' : 'text-lg sm:text-xl',
            titleOnPage && 'max-sm:sr-only',
            switcher && 'sr-only',
          )}
        >
          {title}
        </h1>
        {tools || settings || more || edit ? (
          <div className="ms-auto flex shrink-0 items-center gap-1.5 print:hidden">
            {tools}
            {settings}
            {more}
            {edit}
          </div>
        ) : null}
      </div>
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
