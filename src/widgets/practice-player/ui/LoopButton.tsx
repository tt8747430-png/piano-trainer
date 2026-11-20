import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import { cn } from '@/shared/lib'
import { keyHint } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from '../model/player-keys'
import { FloatingBarButton } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/**
 * The transport's Loop (ADR 0108, R31-P): loops the bar the cursor is in, or removes the loop, as R
 * does. While bars are looped it is honey and named by them, as PlayerApp and PlayerDesk draw it:
 * "5–8" under its picture on a phone, "Bars 5–8" beside it on a laptop.
 */
export function LoopButton({
  bars,
  onToggle,
}: {
  /** The bars looped, as printed (from 1); null while nothing is. */
  bars: BarRange | null
  onToggle: () => void
}) {
  const { t } = useTranslation('player')
  const named = bars
    ? bars.first === bars.last
      ? t('loopOn.bar', { first: bars.first })
      : t('loopOn.bars', { first: bars.first, last: bars.last })
    : null
  const label = named ? t('loopOn.remove', { bars: named }) : t('loop')
  return (
    <FloatingBarButton
      label={label}
      title={keyHint(label, PLAYER_KEYS.loop)}
      aria-pressed={bars !== null}
      caption={
        bars
          ? bars.first === bars.last
            ? String(bars.first)
            : `${bars.first}–${bars.last}`
          : t('loop')
      }
      captionWide={named ?? undefined}
      className={cn(
        DOCK_CAPTIONED,
        bars && 'bg-paint-yellow text-on-paint-yellow hover:bg-paint-yellow',
      )}
      onClick={onToggle}
    >
      <Repeat aria-hidden />
    </FloatingBarButton>
  )
}
