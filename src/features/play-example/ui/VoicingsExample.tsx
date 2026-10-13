import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Key } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import {
  chordSounds,
  voicingKeys,
  voicingsMusic,
  walkSounds,
  type WrittenVoicing,
} from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, PlayLabel, type ShownKeys, unmarked } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { TappableStaff } from './TappableStaff'

/** How fast the voicings walk, a chord each two beats, as a row of chords does. */
const ROW_TEMPO = 84
/** A voicing tapped on the staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/**
 * Voicings played exactly as a sheet writes them, each hand's keys given: each chord its symbol over
 * its numeral and the degrees its keys are, playing alone; the row on the grand staff; and Play for
 * the whole row, each shown on the page's keys.
 */
export function VoicingsExample({
  voicings,
  musicKey,
  onShow,
}: {
  voicings: readonly WrittenVoicing[]
  musicKey?: Key | undefined
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<number | 'row'>()
  const keys = useMemo(() => voicings.map(({ hands }) => voicingKeys(hands)), [voicings])
  const music = useMemo(() => voicingsMusic(voicings, musicKey), [voicings, musicKey])
  const score = useMemo(() => notate(music), [music])
  const playRow = () => {
    onShow(unmarked(keys.flat()))
    playback.toggle('row', () => walkSounds(keys, { arpeggio: false, tempo: ROW_TEMPO }))
  }
  return (
    <div className="flex flex-col gap-3">
      <ul aria-label={t('progressions.chords')} className="grid grid-cols-4 gap-2">
        {voicings.map(({ symbol, caption, degrees }, place) => (
          <li key={`${place} ${symbol}`} className="grid">
            <ChordButton
              symbol={symbol}
              numeral={caption}
              detail={degrees}
              playing={playback.playing === place}
              onClick={() => {
                const own = keys[place] ?? []
                onShow(unmarked(own))
                playback.toggle(place, () => chordSounds(own, { arpeggio: false }))
              }}
            />
          </li>
        ))}
      </ul>
      <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
        <TappableStaff music={music} score={score} tempo={STAFF_TEMPO} onShow={onShow} />
      </div>
      <Button variant="soft" size="pill" className="self-start" onClick={playRow}>
        <PlayLabel playing={playback.playing === 'row'}>{t('play')}</PlayLabel>
      </Button>
    </div>
  )
}
