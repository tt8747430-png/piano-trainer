import { useTranslation } from 'react-i18next'
import { choosableChordSize, type Piece } from '@/entities/piece'
import type { PatternFit } from '@/entities/pattern'
import type { PlayerStaves, PracticeChoice, TrackChoice, TrackId } from '@/features/practice'
import type { SwingFeel } from '@/shared/lib/schedule'
import { ChordSizeField, Labelled } from '@/shared/ui'
import { PatternCard, PlayerSetup, StavesSection, type SetupChange } from '@/widgets/player-setup'
import {
  PlayingSection,
  SwingField,
  type PlayerControl,
  type ScoreTrack,
} from '@/widgets/practice-player'

/**
 * A piece's Setup (A35): its Staves first, each track played and shown or not; then, for a chord
 * chart alone, the Accompaniment from the chords: its chord size (a song's written in degrees, greyed
 * while Simplify plays every chord as its triad, its ⓘ saying so), the pattern and its two hands, the
 * right hand's first chord and voice leading, and Swing. A score plays its staves as written: nothing
 * of a pattern's is offered it (`controls`), its Swing How it plays. Its key is the tools row's
 * Transpose (ADR 0105).
 */
export function PieceSetup({
  piece,
  controls,
  choice,
  fit,
  swing,
  simple,
  tracks,
  staves,
  recordingWhy,
  onChange,
  onStaves,
  onSwing,
}: {
  piece: Piece
  /** What this kind of music is offered (`controlsFor`). */
  controls: ReadonlySet<PlayerControl>
  choice: PracticeChoice
  /** What the piece, as it is played, has for its patterns. */
  fit: PatternFit
  /** Null where the meter cannot swing. */
  swing: SwingFeel | null
  /** Whether Simplify plays the piece's chords as triads. */
  simple: boolean
  tracks: readonly ScoreTrack[]
  staves: PlayerStaves
  /** Why the recording cannot play now, where it cannot. */
  recordingWhy?: string | undefined
  onChange: (change: SetupChange) => void
  onStaves: (id: TrackId, change: Partial<TrackChoice>) => void
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const chordSize = controls.has('chordSize') ? choosableChordSize(piece) : null
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <StavesSection
        tracks={tracks}
        staves={staves}
        recordingWhy={recordingWhy}
        onChange={onStaves}
      />
      {chordSize ? (
        <Labelled
          label={t('music:chordSize.label')}
          info={simple ? t('simplify.chordSize') : undefined}
        >
          <ChordSizeField
            value={choice.chordSize ?? chordSize}
            disabled={simple}
            onChange={(next) => onChange({ chordSize: next })}
          />
        </Labelled>
      ) : null}
      {/* A chart's swing is its accompaniment's; a score's, how its written notes play. */}
      {controls.has('accompaniment') ? (
        <PatternCard>
          {controls.has('swing') && swing !== null ? (
            <SwingField swing={swing} onSwing={onSwing} />
          ) : null}
        </PatternCard>
      ) : controls.has('swing') ? (
        <PlayingSection swing={swing} onSwing={onSwing} />
      ) : null}
    </PlayerSetup>
  )
}
