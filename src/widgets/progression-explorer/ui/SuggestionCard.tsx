import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ChordRow, RowStaff, RowPlay } from '@/features/play-example'
import { printedChord, type Chord, type PassingChords } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/**
 * One way from a chord to another: its name, the row From → … → To voiced smoothly (each chord
 * playing as the row voices it), in the key or chromatic, why it works (its chords printed as the
 * sheets print them), and Play, which plays the row.
 */
export function SuggestionCard({
  way,
  from,
  to,
  inKey,
  onShow,
}: {
  way: PassingChords
  from: Chord
  to: Chord
  inKey: boolean
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const titleId = useId()
  const [first, second] = way.chords
  return (
    <article aria-labelledby={titleId} className="card p-4">
      <ChordRow chords={[from, ...way.chords, to].map((chord) => ({ chord }))} onShow={onShow}>
        <header className="flex items-baseline justify-between gap-3">
          <h4 id={titleId} className="text-lg font-semibold">
            {t(`passingChords.kind.${way.kind}.name`)}
          </h4>
          <span className="shrink-0 text-sm text-muted-foreground">
            {t(inKey ? 'passingChords.inKey' : 'passingChords.chromatic')}
          </span>
        </header>
        <RowStaff />
        <p className="text-muted-foreground">
          {t(`passingChords.kind.${way.kind}.why`, {
            chord: first ? printedChord(first) : '',
            next: second ? printedChord(second) : '',
            to: printedChord(to),
          })}
        </p>
        <RowPlay variant="soft" />
      </ChordRow>
    </article>
  )
}
