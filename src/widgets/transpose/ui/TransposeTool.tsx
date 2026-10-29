import { ArrowUpDown, Minus, Plus, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { keySymbol, printedSymbol, TRANSPOSITION_RANGE, type Key } from '@/shared/lib/music'
import { Glyph, MenuSection } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { PlayerTool } from '@/widgets/practice-player'

/** How far the music moves, signed as Chordify writes it: `+2`, `−1` with a minus sign. */
const signed = (semitones: number): string =>
  `${semitones > 0 ? '+' : semitones < 0 ? '−' : ''}${Math.abs(semitones)}`

/**
 * Transpose (ADR 0105, 0115), one tool in the Player and the score editor: in the tools row
 * after the View, its arrows and the key the music is in (`current`, as printed: `B♭m`), in the
 * accent once moved (`moved`). Its popover holds the one control both modes share: − the key it
 * lands in + (`landing`, `by` semitones from where it started, `−5` to `+6`, the short way), how far
 * that is (or `home`, the music's own key's name, where it is not moved), and Reset. Under it what
 * a mode adds (`children`: the editor's Apply to key and Apply to chords, its preview and its
 * Transpose button); `info`, the ⓘ beside its heading (the Player's recording, silent in another key).
 */
export function TransposeTool({
  current,
  moved,
  landing,
  by,
  home,
  info,
  onBy,
  disabled = false,
  open,
  onOpenChange,
  children,
}: {
  /** The key the music is in now: the trigger's value. */
  current: Key
  /** Whether it is played in another key than its own: the trigger's value in the accent. */
  moved: boolean
  /** The key the control lands in. */
  landing: Key
  /** How far that is, in semitones. */
  by: number
  /** What the control says where `by` is 0: the song's key, the study's. */
  home: string
  info?: ReactNode
  onBy: (semitones: number) => void
  /** Greyed: the editor's while a take records. */
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}) {
  const { t } = useTranslation('player')
  const keyName = useKeyName()
  const name = keyName(current)
  const landed = keyName(landing)
  return (
    <Popover {...(open === undefined ? {} : { open })} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <PlayerTool
            icon={ArrowUpDown}
            label={
              moved
                ? t('transpose.moved', { key: name, by: signed(by) })
                : t('transpose.of', { key: name })
            }
            name={t('transpose.name')}
            disabled={disabled}
            // The key in its symbol: the label says it in words.
            value={
              <Glyph
                text={printedSymbol(keySymbol(current))}
                className={cn('font-display', moved && 'text-link')}
              />
            }
          />
        }
      />
      <PopoverContent
        aria-label={t('transpose.title')}
        align="start"
        className="max-h-[80dvh] w-88 max-w-[calc(100vw-2rem)] gap-4 overflow-y-auto overscroll-contain p-4"
      >
        <MenuSection title={t('transpose.title')} info={info} className="gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={t('transpose.down')}
              title={t('transpose.down')}
              disabled={by <= TRANSPOSITION_RANGE.min}
              onClick={() => onBy(by - 1)}
            >
              <Minus aria-hidden />
            </Button>
            <p aria-live="polite" className="flex min-w-0 flex-1 flex-col items-center text-center">
              <span className="text-lg font-semibold">{landed}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {by === 0
                  ? home
                  : t('transpose.semitones', { count: Math.abs(by), by: signed(by) })}
              </span>
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label={t('transpose.up')}
              title={t('transpose.up')}
              disabled={by >= TRANSPOSITION_RANGE.max}
              onClick={() => onBy(by + 1)}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          <Button variant="outline" disabled={by === 0} onClick={() => onBy(0)}>
            <RotateCcw data-icon="inline-start" aria-hidden />
            {t('transpose.reset')}
          </Button>
        </MenuSection>
        {children}
      </PopoverContent>
    </Popover>
  )
}
