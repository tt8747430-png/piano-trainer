import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { type HoldingChord, type HoldingGroup, noteName, writtenSymbol } from '@/shared/lib/music'
import { ChordButton } from '@/shared/ui'

/** One group of the chords that hold the melody: each chord, the note's degree in it, and whether the key has it. */
export function HoldingGroupCard({
  group,
  chords,
  isPlaying,
  onPlay,
}: {
  group: HoldingGroup
  chords: readonly HoldingChord[]
  isPlaying: (index: number) => boolean
  onPlay: (holding: HoldingChord, index: number) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-xl">
        {t(`reharmonise.group.${group}`)}
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {chords.map((holding, index) => (
          <li
            key={`${holding.degree} ${noteName(holding.chord.root)}${holding.chord.suffix}`}
            className="grid"
          >
            <ChordButton
              symbol={writtenSymbol(holding.chord)}
              numeral={
                t('reharmonise.as', { degree: holding.degree }) +
                (holding.inKey ? ` · ${t('reharmonise.inKey')}` : '')
              }
              playing={isPlaying(index)}
              onClick={() => onPlay(holding, index)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
