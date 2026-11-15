import { WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { usePageHeading } from './use-page-heading'

type Mark = 'missing' | 'failed' | 'offline'

const MARKS: Record<Mark, { className: string; glyph: ReactNode }> = {
  missing: { className: 'bg-muted', glyph: '?' },
  failed: { className: 'bg-destructive/15', glyph: '!' },
  offline: { className: 'bg-primary', glyph: <WifiOff aria-hidden className="size-7" /> },
}

/**
 * A screen that cannot show what it was opened for (the canvas's route states): a 72 mark, what
 * happened in 22 bold, why in a 16 line, and the ways on, centred in the room under the bar.
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
  const { className, glyph } = MARKS[mark]
  return (
    <div
      role={alert ? 'alert' : undefined}
      className="flex min-h-[calc(100dvh-10rem)] flex-1 flex-col items-center justify-center gap-2.5 p-6 text-center"
    >
      <span
        aria-hidden
        className={cn(
          'flex size-18 items-center justify-center rounded-full text-[1.875rem] font-bold text-foreground',
          className,
        )}
      >
        {glyph}
      </span>
      <h1 {...heading} className="font-sans text-[1.375rem] font-bold text-balance outline-none">
        {title}
      </h1>
      <p className="max-w-[340px] text-base/[1.45] text-pretty text-muted-foreground">{line}</p>
      {/* The ways on stand 48 tall, as the board draws them, whatever button each page passes. */}
      <div className="mt-2 flex flex-wrap justify-center gap-2 *:h-12 *:px-5 *:text-base">
        {children}
      </div>
    </div>
  )
}
