import { useEffect, useEffectEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { parseChordSymbol, type Key, type Midi } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import {
  chordSounds,
  voicingKeys,
  voicingsMusic,
  walkSounds,
  type WrittenVoicing,
} from '@/shared/lib/schedule'
import { usePlayback, usePlayhead } from '@/shared/lib/services'
import { ChordButton, PlayButton, type ShownKeys, unmarked } from '@/shared/ui'
import { satbShown, VOICES } from '../model/satb'
import { TappableStaff } from './TappableStaff'

/** How fast the voicings walk, a chord each two beats, as a row of chords does. */
const ROW_TEMPO = 84
/** A voicing tapped on the staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/**
 * Voicings played exactly as a sheet writes them, each hand's keys given: each chord its symbol over
 * its numeral and the degrees its keys are, playing alone; the row on the grand staff; and Play for
 * the whole row, each shown on the page's keys. Written in four voices (`satb`), the staff names
 * them beside the first chord and the keys carry each voice's letter, the key a voice left faint as
 * the row plays on (`onFollow`, `onShow` unless given).
 */
export function VoicingsExample({
  voicings,
  musicKey,
  satb = false,
  onShow,
  onFollow = onShow,
}: {
  voicings: readonly WrittenVoicing[]
  musicKey?: Key | undefined
  satb?: boolean
  onShow: (shown: ShownKeys) => void
  onFollow?: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('music')
  const playback = usePlayback<number | 'row'>()
  const keys = useMemo(() => voicings.map(({ hands }) => voicingKeys(hands)), [voicings])
  const music = useMemo(() => voicingsMusic(voicings, musicKey), [voicings, musicKey])
  const score = useMemo(() => notate(music), [music])
  /** A chord on the keys: by its voices where the row is four, after the chord before where one is. */
  const shownAt = (place: number, before?: readonly Midi[]): ShownKeys => {
    const own = keys[place] ?? []
    const symbol = voicings[place]?.symbol
    return satb && symbol ? satbShown(parseChordSymbol(symbol), own, before) : unmarked(own)
  }
  const onsets = useMemo(() => keys.map((_, place) => (place * 2 * 60) / ROW_TEMPO), [keys])
  const walking = usePlayhead(playback.playing === 'row' ? playback.handle : null, onsets)
  const follow = useEffectEvent((place: number) =>
    onFollow(shownAt(place, place > 0 ? keys[place - 1] : undefined)),
  )
  // The row playing on: the keys follow its voices, chord by chord.
  useEffect(() => {
    if (satb && walking !== null) follow(walking)
  }, [satb, walking])
  const playRow = () => {
    onShow(satb ? shownAt(0) : unmarked(keys.flat()))
    playback.toggle('row', () => walkSounds(keys, { arpeggio: false, tempo: ROW_TEMPO }))
  }
  return (
    <div className="flex flex-col gap-3">
      <ul aria-label={t('rowChords')} className="grid grid-cols-4 gap-2">
        {voicings.map(({ symbol, caption, degrees }, place) => (
          <li key={`${place} ${symbol}`} className="grid">
            <ChordButton
              symbol={symbol}
              numeral={caption}
              detail={degrees}
              playing={playback.playing === place}
              onClick={() => {
                const own = keys[place] ?? []
                onShow(shownAt(place))
                playback.toggle(place, () => chordSounds(own, { arpeggio: false }))
              }}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-none">
          <TappableStaff
            music={music}
            score={score}
            tempo={STAFF_TEMPO}
            voices={satb ? VOICES : undefined}
            onShow={onShow}
          />
        </div>
        <PlayButton label={t('play')} playing={playback.playing === 'row'} onClick={playRow} />
      </div>
    </div>
  )
}
