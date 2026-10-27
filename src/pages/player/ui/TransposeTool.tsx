import { useTranslation } from 'react-i18next'
import { pieceKey, type Piece } from '@/entities/piece'
import { useKeyName } from '@/shared/i18n'
import {
  noteParam,
  transposedKey,
  transposition,
  type NoteParam,
  type SpelledNote,
} from '@/shared/lib/music'
import { TransposeTool as Transpose } from '@/widgets/transpose'

/**
 * The Player's Transpose (ADR 0105, 0115): the one Transpose, moving the key it is played in at once,
 * a semitone at a time, kept in the URL as its tonic. Where the piece's recording falls silent in
 * another key, the ⓘ beside its heading says so.
 */
export function TransposeTool({
  piece,
  tonic,
  onChange,
}: {
  piece: Piece
  /** The tonic it is played in. */
  tonic: SpelledNote
  /** The key's tonic chosen: the piece's own goes back to it. */
  onChange: (key: NoteParam) => void
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
      onBy={(semitones) => onChange(noteParam(transposedKey(own, semitones).tonic))}
    />
  )
}
