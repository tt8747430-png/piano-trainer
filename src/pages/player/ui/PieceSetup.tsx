import { useTranslation } from 'react-i18next'
import { choosableChordSize, isOwnKey, pieceFit, pieceKey, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { useKeyName } from '@/shared/i18n'
import { noteParam, tonicSpelling } from '@/shared/lib/music'
import { ChordSizeField, NoteDropdown } from '@/shared/ui'
import {
  FigureRows,
  MelodySwitch,
  PlayerSetup,
  RecordingSwitch,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'

/** A piece's Setup: its key, the pattern and figures, its chord size, melody and recording where it has them, and how it plays. */
export function PieceSetup({
  piece,
  choice,
  swing,
  onChange,
  onSwing,
}: {
  piece: Piece
  choice: PracticeChoice
  /** Null where the meter cannot swing. */
  swing: boolean | null
  onChange: (change: SetupChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const keyName = useKeyName()
  const own = pieceKey(piece)
  const fit = pieceFit(piece)
  const chordSize = choosableChordSize(piece)
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <NoteDropdown
        label={t('key')}
        value={noteParam(choice.tonic)}
        spell={(pc) => tonicSpelling(pc, own.minor)}
        name={(tonic) => keyName({ tonic, minor: own.minor })}
        onChange={(key) => onChange({ key })}
      />
      <FigureRows />
      {chordSize ? (
        <ChordSizeField
          value={choice.chordSize ?? chordSize}
          onChange={(next) => onChange({ chordSize: next })}
        />
      ) : null}
      {fit.melody ? <MelodySwitch /> : null}
      {piece.recording ? (
        <RecordingSwitch ownKey={isOwnKey(piece, choice.tonic) ? null : keyName(own)} />
      ) : null}
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
