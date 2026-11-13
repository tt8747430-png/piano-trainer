import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { TRANSPOSITION_RANGE, type Key } from '@/shared/lib/music'
import { MenuSection, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** How far the music moves, signed as Chordify writes it: `+2`, `−1` with a minus sign. */
const signed = (semitones: number): string =>
  `${semitones > 0 ? '+' : semitones < 0 ? '−' : ''}${Math.abs(semitones)}`

/** What the one Transpose control is given: the key, how far it moves, and the two switches. */
interface TransposeProps {
  /** The key the control lands in. */
  landing: Key
  /** How far that is, in semitones. */
  by: number
  /** What the control says where `by` is 0: the song's key, the study's. */
  home: string
  info?: ReactNode
  onBy: (semitones: number) => void
  /** Transpose key signature (R29 T, Dorico's and MuseScore's words): off, the signature stays. */
  signature: boolean
  /** Transpose chord symbols: off, the symbols print as written over the moved chords. */
  chordSymbols: boolean
  onSignature: (on: boolean) => void
  onChordSymbols: (on: boolean) => void
}

/**
 * The one Transpose control (ADR 0105, 0115, R29 T), the Player's popover's and the score editor's
 * gear page's: − the key it lands in +, how far that is (or `home`, where it is not moved), Reset,
 * and the two switches both modes share; `info`, the ⓘ beside its heading.
 */
export function TransposeFields({
  landing,
  by,
  home,
  info,
  onBy,
  signature,
  chordSymbols,
  onSignature,
  onChordSymbols,
}: TransposeProps) {
  const { t } = useTranslation('player')
  const keyName = useKeyName()
  const landed = keyName(landing)
  return (
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
            {by === 0 ? home : t('transpose.semitones', { count: Math.abs(by), by: signed(by) })}
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
      <div className="flex flex-col border-t border-hairline pt-2">
        <SwitchRow
          label={t('transpose.signature')}
          info={t('transpose.signatureInfo')}
          checked={signature}
          onCheckedChange={onSignature}
        />
        <SwitchRow
          label={t('transpose.chordSymbols')}
          info={t('transpose.chordSymbolsInfo')}
          checked={chordSymbols}
          onCheckedChange={onChordSymbols}
          className="border-b-0"
        />
      </div>
    </MenuSection>
  )
}
