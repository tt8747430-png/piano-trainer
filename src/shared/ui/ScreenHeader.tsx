import { useEffect, useRef, type ReactNode } from 'react'
import { useScreenBar } from './screen-bar'

/**
 * A screen's large title, with an optional way back before it and actions after it: the screen's bar.
 * It stays at the top, clear of the notch, slides away while the page scrolls down and comes back as
 * soon as it scrolls up; it stays while focus is inside it.
 */
export function ScreenHeader({
  title,
  back,
  actions,
}: {
  title: ReactNode
  back?: ReactNode
  actions?: ReactNode
}) {
  const { shown, report, hold } = useScreenBar()
  const row = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = row.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      report(entry?.borderBoxSize[0]?.blockSize ?? 0),
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      report(0)
      hold(false)
    }
  }, [report, hold])
  return (
    <header
      data-slot="screen-bar"
      data-hidden={shown ? undefined : ''}
      onFocus={() => hold(true)}
      onBlur={(event) => hold(event.currentTarget.contains(event.relatedTarget))}
      className="sticky top-0 z-30 -mx-gutter -mt-safe bg-background px-gutter pt-safe duration-200 ease-out motion-safe:transition-transform data-hidden:-translate-y-full"
    >
      <div ref={row} className="flex items-center gap-3 pt-2 pb-4">
        {back}
        <h1 className="min-w-0 flex-1 text-4xl text-balance lg:text-5xl">{title}</h1>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
