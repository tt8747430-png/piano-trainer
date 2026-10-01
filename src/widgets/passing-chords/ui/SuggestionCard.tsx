import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ChordRow, RowChords, RowPlay } from '@/features/play-example'
import { chordSymbol, type Chord, type PassingChords } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/**
 * One way from a chord to another: its name, the row From → … → To voiced smoothly (each chord
 * playing as the row voices it), in the key or chromatic, why it works, and Play, which plays the row.
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
  const { t } = useTranslation('learn')
  const titleId = useId()
  const [first, second] = way.chords
  return (
    <article aria-labelledby={titleId} className="card p-4">
      <ChordRow chords={[from, ...way.chords, to].map((chord) => ({ chord }))} onShow={onShow}>
        <header className="flex items-baseline justify-between gap-3">
          <h3 id={titleId} className="text-xl">
            {t(`passing.kind.${way.kind}.name`)}
          </h3>
          <span className="shrink-0 text-sm text-muted-foreground">
            {t(inKey ? 'passing.inKey' : 'passing.chromatic')}
          </span>
        </header>
        <RowChords />
        <p className="text-muted-foreground">
          {t(`passing.kind.${way.kind}.why`, {
            chord: first ? chordSymbol(first) : '',
            next: second ? chordSymbol(second) : '',
            to: chordSymbol(to),
          })}
        </p>
        <RowPlay variant="soft" />
      </ChordRow>
    </article>
  )
}
