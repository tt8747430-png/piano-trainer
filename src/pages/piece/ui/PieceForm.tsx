import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { chartSections, sectionAnchor } from '@/widgets/chord-chart'

/**
 * The song's form at a glance: its sections in order, each with its bars, each a link down to its
 * place in the chart.
 */
export function PieceForm({
  performance,
  headings,
}: {
  performance: Performance
  headings: readonly string[]
}) {
  const { t } = useTranslation('piece')
  const sections = chartSections(performance)
  if (headings.length < 2) return null
  return (
    <nav aria-label={t('form')} className="flex flex-col gap-2 print:hidden">
      <h2 className="text-sm font-semibold text-muted-foreground">{t('form')}</h2>
      <ol className="flex flex-wrap gap-2">
        {headings.map((heading, section) => {
          const count = (sections[section] ?? []).flat().length
          return (
            <li key={section}>
              <a
                href={`#${sectionAnchor(section)}`}
                className="flex items-baseline gap-2 rounded-full border border-input bg-card px-3.5 py-1.5 transition-colors duration-200 ease-out hover:bg-chosen"
              >
                <span className="font-display font-semibold">{heading}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {t('formBars', { count })}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
