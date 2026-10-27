import { useTranslation } from 'react-i18next'
import { beatUnit, tempoMark, unitNote } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { LabelRow, type BarLabel, type PrintLabel, type ScoreLayout } from '@/shared/ui/score'
import type { EditPrinted } from '../model/printed'

/** A printed part's button, over the bars' own (which reach into the row) where it is printed. */
const PART =
  'relative z-30 cursor-pointer rounded-md transition-colors duration-200 ease-out hover:bg-foreground/5 hover:text-foreground focus-visible:-outline-offset-3'

/**
 * Over a line's staff, the labels' row the Player prints too (ADR 0087, 0095): the number of its
 * first bar at its head, a section's name at its first bar, the tempo at the piece's head, and with
 * chord names each chord symbol at its onset; the row as tall as what it holds (`row`), drawn at the
 * line's size. A section's name is a button opening its menu, and the tempo mark one opening what
 * sets the tempo (`edit`, ADR 0094).
 */
export function LineLabels({
  layout,
  music,
  labels,
  headings,
  chordNames,
  row,
  size,
  edit,
}: {
  layout: ScoreLayout
  music: TimedMusic
  /** Each of the line's bars' label. */
  labels: readonly BarLabel[]
  /** Each section's name, by section. */
  headings: readonly string[]
  /** Whether the chord symbols are shown. */
  chordNames: boolean
  /** The row's height in CSS px. */
  row: number
  /** The labels' size: 1 at full size. */
  size: number
  edit: EditPrinted
}) {
  const { t } = useTranslation(['editor', 'music'])
  const printed: PrintLabel = (part, content) => {
    if (part.kind === 'section')
      return edit(
        { kind: 'section', section: part.section },
        <button type="button" data-slot="section-name" className={PART}>
          {content}
        </button>,
      )
    // The mark as printed, in its own note where it has one (ADR 0114): `♪ = 180`.
    const unit = music.tempoUnit ?? beatUnit(music.meter)
    const mark = tempoMark(part.tempo, unit, music.meter)
    const said =
      unit === beatUnit(music.meter)
        ? t('music:bpm', { tempo: mark })
        : `${unitNote(unit)} = ${mark}`
    const name = t('editor:printed.tempoMark', { bpm: said })
    return edit(
      { kind: 'tempo' },
      <button
        type="button"
        tabIndex={-1}
        data-slot="tempo"
        aria-label={name}
        title={name}
        className={PART}
      >
        {content}
      </button>,
    )
  }
  return (
    <LabelRow
      layout={layout}
      labels={labels}
      headings={headings}
      chords={chordNames ? music.chords : []}
      meter={music.meter}
      tempoUnit={music.tempoUnit}
      row={row}
      size={size}
      printed={printed}
    />
  )
}
