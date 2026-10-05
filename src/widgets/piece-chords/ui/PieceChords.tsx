import { Link } from '@tanstack/react-router'
import { Target } from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId, stepById } from '@/entities/path'
import type { Piece } from '@/entities/piece'
import type { Performance } from '@/shared/lib/arrangement'
import { placeChord } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ButtonLink, ChordButton } from '@/shared/ui'
import { chordsOf } from '../model/piece-chords'

/**
 * The chords a piece plays, each once and by its own name, to tap and hear on the page's keys; and
 * the Check of them, where the piece is a step of the path.
 */
export function PieceChords({ piece, performance }: { piece: Piece; performance: Performance }) {
  const { t } = useTranslation('piece')
  const headingId = useId()
  const playback = usePlayback<string>()
  const chords = useMemo(() => chordsOf(performance), [performance])
  const step = pieceStepId(piece.id)
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id={headingId} className="text-2xl">
          {t('chords')}
        </h2>
        {stepById(step) ? (
          <ButtonLink variant="outline" render={<Link to="/check" search={{ of: step }} />}>
            <Target data-icon="inline-start" aria-hidden />
            {t('checkChords')}
          </ButtonLink>
        ) : null}
      </div>
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
    </section>
  )
}
