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
 * What the rail says of the keys a hand holds: its `label` names it for a screen reader. Words to
 * read, not a status: a screen's own status line is the one thing it says aloud.
 */
export interface RailCaption {
  readonly label: string
  /** The words in sight (a chord's symbol); empty while there is nothing to say. */
  readonly text: string
}

/**
 * The rail the keys hang from, the piano's length: a swipe on it scrolls the keys, which hold still
 * under a finger. Its controls stay in view wherever the keys are scrolled, each clear of the
 * rail's edges: the keyboard map, then at its end ‹ › an octave together (one control, never a lone
 * arrow in the corner a Back takes; for a mouse on a rail long enough, which cannot swipe: a finger
 * does not see them) and `children` (the screen's `RailGroup`s of `RailButton`s). Keys that do not
 * scroll have no ‹ › and no map. Its `caption` is said beside the buttons, in the room the map
 * leaves; on a rail with no such room it starts at the rail's start, over the map, whole.
 */
export function KeyRail({
  scroller,
  scrolls,
  dots,
  caption,
  children,
}: {
  scroller: RefObject<HTMLElement | null>
  scrolls: boolean
  /** The keys the map dots: marked or down. */
  dots: ReadonlySet<Midi>
  caption?: RailCaption | undefined
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
        {/* The map and the caption share one place: the caption at its end, or from its start when it is longer. */}
        <div className="grid min-w-0 flex-1 grid-cols-1 items-end">
          {/* A rail too short for its buttons and a map keeps the buttons. */}
          <div className="col-start-1 row-start-1 flex min-w-0 @max-xs:hidden">
            {scrolls ? <KeyboardMap scroller={scroller} dots={dots} /> : null}
          </div>
          {caption?.text ? (
            <p className="z-10 col-start-1 row-start-1 h-9 w-max justify-self-end-safe bg-key-rail px-2 font-display text-lg/9 font-semibold text-on-key-rail">
              <span className="sr-only">{caption.label}: </span>
              {caption.text}
            </p>
          ) : null}
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
