import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  chordSymbol,
  numeralChord,
  numeralText,
  voiceLead,
  type Key,
  type Midi,
  type Numeral,
  type NumeralSize,
} from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** How fast the row walks, a chord each two beats. */
const ROW_TEMPO = 84

/** The progression's chords in the key, each its symbol over its numeral, playing alone; and Play for the row. */
export function ProgressionRow({
  numerals,
  musicKey,
  size,
  onShow,
}: {
  numerals: readonly Numeral[]
  musicKey: Key
  size: NumeralSize
  onShow: (keys: readonly Midi[]) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<number | 'row'>()
  const row = numerals.map((numeral) => ({
    numeral,
    chord: numeralChord(numeral, musicKey, size),
  }))
  const voiced = voiceLead(row.map(({ chord }) => chord))
  return (
    <div className="flex flex-col gap-3">
      <ul aria-label={t('learn:progressions.chords')} className="grid grid-cols-4 gap-2">
        {row.map(({ numeral, chord }, place) => (
          <li key={`${place} ${chordSymbol(chord)}`} className="grid">
            <ChordButton
              symbol={chordSymbol(chord)}
              numeral={numeralText(numeral)}
              playing={playback.playing === place}
              onClick={() => {
                const keys = voiced[place] ?? []
                onShow(keys)
                playback.toggle(place, chordSounds(keys, { arpeggio: false }))
              }}
            />
          </li>
        ))}
      </ul>
      <Button
        size="pill"
        className="self-start"
        onClick={() => {
          onShow(voiced.flat())
          playback.toggle('row', walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }))
        }}
      >
        {playback.playing === 'row' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:play')
        )}
      </Button>
    </div>
  )
}
