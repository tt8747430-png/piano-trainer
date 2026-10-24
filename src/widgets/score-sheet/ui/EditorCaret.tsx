import { useEffect, useRef } from 'react'
import type { Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { caretLine, ScoreMark, type ScoreLayout, type Span } from '@/shared/ui/score'
import { staffOfLayer } from '../model/line-music'

/** How much of the sheet shows past the caret's staff when it scrolls to bring it into sight. */
const CLEAR = 16

/** The nearest box round a line that scrolls up and down: the sheet (a line itself scrolls sideways). */
function scrollerOf(element: HTMLElement): HTMLElement | null {
  const line = element.closest('[data-slot="sheet-line"]')
  for (let box = line?.parentElement; box; box = box.parentElement) {
    const { overflowY } = getComputedStyle(box)
    if ((overflowY === 'auto' || overflowY === 'scroll') && box.scrollHeight > box.clientHeight)
      return box
  }
  return null
}

/**
 * The sheet scrolled up or down just enough to show the caret's band, clear of what stands over its
 * foot (its `scroll-padding-bottom`: the editor's palette); in sight already, it stays where it is,
 * and as the sheet opens, in sight in part.
 */
function revealUpright(band: HTMLElement, opening: boolean) {
  const scroller = scrollerOf(band)
  if (!scroller) return
  const box = band.getBoundingClientRect()
  const view = scroller.getBoundingClientRect()
  const foot =
    view.bottom - (Number.parseFloat(getComputedStyle(scroller).scrollPaddingBottom) || 0)
  // As the sheet opens, a band partly in sight is left as it is: the sheet opens at its top.
  if (opening && box.top < foot && box.bottom > view.top) return
  if (box.top < view.top) scroller.scrollTop -= view.top - box.top + CLEAR
  else if (box.bottom > foot)
    scroller.scrollTop += Math.min(box.bottom - foot + CLEAR, box.top - view.top)
}

/**
 * The caret (ADR 0096): a thin line on the layer's staff (in the chord row, `chords`, over the row)
 * just before the notes it stands on, which are coloured as chosen (ScoreView's `selected`), or where
 * the next note goes on an empty place: a rest, the room after the last note.
 */
export function EditorCaret({
  layout,
  layer,
  tick,
  chords,
}: {
  layout: ScoreLayout
  layer: Layer
  /** From the line's start. */
  tick: Tick
  /** The chord row over the staff, which the caret stands in in the chords' layer. */
  chords: Span
}) {
  const staff = staffOfLayer(layout.staves, layer)
  const onStaff = layer !== 'chords' && staff
  const box = caretLine(layout, tick, onStaff ? [staff.staff] : [], onStaff ? staff : chords)
  const { left } = box
  // A line wider than the screen scrolls sideways to keep the caret in sight as it moves.
  const caret = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // In the next frame: read straight after the engraving wrote the line, its box would make the
    // browser lay the page out within the keystroke.
    const frame = requestAnimationFrame(() => {
      const line = caret.current?.closest<HTMLElement>('[data-slot="sheet-line"]')
      if (!line) return
      const margin = line.clientWidth / 4
      if (
        left < line.scrollLeft + margin / 2 ||
        left > line.scrollLeft + line.clientWidth - margin / 2
      )
        line.scrollLeft = Math.max(0, left - margin)
    })
    return () => cancelAnimationFrame(frame)
  }, [left])
  // The sheet scrolls to the caret's staff as the caret comes onto it (a short screen shows less
  // than a line's grand staff), leaving the sheet as it is while the staff is in sight.
  const shown = useRef(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (caret.current) revealUpright(caret.current, !shown.current)
      shown.current = true
    })
    return () => cancelAnimationFrame(frame)
  }, [box.top, box.height])
  return <ScoreMark ref={caret} slot="caret" kind="line" box={box} />
}
