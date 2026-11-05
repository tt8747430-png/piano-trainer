import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** An arrow key's step, in px. */
const STEP = 16

/** Where the divider stands: over keys docked at the foot, or under keys docked at the top. */
export type DividerEdge = 'above' | 'below'

/** Its reach: 44px, over the music's edge and never over the keys (CODE_STYLE §5). */
const REACH: Readonly<Record<DividerEdge, string>> = {
  above: 'before:-top-8 before:bottom-0',
  below: 'before:top-0 before:-bottom-8',
}

/**
 * The divider between the music and the keys (R34, Songscription's "Resize score and piano roll"): a
 * slim bar on the keys' edge facing the music, its grip in its middle. Dragged by a mouse or a finger,
 * it makes the keys taller or shorter, `least` to `most` px (their widths stay); Arrow Up and Down
 * step it, Home and End take it to the least and the most, and a double click or Enter gives the keys
 * back their piano's proportion (`onResize(null)`). A window splitter to a screen reader, its value
 * the keys' height in px. `height`: the height set; `measure`: the keys' height as drawn, where none is.
 */
export function KeysDivider({
  edge,
  height,
  least,
  most,
  measure,
  onResize,
}: {
  edge: DividerEdge
  height: number | null
  least: number
  most: number
  measure: () => number
  onResize: (height: number | null) => void
}) {
  const { t } = useTranslation('common')
  const drag = useRef<{ readonly y: number; readonly from: number } | null>(null)
  // Up makes keys at the foot taller and keys at the top shorter.
  const way = edge === 'above' ? -1 : 1
  const within = (value: number) => Math.round(Math.min(most, Math.max(least, value)))
  // The keys' height now: the one set, else as drawn (measured when asked: drawn after this renders).
  const now = () => height ?? measure()
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { y: event.clientY, from: measure() }
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const from = drag.current
    if (!from) return
    onResize(within(from.from + way * (event.clientY - from.y)))
  }
  const onPointerUp = () => {
    drag.current = null
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next: Partial<Record<string, number | null>> = {
      ArrowUp: within(now() - way * STEP),
      ArrowDown: within(now() + way * STEP),
      Home: least,
      End: most,
      Enter: null,
    }
    if (!(event.key in next)) return
    event.preventDefault()
    onResize(next[event.key] ?? null)
  }
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label={t('keyboardTools.resize')}
      aria-valuenow={Math.round(height ?? least)}
      aria-valuemin={least}
      aria-valuemax={most}
      tabIndex={0}
      data-slot="keys-divider"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => onResize(null)}
      onKeyDown={onKeyDown}
      className={cn(
        "group/divider relative grid h-3 shrink-0 cursor-row-resize touch-none place-items-center border-hairline bg-background transition-colors duration-200 ease-out select-none before:absolute before:inset-x-0 before:content-[''] hover:bg-muted focus-visible:-outline-offset-3 active:bg-muted",
        edge === 'above' ? 'border-t' : 'border-b',
        REACH[edge],
      )}
    >
      <span
        aria-hidden
        className="h-1 w-9 rounded-pill bg-border transition-colors duration-200 ease-out group-hover/divider:bg-muted-foreground group-active/divider:bg-muted-foreground"
      />
    </div>
  )
}
