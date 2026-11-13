import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { keySymbol, printedSymbol, type Key } from '@/shared/lib/music'
import { STANDARD_TUNING, tuningOf } from '@/shared/lib/schedule'
import { InfoTip } from '@/shared/ui'
import { pieceKey, type Piece } from '../model/types'
import { useTempoText } from './use-tempo-text'

/**
 * A piece's facts in one quiet line under its title (ADR 0111, amended): its key, time and tempo, as
 * a songbook's heading prints them. The key is the one it is played in (`played`), else its own.
 * A recording tuned away from A 440 adds its Tuning, an ⓘ saying what it means (ADR 0107).
 */
export function PieceFactLine({
  piece,
  played,
  keyLink,
}: {
  piece: Piece
  played?: Key
  /**
   * The key as a link (its key on Scales, A28): the value given, wrapped by the page in a link
   * stretched over the chip (`after:absolute after:inset-0`).
   */
  keyLink?: (value: ReactNode) => ReactNode
}) {
  const { t } = useTranslation(['piece', 'music'])
  const tempo = useTempoText(piece)
  const facts: { name: string; value: ReactNode }[] = [
    {
      name: t('music:key.label'),
      value: (
        <span className="font-display">{printedSymbol(keySymbol(played ?? pieceKey(piece)))}</span>
      ),
    },
    { name: t('time'), value: piece.meter },
    { name: t('tempo'), value: tempo },
  ]
  const tuning = tuningOf(piece.recording)
  if (tuning !== STANDARD_TUNING)
    facts.push({
      name: t('tuning.label'),
      value: (
        <span className="inline-flex items-center gap-1">
          {t('tuning.value', { hz: tuning })}
          <InfoTip name={t('tuning.label')}>{t('tuning.about', { hz: tuning })}</InfoTip>
        </span>
      ),
    })
  return (
    <dl className="flex flex-wrap items-center gap-2">
      {facts.map((fact, at) => (
        <div
          key={fact.name}
          className="relative flex h-8 items-center gap-1.5 rounded-pill border border-border bg-card px-3 text-sm has-[a:hover]:bg-muted"
        >
          <dt className="text-muted-foreground">{fact.name}</dt>
          <dd className="font-semibold tabular-nums">
            {at === 0 && keyLink ? keyLink(fact.value) : fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
