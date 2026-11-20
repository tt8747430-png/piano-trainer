import { useTranslation } from 'react-i18next'
import { ChordRow, RowPlayLine } from '@/features/play-example'
import { printedChord, type Chord, type PassingChords } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/**
 * One way from a chord to another, a row of Passing chords' card (the board's BETWEEN62): Play's
 * circle, its chords into the next ("D7 into G") over why it works; a tap plays From → … → To voiced
 * smoothly on the keys.
 */
export function SuggestionCard({
  way,
  from,
  to,
  onShow,
}: {
  way: PassingChords
  from: Chord
  to: Chord
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const [first, second] = way.chords
  return (
    <li>
      <ChordRow chords={[from, ...way.chords, to].map((chord) => ({ chord }))} onShow={onShow}>
        <RowPlayLine
          title={t('passingChords.into', {
            chords: way.chords.map(printedChord).join(' '),
            to: printedChord(to),
          })}
          detail={t(`passingChords.kind.${way.kind}.why`, {
            chord: first ? printedChord(first) : '',
            next: second ? printedChord(second) : '',
            to: printedChord(to),
          })}
        />
      </ChordRow>
    </li>
  )
}
