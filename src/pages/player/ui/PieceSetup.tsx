import { useTranslation } from 'react-i18next'
import {
  choosableChordSize,
  isDegreePiece,
  isLeadSheet,
  isOwnKey,
  pieceKey,
  useStaffNames,
  useStaffTitle,
  type Piece,
} from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import type { PatternFit } from '@/entities/pattern'
import { useKeyName } from '@/shared/i18n'
import { ChordSizeField, Labelled } from '@/shared/ui'
import {
  TuneToggle,
  PatternCard,
  PlayerSetup,
  RecordingToggle,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'

/**
 * A piece's Setup: the pattern and figures, its chord size, Play melody (its tune, ADR 0110) and
 * recording where it has them, and how it plays, the ⓘ beside it naming the staff Play melody plays. Its key is the tools row's Transpose (ADR 0104); its chord size, a song's
 * written in degrees, greyed while Simplify plays every chord as its triad, its ⓘ saying so.
 */
export function PieceSetup({
  piece,
  choice,
  fit,
  swing,
  simple,
  onChange,
  onSwing,
}: {
  piece: Piece
  choice: PracticeChoice
  /** What the piece, as it is played, has for its patterns. */
  fit: PatternFit
  /** Null where the meter cannot swing. */
  swing: boolean | null
  /** Whether Simplify plays the piece's chords as triads. */
  simple: boolean
  onChange: (change: SetupChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const keyName = useKeyName()
  const chordSize = choosableChordSize(piece)
  // The recording plays in its own key alone: elsewhere its tile is closed, and says why.
  const ownKey = piece.recording && !isOwnKey(piece, choice.tonic) ? keyName(pieceKey(piece)) : null
  // Play melody, the top single staff heard along (ADR 0097), its staff named in the section's ⓘ
  // (ADR 0110). A lead sheet's tune is always heard (ADR 0083).
  const tune = fit.tune && !isLeadSheet(piece)
  const [topName] = useStaffNames(isDegreePiece(piece) ? undefined : piece.staves)
  const staffTitle = useStaffTitle()
  const said = [
    ...(tune ? [t('tuneInfo', { staff: staffTitle(topName, 0) })] : []),
    ...(ownKey ? [t('recordingOnlyIn', { key: ownKey })] : []),
  ]
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
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
      <PatternCard />
      <PlayingSection
        swing={swing}
        onSwing={onSwing}
        info={
          said.length > 0 ? (
            <div className="flex flex-col gap-2">
              {said.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : undefined
        }
      >
        {tune ? <TuneToggle /> : null}
        {piece.recording ? <RecordingToggle ownKey={ownKey} /> : null}
      </PlayingSection>
    </PlayerSetup>
  )
}
