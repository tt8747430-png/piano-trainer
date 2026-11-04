import { useTranslation } from 'react-i18next'
import { pieceKey, type Piece } from '@/entities/piece'
import { useKeyName } from '@/shared/i18n'
import { transposition, type SpelledNote } from '@/shared/lib/music'
import { TransposeTool as Transpose } from '@/widgets/transpose'

/**
 * The Player's Transpose (ADR 0105, 0115, R29 T): the one Transpose, moving the key it is played in
 * at once, a semitone at a time, kept in the URL as an offset from the key the song is written in. Where the piece's recording falls silent in
 * another key, the ⓘ beside its heading says so.
 */
export function TransposeTool({
  piece,
  tonic,
  signature,
  chordSymbols,
  onChange,
  open,
  onOpenChange,
}: {
  /** Its popover open, where the screen opens it (the Tools sheet's Transpose, R29 B8). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  piece: Piece
  /** The tonic it is played in. */
  tonic: SpelledNote
  /** Whether the key signature and the chord symbols move with the notes (R29 T). */
  signature: boolean
  chordSymbols: boolean
  /** A change: semitones from the key it is written in (0 goes back to it), or a switch. */
  onChange: (change: { transpose?: number; tkey?: false; tchords?: false }) => void
}) {
  const { t } = useTranslation('player')
  const keyName = useKeyName()
  const own = pieceKey(piece)
  const key = { tonic, minor: own.minor }
  const by = transposition(own.tonic, tonic)
  return (
    <Transpose
      current={key}
      moved={by !== 0}
      landing={key}
      by={by}
      home={t(`transpose.own.${piece.kind}`)}
      // The recording plays along in the piece's own key alone.
      info={piece.recording && by !== 0 ? t('recordingOnlyIn', { key: keyName(own) }) : undefined}
      onBy={(transpose) => onChange({ transpose })}
      signature={signature}
      chordSymbols={chordSymbols}
      // A switch on is the default, left out of the URL; off, written there.
      onSignature={(on) => onChange(on ? { tkey: undefined } : { tkey: false })}
      onChordSymbols={(on) => onChange(on ? { tchords: undefined } : { tchords: false })}
      {...(open === undefined ? {} : { open })}
      {...(onOpenChange ? { onOpenChange } : {})}
    />
  )
}
