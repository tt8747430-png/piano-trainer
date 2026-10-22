import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { PIANO_LAYOUT, scrollByOctave, useScrollMotion } from '@/shared/lib'
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
 * The rail the keys hang from, the piano's length: a swipe on it, or on the keys (Scroll), scrolls
 * them. Its controls stay in view wherever the keys are scrolled, each clear of the rail's edges: at
 * its end ‹ › an octave together (one control, never a lone arrow in the corner a Back takes; for a
 * mouse on a rail long enough, which cannot swipe: a finger does not see them) and `children` (the
 * screen's `RailGroup`s of `RailButton`s). Keys that do not scroll have no ‹ ›; the rail's `end`
 * stays at its end, out of the buttons that scroll. Its `caption` is said at its start; on a short
 * rail the buttons scroll sideways.
 */
export function KeyRail({
  scroller,
  scrolls,
  caption,
  end,
  children,
}: {
  scroller: RefObject<HTMLElement | null>
  scrolls: boolean
  caption?: RailCaption | undefined
  /** The rail's last control (a page's Hide the keys): always in sight, never scrolled away. */
  end?: ReactNode
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
        {/* The caption at the rail's start; the buttons give way first, scrolling sideways. */}
        <div className="flex min-w-16 flex-1 items-end">
          {caption?.text ? (
            <p className="h-9 w-max bg-key-rail px-2 font-display text-lg/9 font-semibold text-on-key-rail">
              <span className="sr-only">{caption.label}: </span>
              {caption.text}
            </p>
          ) : null}
        </div>
        {/* Fading at an edge with more beyond it, so a row too long for a phone reads as one to swipe. */}
        <div
          data-slot="rail-controls"
          className="fade-scroll-x flex min-w-0 overflow-x-auto overscroll-x-contain scrollbar-none"
        >
          {scrolls ? (
            <RailGroup className="@max-md:hidden pointer-coarse:hidden">
              <RailButton
                label={t('rail.octaveDown')}
                icon={ChevronLeft}
                onClick={() => step(-1)}
              />
              <RailButton label={t('rail.octaveUp')} icon={ChevronRight} onClick={() => step(1)} />
            </RailGroup>
          ) : null}
          {children}
        </div>
        {end}
      </div>
    </div>
  )
}
