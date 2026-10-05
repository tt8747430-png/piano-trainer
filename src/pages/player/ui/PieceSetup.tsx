import { useTranslation } from 'react-i18next'
import { choosableChordSize, isOwnKey, pieceKey, type Piece } from '@/entities/piece'
import { walksKeys, type PracticeChoice } from '@/features/practice'
import type { PatternFit } from '@/entities/pattern'
import { useKeyName } from '@/shared/i18n'
import { noteParam, tonicSpelling } from '@/shared/lib/music'
import { ChordSizeField, NotePicker, ToggleGrid } from '@/shared/ui'
import {
  KeyWalkField,
  MelodyToggle,
  PatternCard,
  PlayerSetup,
  RecordingToggle,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingToggles } from '@/widgets/practice-player'

/** A piece's Setup: its key (a progression's walk through the keys), the pattern and figures, its chord size, melody and recording where it has them, and how it plays. */
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
  const { t } = useTranslation('player')
  const keyName = useKeyName()
  const own = pieceKey(piece)
  const chordSize = choosableChordSize(piece)
  return (
    <PlayerSetup figures={choice} fit={fit} onFigures={onChange}>
      <NotePicker
        label={t('key')}
        value={noteParam(choice.tonic)}
        spell={(pc) => tonicSpelling(pc, own.minor)}
        name={(tonic) => keyName({ tonic, minor: own.minor })}
        onChange={(key) => onChange({ key })}
      />
      {walksKeys(piece) ? (
        <KeyWalkField value={choice.walk} onChange={(walk) => onChange({ walk })} />
      ) : null}
      <PatternCard />
      {chordSize ? (
        <ChordSizeField
          value={choice.chordSize ?? chordSize}
          onChange={(next) => onChange({ chordSize: next })}
        />
      ) : null}
      <ToggleGrid label={t('playing')}>
        <PlayingToggles swing={swing} onSwing={onSwing} />
        {fit.melody ? <MelodyToggle /> : null}
        {piece.recording ? (
          <RecordingToggle ownKey={isOwnKey(piece, choice.tonic) ? null : keyName(own)} />
        ) : null}
      </ToggleGrid>
    </PlayerSetup>
  )
}
