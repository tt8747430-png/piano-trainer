import { WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import { usePageHeading } from './use-page-heading'

type Mark = 'missing' | 'failed' | 'offline'

/** The mark's glyph; every mark stands on the same yellow tile, as the board's route states. */
const MARKS: Record<Mark, ReactNode> = {
  missing: '?',
  failed: '!',
  offline: <WifiOff aria-hidden className="size-7" />,
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
  const glyph = MARKS[mark]
  return (
    <div
      role={alert ? 'alert' : undefined}
      className="flex min-h-[calc(100dvh-10rem)] flex-1 flex-col items-center justify-center p-6 text-center"
    >
      <span
        aria-hidden
        className="flex size-18 items-center justify-center rounded-[18px] bg-paint-yellow text-[1.875rem] font-bold text-foreground"
      >
        {glyph}
      </span>
      <h1 {...heading} className="mt-4 font-sans text-lg font-bold text-balance outline-none">
        {title}
      </h1>
      <p className="mt-1 max-w-[340px] text-[0.9375rem]/[1.45] text-pretty text-muted-foreground">
        {line}
      </p>
      {/* The ways on are the board's pills, 48 tall and bold, whatever button each page passes. */}
      <div className="mt-5 flex flex-wrap justify-center gap-2 *:h-12 *:rounded-full *:px-5 *:text-base *:font-bold">
        {children}
      </div>
    </div>
  )
}
