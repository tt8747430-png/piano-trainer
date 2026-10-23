import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import type { Performance } from '@/shared/lib/arrangement'
import { placeChord } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, FoldSection } from '@/shared/ui'
import { chordsOf } from '../model/piece-chords'

/**
 * The chords a piece plays, each once and by its own name, to tap and hear on the page's keys; its
 * heading folds them away, as the learner left them.
 */
export function PieceChords({ performance }: { performance: Performance }) {
  const { t } = useTranslation('piece')
  const fold = useFold('piece.chords')
  const playback = usePlayback<string>()
  const chords = useMemo(() => chordsOf(performance), [performance])
  return (
    <FoldSection title={t('chords')} fold={fold}>
      <ul className="grid-chords gap-2">
        {chords.map((chord) => (
          <li key={chord.symbol} className="grid">
            <ChordButton
              symbol={chord.symbol}
              playing={playback.playing === chord.symbol}
              onClick={() =>
                playback.toggle(chord.symbol, () =>
                  chordSounds(
                    placeChord(chord.tones, { inversion: 0, bothHands: false }).rh.map(
                      (key) => key.midi,
                    ),
                    { arpeggio: false },
                  ),
                )
              }
            />
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
