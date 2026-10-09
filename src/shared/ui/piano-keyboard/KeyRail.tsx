import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { PIANO_LAYOUT, scrollByOctave, useScrollMotion } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { KeyboardMap } from './KeyboardMap'
import { RailButton } from './RailButton'
import { RailGroup } from './RailGroup'

/** The width of the stretch in view, in the scroller's container units: the rail's controls span it. */
const IN_VIEW = '100cqw'

/**
 * The rail the keys hang from, the piano's length: a swipe on it scrolls the keys, which hold still
 * under a finger. Its controls stay in view wherever the keys are scrolled, each clear of the
 * rail's edges: the keyboard map, then at its end ‹ › an octave together (one control, never a lone
 * arrow in the corner a Back takes; for a mouse on a rail long enough, which cannot swipe: a finger
 * does not see them) and `children` (the screen's `RailGroup`s of `RailButton`s). Keys that do not
 * scroll have no ‹ › and no map.
 */
export function KeyRail({
  scroller,
  scrolls,
  dots,
  children,
}: {
  scroller: RefObject<HTMLElement | null>
  scrolls: boolean
  /** The keys the map dots: marked or down. */
  dots: ReadonlySet<Midi>
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  const motion = useScrollMotion()
  const step = (by: -1 | 1) => {
    const element = scroller.current
    if (!element || element.scrollWidth <= element.clientWidth) return
    element.scrollTo({ left: scrollByOctave(element, PIANO_LAYOUT.whites, by), behavior: motion })
  }
  return (
    <div className="relative h-11 shrink-0">
      {/* The rail itself, drawn along the strip's foot: the buttons' targets reach above it. */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-9 bg-key-rail" />
      <div className="sticky left-0 flex h-full items-end px-1" style={{ width: IN_VIEW }}>
        {/* A rail too short for its buttons and a map keeps the buttons. */}
        <div className="relative flex min-w-0 flex-1 @max-xs:hidden">
          {scrolls ? <KeyboardMap scroller={scroller} dots={dots} /> : null}
        </div>
        {scrolls ? (
          <RailGroup className="@max-md:hidden pointer-coarse:hidden">
            <RailButton label={t('rail.octaveDown')} icon={ChevronLeft} onClick={() => step(-1)} />
            <RailButton label={t('rail.octaveUp')} icon={ChevronRight} onClick={() => step(1)} />
          </RailGroup>
        ) : null}
        {children}
      </div>
    </div>
  )
}
