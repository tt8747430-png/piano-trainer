import { CircleAlert, CircleHelp, WifiOff } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { useRouteShell } from './route-shell'
import { ScreenHeader } from './ScreenHeader'
import { usePageHeading } from './use-page-heading'

type Mark = 'missing' | 'failed' | 'offline'

/** The mark's glyph; every mark stands on the same yellow tile, as the board's route states. */
const MARKS: Record<Mark, ReactNode> = {
  missing: <CircleHelp aria-hidden className="size-6.5" />,
  failed: <CircleAlert aria-hidden className="size-6.5" />,
  offline: <WifiOff aria-hidden className="size-6.5" />,
}

/**
 * A screen that cannot show what it was opened for (the canvas's route states, `r52_global.py`): a 72
 * tile, 16 over what happened in 18 bold, 4 over why in a 15 line, and the ways on 20 below, centred
 * in the room under the bar: the title nearest the line it heads.
 */
export function RouteState({
  mark,
  title,
  line,
  alert = false,
  children,
}: {
  mark: Mark
  title: string
  line: string
  alert?: boolean
  children: ReactNode
}) {
  const heading = usePageHeading<HTMLHeadingElement>(title)
  const shell = useRouteShell()
  useEffect(() => {
    if (!shell) return
    shell.showing(true)
    return () => shell.showing(false)
  }, [shell])
  const glyph = MARKS[mark]
  return (
    <>
      {/* In the shell, the place's bar (Search) over it, its title the page's to a screen reader. */}
      {shell ? <ScreenHeader title={title} titleOnPage tools={shell.tools} /> : null}
      <div
        role={alert ? 'alert' : undefined}
        className={cn(
          'flex flex-1 flex-col items-center justify-center p-6 text-center',
          // In the shell it is centred in the room between the bar and the tab bar (on a laptop the
          // window's foot, over main's foot padding), as the board
          // centres it; alone, in the room under its bar.
          shell
            ? '-mb-6 min-h-[calc(100dvh-env(safe-area-inset-top)-9.5rem)] lg:-mb-12 lg:min-h-[calc(100dvh-3.5rem)]'
            : 'min-h-[calc(100dvh-10rem)]',
        )}
      >
        <span
          aria-hidden
          className="flex size-18 items-center justify-center rounded-[18px] bg-paint-yellow text-foreground"
        >
          {glyph}
        </span>
        {shell ? (
          <p aria-hidden className="mt-4 font-sans text-lg font-bold text-balance">
            {title}
          </p>
        ) : (
          <h1 {...heading} className="mt-4 font-sans text-lg font-bold text-balance outline-none">
            {title}
          </h1>
        )}
        <p className="mt-1 max-w-[340px] text-subhead/[1.45] text-pretty text-muted-foreground">
          {line}
        </p>
        {/* The ways on are the board's pills, 50 tall and bold, whatever button each page passes. */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 *:h-12.5 *:rounded-full *:px-5 *:text-base *:font-bold">
          {children}
        </div>
      </div>
    </>
  )
}
