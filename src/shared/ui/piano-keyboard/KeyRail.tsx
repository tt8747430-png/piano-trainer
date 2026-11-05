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
 * The piano's rail beneath the keys (R32), the instrument's case: nothing stands above the keys, so
 * they follow the music directly. It spans the piano's length and scrolls with it (a swipe on it
 * scrolls the keys); what it holds stays in view wherever the keys are scrolled. At its start the
 * `caption` (the chord a hand holds); centred, as on an upright or a grand, the `pedals` on their
 * lyre (giving way towards the start where the rail is short, so its end never scrolls out of
 * sight); at its end ‹ › an octave together (for a mouse on a keyboard long enough, which cannot swipe;
 * keys that do not scroll have none), `children` (the screen's `RailGroup`s of `RailButton`s), and
 * `end`, never scrolled away. On a short rail the buttons scroll sideways.
 */
export function KeyRail({
  scroller,
  scrolls,
  caption,
  pedals,
  end,
  children,
}: {
  scroller: RefObject<HTMLElement | null>
  scrolls: boolean
  caption?: RailCaption | undefined
  /** The pedals on their lyre, centred beneath the keys. */
  pedals?: ReactNode
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
    <div data-slot="key-rail" className="relative h-14 shrink-0 bg-key-rail">
      <div
        className="sticky left-0 grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(max-content,1fr)] items-center px-1"
        style={{ width: IN_VIEW }}
      >
        <div className="flex min-w-0 items-center">
          {caption?.text ? (
            <p className="h-9 min-w-0 truncate px-2 font-display text-lg/9 font-semibold text-on-key-rail">
              <span className="sr-only">{caption.label}: </span>
              {caption.text}
            </p>
          ) : null}
        </div>
        <div className="flex h-full justify-center">{pedals}</div>
        <div className="flex min-w-0 items-center justify-end">
          <div
            data-slot="rail-controls"
            className="flex min-w-0 overflow-x-auto overscroll-x-contain scrollbar-none"
          >
            {scrolls ? (
              <RailGroup className="@max-md:hidden pointer-coarse:hidden">
                <RailButton
                  label={t('rail.octaveDown')}
                  icon={ChevronLeft}
                  onClick={() => step(-1)}
                />
                <RailButton
                  label={t('rail.octaveUp')}
                  icon={ChevronRight}
                  onClick={() => step(1)}
                />
              </RailGroup>
            ) : null}
            {children}
          </div>
          {end}
        </div>
      </div>
    </div>
  )
}
