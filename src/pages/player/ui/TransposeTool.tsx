import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { asChartPiece, isDegreePiece, pieceKey, type Piece } from '@/entities/piece'
import { firstLine, readDraft, transpose } from '@/features/score-editor'
import { transposedKey, transposition, type SpelledNote } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { PreviewLine, TransposeTool as Transpose } from '@/widgets/transpose'

/** The change Transpose writes to the URL: semitones from the written key, and its two switches. */
interface TransposeChange {
  transpose?: number
  tkey?: false | undefined
  tchords?: false | undefined
}

/**
 * The Player's Transpose (ADR 0105, 0115, R29 T, R31-P): the one Transpose. Opened, it starts from
 * the key the song is played in; − and +, Reset and the two switches change only what it shows: the
 * key it lands in and the first line in that key, its Preview. Transpose plays it so, kept in the URL
 * as an offset from the key the song is written in; closed, it changes nothing. Where the piece's
 * recording falls silent in another key, the ⓘ beside its heading says so.
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
  open: boolean
  onOpenChange: (open: boolean) => void
  piece: Piece
  /** The tonic it is played in. */
  tonic: SpelledNote
  /** Whether the key signature and the chord symbols move with the notes (R29 T). */
  signature: boolean
  chordSymbols: boolean
  onChange: (change: TransposeChange) => void
}) {
  const { t } = useTranslation(['player', 'editor'])
  const own = pieceKey(piece)
  const key = { tonic, minor: own.minor }
  const played = transposition(own.tonic, tonic)
  // What the popover shows until Transpose: from where it was opened.
  const [by, setBy] = useState(played)
  const [applies, setApplies] = useState({ key: signature, chords: chordSymbols })
  const change = (opened: boolean) => {
    if (opened) {
      setBy(played)
      setApplies({ key: signature, chords: chordSymbols })
    }
    onOpenChange(opened)
  }
  const written = useMemo(
    () => readDraft(isDegreePiece(piece) ? asChartPiece(piece) : piece),
    [piece],
  )
  const preview = useMemo(
    () => (open ? firstLine(transpose(written, by, applies)) : null),
    [open, written, by, applies],
  )
  const changed = by !== played || applies.key !== signature || applies.chords !== chordSymbols
  const apply = () => {
    // A switch on is the default, left out of the URL; off, written there.
    onChange({
      transpose: by,
      tkey: applies.key ? undefined : false,
      tchords: applies.chords ? undefined : false,
    })
    onOpenChange(false)
  }
  return (
    <Transpose
      current={key}
      moved={played}
      landing={transposedKey(own, by)}
      by={by}
      home={t(`transpose.own.${piece.kind}`)}
      onBy={setBy}
      signature={applies.key}
      chordSymbols={applies.chords}
      onSignature={(on) => setApplies({ ...applies, key: on })}
      onChordSymbols={(on) => setApplies({ ...applies, chords: on })}
      open={open}
      onOpenChange={change}
    >
      {preview ? <PreviewLine draft={preview} /> : null}
      <Button disabled={!changed} onClick={apply}>
        {t('editor:transpose.apply')}
      </Button>
    </Transpose>
  )
}
