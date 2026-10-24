import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { chartSections, sectionBars } from '@/widgets/chord-chart'

/**
 * The song's form at a glance: its sections in order, each with its bars, each opening the Player
 * there, looping it (ADR 0098).
 */
export function PieceForm({
  pieceId,
  performance,
  headings,
}: {
  pieceId: PieceId
  performance: Performance
  headings: readonly string[]
}) {
  const { t } = useTranslation('piece')
  const sections = chartSections(performance)
  if (headings.length < 2) return null
  return (
    <nav aria-label={t('form')} className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-muted-foreground">{t('form')}</h2>
      <ol className="flex flex-wrap gap-2">
        {headings.map((heading, section) => {
          const bars = sectionBars(sections[section] ?? [])
          if (!bars) return null
          return (
            <li key={section}>
              <Link
                to="/play/$pieceId"
                params={{ pieceId }}
                search={{ loop: loopParam(bars) }}
                state={OPEN_PLAINLY}
                aria-label={t('practiseSectionOf', { section: heading })}
                className="flex min-h-11 items-baseline gap-2 rounded-full border border-input bg-card px-3.5 py-1.5 transition-colors duration-200 ease-out hover:bg-chosen"
              >
                <Play aria-hidden className="size-4 shrink-0 self-center text-muted-foreground" />
                <span className="font-display font-semibold">{heading}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {t('formBars', { count: bars.last - bars.first + 1 })}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
