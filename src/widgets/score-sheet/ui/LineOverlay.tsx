import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { caretPlaces, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import { chordSymbol, type Tick } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import type { SheetLineBars } from '../model/line-music'
import { nearestPlace } from '../model/nearest'
import { EditorCaret } from './EditorCaret'
import { LineLabels } from './LineLabels'

/** The chord symbols' row over the staff (the line's `pt-11`). */
const CHORD_ROW = 44

/** The layer a point on a line's bar writes: the chord row, the bass staff, or the treble's. */
function layerAt(y: number, layout: ScoreLayout, layer: Layer): Layer {
  if (y < 0) return 'chords'
  const { treble, bass } = layout.staves
  if (treble && bass && y > (treble.bottom + bass.top) / 2) return 'lh'
  return layer === 'rh' ? 'rh' : 'melody'
}

/**
 * Over a line's staff: its labels, the bars chosen, Pattern where a hand is not written (in that
 * hand's layer), the caret, and each bar as a button that puts the caret where it is clicked.
 */
export function LineOverlay({
  layout,
  music,
  line,
  draft,
  layer,
  caret,
  caretTicks,
  selection,
  onPlace,
}: {
  layout: ScoreLayout
  music: TimedMusic
  line: SheetLineBars
  draft: Draft
  layer: Layer
  /** From the line's start, when the caret is on this line. */
  caret: Tick | null
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
}) {
  const { t } = useTranslation('editor')
  const hand = layer === 'rh' || layer === 'lh' ? layer : null
  const staff = hand === 'lh' ? layout.staves.bass : layout.staves.treble
  const place = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const placed = line.bars[index]
    const measure = layout.measures[index]
    if (!placed || !measure) return
    if (event.detail === 0) {
      onPlace(placed.start, layer, event.shiftKey)
      return
    }
    const box = event.currentTarget.getBoundingClientRect()
    const target = layerAt(event.clientY - box.top - CHORD_ROW, layout, layer)
    const end = placed.start + placed.bar.ticks
    const places = caretPlaces(draft, target, caretTicks).filter(
      (tick) => tick >= placed.start && tick < end,
    )
    const x = measure.x + event.clientX - box.left
    const tick = nearestPlace(places, x, (at) => xAtTick(layout, at - line.start))
    onPlace(tick ?? placed.start, target, event.shiftKey)
  }
  return (
    <>
      {layout.measures.map((measure, index) => {
        const bar = line.bars[index]?.index ?? -1
        return selection && bar >= selection.from && bar <= selection.to ? (
          <div
            key={`chosen-${index}`}
            aria-hidden
            className="absolute bottom-0 z-0 bg-muted"
            style={{ left: measure.x, width: measure.width, top: -CHORD_ROW }}
          />
        ) : null
      })}
      <LineLabels layout={layout} music={music} firstBar={(line.bars[0]?.index ?? 0) + 1} />
      {hand && staff
        ? layout.measures.map((measure, index) =>
            line.bars[index]?.bar[hand] ? null : (
              <span
                key={`pattern-${index}`}
                aria-hidden
                className="absolute flex items-center justify-center text-sm text-muted-foreground"
                style={{
                  left: measure.x,
                  width: measure.width,
                  top: staff.top,
                  height: staff.bottom - staff.top,
                }}
              >
                {t('sheet.pattern')}
              </span>
            ),
          )
        : null}
      {caret === null ? null : (
        <EditorCaret layout={layout} layer={layer} tick={caret} ticks={caretTicks} />
      )}
      {layout.measures.map((measure, index) => {
        const placed = line.bars[index]
        const chords = (placed?.bar.chords ?? []).map((chord) => chordSymbol(chord.chord))
        return (
          <button
            key={index}
            type="button"
            tabIndex={-1}
            aria-label={t('sheet.bar', { n: (placed?.index ?? 0) + 1, chords: chords.join(' ') })}
            onClick={place(index)}
            className="absolute bottom-0 z-20 cursor-pointer rounded-md outline-none transition-shadow duration-200 ease-out hover:ring-1 hover:ring-input"
            style={{ left: measure.x, width: measure.width, top: -CHORD_ROW }}
          />
        )
      })}
    </>
  )
}
