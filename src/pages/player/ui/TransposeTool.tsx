import { ArrowUpDown, Minus, Plus, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceKey, type Piece } from '@/entities/piece'
import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  keySymbol,
  noteParam,
  printedSymbol,
  transposedKey,
  transposition,
  TRANSPOSITION_RANGE,
  type NoteParam,
  type SpelledNote,
} from '@/shared/lib/music'
import { MenuSection } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { PlayerTool } from '@/widgets/practice-player'

/** How far the music moved, as Chordify writes it: `+2`, `−1` with a minus sign. */
const signed = (semitones: number): string => `${semitones > 0 ? '+' : '−'}${Math.abs(semitones)}`

/**
 * The tools row's Transpose (ADR 0104, Chordify's): the key the music is in, as printed (`B♭m`), in
 * the accent once moved from the piece's own. Its popover moves it a semitone down or up, as far as
 * the music moves the short way, names the key it lands in and how far that is from the piece's own,
 * and goes back to it; where the piece's recording falls silent in another key, the ⓘ beside its
 * heading says so.
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
  const name = keyName(key)
  const moveTo = (semitones: number) => onChange(noteParam(transposedKey(own, semitones).tonic))
  return (
    <Popover>
      <PopoverTrigger
        render={
          <PlayerTool
            icon={ArrowUpDown}
            label={
              by === 0
                ? t('transpose.of', { key: name })
                : t('transpose.moved', { key: name, by: signed(by) })
            }
            name={t('transpose.name')}
            value={
              <span className={cn('font-display', by !== 0 && 'text-link')}>
                {printedSymbol(keySymbol(key))}
              </span>
            }
          />
        }
      />
      <PopoverContent
        aria-label={t('transpose.title')}
        align="start"
        className="w-80 max-w-[calc(100vw-2rem)] p-4"
      >
        <MenuSection
          title={t('transpose.title')}
          // The recording plays along in the piece's own key alone.
          info={
            piece.recording && by !== 0 ? t('recordingOnlyIn', { key: keyName(own) }) : undefined
          }
          className="gap-3"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={t('transpose.down')}
              title={t('transpose.down')}
              disabled={by <= TRANSPOSITION_RANGE.min}
              onClick={() => moveTo(by - 1)}
            >
              <Minus aria-hidden />
            </Button>
            <p aria-live="polite" className="flex min-w-0 flex-1 flex-col items-center text-center">
              <span className="text-lg font-semibold">{name}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {by === 0 ? t(`transpose.own.${piece.kind}`) : signed(by)}
              </span>
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label={t('transpose.up')}
              title={t('transpose.up')}
              disabled={by >= TRANSPOSITION_RANGE.max}
              onClick={() => moveTo(by + 1)}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          <Button variant="outline" disabled={by === 0} onClick={() => moveTo(0)}>
            <RotateCcw data-icon="inline-start" aria-hidden />
            {t('transpose.reset')}
          </Button>
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
