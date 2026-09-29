import { useTranslation } from 'react-i18next'
import { hasMethodCodes, melodyOf, pieceKey, type Piece } from '@/entities/piece'
import type { PracticeChoice } from '@/features/practice'
import { noteName, noteParam, PITCH_CLASSES, tonicSpelling } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import {
  ChordSizeField,
  FigureRows,
  MelodySwitch,
  PlayerSetup,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'

/** A piece's Setup: its key, the pattern and figures, its chord size and melody where it has them, and how it plays. */
export function PieceSetup({
  open,
  onOpenChange,
  piece,
  choice,
  swing,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  choice: PracticeChoice
  /** Null where the meter cannot swing. */
  swing: boolean | null
  onChange: (change: SetupChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const { minor } = pieceKey(piece)
  const hasMelody = melodyOf(piece) !== undefined
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={hasMethodCodes(piece)}
      melody={hasMelody}
      keyed
      onFigures={onChange}
    >
      <Dropdown
        label={t('key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, minor)
          return {
            value: noteParam(tonic),
            label: t(minor ? 'keyOf.minor' : 'keyOf.major', { tonic: noteName(tonic) }),
          }
        })}
        onChange={(key) => onChange({ key })}
      />
      <FigureRows />
      {piece.kind === 'progression' && piece.chordSize.choosable ? (
        <ChordSizeField
          value={choice.chordSize ?? piece.chordSize.default}
          onChange={(chordSize) => onChange({ chordSize })}
        />
      ) : null}
      {hasMelody ? <MelodySwitch /> : null}
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
