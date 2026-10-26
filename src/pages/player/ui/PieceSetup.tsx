import { useTranslation } from 'react-i18next'
import { choosableChordSize, isLeadSheet, isOwnKey, pieceKey, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import type { PatternFit } from '@/entities/pattern'
import { useKeyName } from '@/shared/i18n'
import { noteParam, writtenKeyAccidentals } from '@/shared/lib/music'
import { ChordSizeField, Labelled, NoteChoice } from '@/shared/ui'
import {
  TuneToggle,
  PatternCard,
  PlayerSetup,
  RecordingToggle,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'

/**
 * A piece's Setup: its key, the pattern and figures, its chord size, tune and recording where it
 * has them, and how it plays; at its foot the way into the score editor, whose Close comes back here.
 */
export function PieceSetup({
  piece,
  choice,
  fit,
  swing,
  onChange,
  onSwing,
}: {
  piece: Piece
  choice: PracticeChoice
  /** What the piece, as it is played, has for its patterns. */
  fit: PatternFit
  /** Null where the meter cannot swing. */
  swing: boolean | null
  onChange: (change: SetupChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const keyName = useKeyName()
  const own = pieceKey(piece)
  const chordSize = choosableChordSize(piece)
  // The recording plays in its own key alone: elsewhere its tile is closed, and says why.
  const ownKey = piece.recording && !isOwnKey(piece, choice.tonic) ? keyName(own) : null
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <NoteChoice
        label={t('key')}
        value={noteParam(choice.tonic)}
        accidentals={(letter) => writtenKeyAccidentals(letter, own.minor)}
        name={(tonic) => keyName({ tonic, minor: own.minor })}
        onChange={(key) => onChange({ key })}
      />
      {chordSize ? (
        <Labelled label={t('music:chordSize.label')}>
          <ChordSizeField
            value={choice.chordSize ?? chordSize}
            onChange={(next) => onChange({ chordSize: next })}
          />
        </Labelled>
      ) : null}
      <PatternCard />
      <PlayingSection
        swing={swing}
        onSwing={onSwing}
        info={ownKey ? t('recordingOnlyIn', { key: ownKey }) : undefined}
      >
        {/* A lead sheet's tune is always heard (ADR 0083). */}
        {fit.tune && !isLeadSheet(piece) ? <TuneToggle /> : null}
        {piece.recording ? <RecordingToggle ownKey={ownKey} /> : null}
      </PlayingSection>
    </PlayerSetup>
  )
}
