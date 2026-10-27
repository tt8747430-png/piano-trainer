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
import type { PatternFit } from '@/entities/pattern'
import { selectMelody, useSettings } from '@/entities/settings'
import type { PracticeChoice } from '@/features/practice'
import { useKeyName } from '@/shared/i18n'
import type { SwingFeel } from '@/shared/lib/schedule'
import { ChordSizeField, Labelled } from '@/shared/ui'
import {
  MelodyField,
  melodyOf,
  PatternCard,
  PlayerSetup,
  type SetupChange,
} from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'

/**
 * A piece's Setup: its chord size (a song's written in degrees, greyed while Simplify plays every
 * chord as its triad, its ⓘ saying so), the pattern and its two hands, the right hand's first chord,
 * and how it plays: Swing and the Melody, the song's top staff by its name or its recording (ADR
 * 0115). Its key is the tools row's Transpose (ADR 0105).
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
  swing: SwingFeel | null
  /** Whether Simplify plays the piece's chords as triads. */
  simple: boolean
  onChange: (change: SetupChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const keyName = useKeyName()
  const chordSize = choosableChordSize(piece)
  const saved = useSettings(selectMelody)
  const melody = melodyOf(saved, {
    staff: fit.tune,
    recording: piece.recording !== undefined,
    inOwnKey: isOwnKey(piece, choice.tonic),
    leadSheet: isLeadSheet(piece),
  })
  // The top single staff by its name, as the View's chip names it (ADR 0097).
  const [topName] = useStaffNames(isDegreePiece(piece) ? undefined : piece.staves)
  const staffTitle = useStaffTitle()
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
      <PlayingSection swing={swing} onSwing={onSwing}>
        <MelodyField
          melody={melody}
          staff={fit.tune ? staffTitle(topName, 0) : t('melody.staff')}
          ownKey={keyName(pieceKey(piece))}
        />
      </PlayingSection>
    </PlayerSetup>
  )
}
