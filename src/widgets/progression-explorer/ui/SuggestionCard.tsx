import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ChordRow, RowPlay } from '@/features/play-example'
import { printedChord, type Chord, type PassingChords } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/**
 * One way from a chord to another (canvas 177): its chords into the next ("D7 into G") with what kind
 * of way it is, why it works (its chords printed as the sheets print them), and Play, which plays
 * From → … → To voiced smoothly on the keys.
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
    <article aria-labelledby={titleId} className="rounded-card bg-card p-4 ring-1 ring-border">
      <ChordRow chords={[from, ...way.chords, to].map((chord) => ({ chord }))} onShow={onShow}>
        <header className="flex items-baseline gap-2">
          <h4 id={titleId} className="flex-1 text-base font-bold">
            {t('passingChords.into', {
              chords: way.chords.map(printedChord).join(' '),
              to: printedChord(to),
            })}
          </h4>
          <span className="shrink-0 text-sm text-muted-foreground">
            {t(`passingChords.kind.${way.kind}.name`)}
            {inKey ? ` · ${t('passingChords.inKey')}` : ''}
          </span>
        </header>
        <p className="text-[0.9375rem] leading-snug text-muted-foreground">
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
