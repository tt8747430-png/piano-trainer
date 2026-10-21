import { useTranslation } from 'react-i18next'
import type { TimedMusic } from '@/shared/lib/notation'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/** A bar's number sits this far right of its barline, clear of the line. */
const NUMBER_INSET_PX = 4

/**
 * Over a line's staff: each bar's number and, with chord names, each chord symbol at its onset, as the
 * Player's sheet sets them; beside the number, Pattern on a bar a hand leaves to the pattern,
 * so the mark never stands over the notes.
 */
export function LineLabels({
  layout,
  music,
  firstBar,
  chordNames,
  patterned,
}: {
  layout: ScoreLayout
  music: TimedMusic
  /** The number of the line's first bar. */
  firstBar: number
  /** Whether the chord symbols are shown. */
  chordNames: boolean
  /** By bar of the line, whether a hand leaves it to the pattern. */
  patterned: readonly boolean[]
}) {
  const { t } = useTranslation('editor')
  return (
    <div aria-hidden data-slot="line-labels" className="absolute inset-x-0 bottom-full h-11">
      {layout.measures.map((measure, index) => (
        <span
          key={index}
          className="absolute top-0 flex gap-2 text-xs whitespace-nowrap text-muted-foreground"
          style={{ left: measure.x + NUMBER_INSET_PX }}
        >
          <span className="tabular-nums">{firstBar + index}</span>
          {patterned[index] ? <span>{t('sheet.pattern')}</span> : null}
        </span>
      ))}
      {(chordNames ? music.chords : []).map((chord, index) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display text-lg font-semibold whitespace-nowrap"
          style={{ left: xAtTick(layout, chord.startTick) }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
}
