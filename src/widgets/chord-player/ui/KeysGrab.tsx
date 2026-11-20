import { use, useRef, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PanelSize } from '@/entities/page-layout'
import { cn } from '@/shared/lib'
import { LayoutEditContext } from '../model/use-layout-edit'

/** The keys' three heights (canvas R76's KH and KHL): a phone's, and a laptop's from 64rem. */
export const KEYS_PX: Readonly<Record<'phone' | 'laptop', Readonly<Record<string, number>>>> = {
  phone: { small: 72, medium: 112, large: 168 },
  laptop: { small: 110, medium: 170, large: 240 },
}
const KEY_SIZES: readonly PanelSize[] = ['small', 'medium', 'large']

/**
 * The keys' resize handle in Edit layout (the board's grab): a 44 by 6 ink bar on the keys' inner edge,
 * 88 by 44 to reach. Dragged up or down it takes the height nearest the pointer's; tapped it steps to
 * the next size (Small, Medium, Large, then Small), so it needs no drag (WCAG 2.2, 2.5.7).
 */
export function KeysGrab({
  top,
  size,
  heights,
}: {
  top: boolean
  size: PanelSize
  /** The keys' heights at this size, by size. */
  heights: Readonly<Record<string, number>>
}) {
  const { t } = useTranslation('practice')
  const edit = use(LayoutEditContext)
  const start = useRef<{ y: number; height: number; moved: boolean } | null>(null)
  if (!edit?.on) return null
  const height = heights[size] ?? 0
  const next = KEY_SIZES[(KEY_SIZES.indexOf(size) + 1) % KEY_SIZES.length] ?? 'medium'
  const nearest = (wanted: number): PanelSize =>
    KEY_SIZES.reduce((best, each) =>
      Math.abs((heights[each] ?? 0) - wanted) < Math.abs((heights[best] ?? 0) - wanted)
        ? each
        : best,
    )
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const from = start.current
    if (!from) return
    // Keys at the foot grow as the handle goes up; at the top, as it goes down.
    const grown = (top ? 1 : -1) * (event.clientY - from.y)
    if (!from.moved && Math.abs(grown) < 8) return
    from.moved = true
    const chosen = nearest(from.height + grown)
    if (chosen !== size) edit.layout.set('keys', { size: chosen })
  }
  return (
    <button
      type="button"
      aria-label={t('chordPlayer.layout.resize', {
        size: t(`chordPlayer.layout.sizes.${size}`),
      })}
      title={t('chordPlayer.layout.resizeTip')}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        start.current = { y: event.clientY, height, moved: false }
      }}
      onPointerMove={move}
      onPointerUp={() => {
        const from = start.current
        start.current = null
        if (from && !from.moved) edit.layout.set('keys', { size: next })
      }}
      onPointerCancel={() => {
        start.current = null
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          edit.layout.set('keys', { size: next })
        }
      }}
      className={cn(
        'absolute left-1/2 z-[46] grid h-11 w-22 -translate-x-1/2 cursor-ns-resize touch-none place-items-center',
        top ? '-bottom-[22px]' : '-top-[22px]',
      )}
    >
      <span aria-hidden className="h-1.5 w-11 rounded-[3px] bg-foreground" />
    </button>
  )
}
