import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type HoldingChord,
  type HoldingGroup,
  noteName,
  pitchClassOf,
  printedNote,
  sameNote,
  type SpelledNote,
  writtenSymbol,
} from '@/shared/lib/music'
import { CardGrid, ChordButton } from '@/shared/ui'

/** One group of the chords that hold the melody: each chord, the note's degree in it, and whether the key has it. */
export function HoldingGroupCard({
  group,
  chords,
  melody,
  isPlaying,
  onPlay,
}: {
  group: HoldingGroup
  /** The melody note as the key writes it: a chord that spells it otherwise says so (A43). */
  melody: SpelledNote
  chords: readonly HoldingChord[]
  isPlaying: (index: number) => boolean
  onPlay: (holding: HoldingChord, index: number) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  // The note as the chord spells it, where that is another letter: as 3: C♯ (= D♭).
  const asIn = (holding: HoldingChord) => {
    const tone = holding.chord.tones.find(
      (each) => pitchClassOf(each.note) === pitchClassOf(melody),
    )
    return tone && !sameNote(tone.note, melody)
      ? t('reharmonise.asSpelled', {
          degree: holding.degree,
          note: printedNote(tone.note),
          melody: printedNote(melody),
        })
      : t('reharmonise.as', { degree: holding.degree })
  }
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-sans text-xl font-bold">
        {t(`reharmonise.group.${group}`)}
      </h2>
      <CardGrid min="chord">
        {chords.map((holding, index) => (
          <li
            key={`${holding.degree} ${noteName(holding.chord.root)}${holding.chord.suffix}`}
            className="grid"
          >
            <ChordButton
              symbol={writtenSymbol(holding.chord)}
              numeral={asIn(holding) + (holding.inKey ? ` · ${t('reharmonise.inKey')}` : '')}
              playing={isPlaying(index)}
              onClick={() => onPlay(holding, index)}
            />
          </li>
        ))}
      </CardGrid>
    </section>
  )
}
