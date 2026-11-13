import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { asChartPiece, isDegreePiece, pieceKey, type Piece } from '@/entities/piece'
import { firstLine, readDraft, transpose } from '@/features/score-editor'
import { transposedKey, transposition, type SpelledNote } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { PreviewLine, TransposeFields } from '@/widgets/transpose'

/** The change Transpose writes to the URL: semitones from the written key, and its two switches. */
interface TransposeChange {
  transpose?: number
  tkey?: false | undefined
  tchords?: false | undefined
}

/**
 * The Player's Transpose, a page of its Settings (its canvas's Song settings › Transpose): the one
 * Transpose control. Opened, it starts from the key the song is played in; − and +, Reset and the
 * two switches change only what it shows: the key it lands in and the first line in that key, its
 * Preview. Transpose plays it so, kept in the URL as an offset from the key the song is written in.
 */
export function TransposePage({
  piece,
  tonic,
  signature,
  chordSymbols,
  onChange,
}: {
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
  const played = transposition(own.tonic, tonic)
  // What the page shows until Transpose: from where it was opened.
  const [by, setBy] = useState(played)
  const [applies, setApplies] = useState({ key: signature, chords: chordSymbols })
  const written = useMemo(
    () => readDraft(isDegreePiece(piece) ? asChartPiece(piece) : piece),
    [piece],
  )
  const preview = useMemo(() => firstLine(transpose(written, by, applies)), [written, by, applies])
  const changed = by !== played || applies.key !== signature || applies.chords !== chordSymbols
  const apply = () => {
    // A switch on is the default, left out of the URL; off, written there.
    onChange({
      transpose: by,
      tkey: applies.key ? undefined : false,
      tchords: applies.chords ? undefined : false,
    })
  }
  return (
    <div className="flex flex-col gap-4">
      <TransposeFields
        landing={transposedKey(own, by)}
        by={by}
        home={t(`transpose.own.${piece.kind}`)}
        onBy={setBy}
        signature={applies.key}
        chordSymbols={applies.chords}
        onSignature={(on) => setApplies({ ...applies, key: on })}
        onChordSymbols={(on) => setApplies({ ...applies, chords: on })}
      />
      {preview ? <PreviewLine draft={preview} /> : null}
      <Button disabled={!changed} onClick={apply}>
        {t('editor:transpose.apply')}
      </Button>
    </div>
  )
}
