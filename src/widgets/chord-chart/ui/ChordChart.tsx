import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { METHODS } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { longestLine } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { chartBar, chartSections, sectionAnchor, type SectionBars } from '../model/chart-sections'
import { BarButton } from './BarButton'

/** The widest a bar is drawn, in rem. */
const BAR_MOST = 14

/**
 * A Chart's bars with their numbers and chords, by section, line by line; each section under a
 * heading that says its bars, with what the page offers for it (`sectionAction`, Practise it); a tap
 * plays a bar, which is pressed while it sounds.
 */
export function ChordChart({
  performance,
  headings,
  playing,
  onBar,
  sectionAction,
}: {
  performance: Performance
  headings: readonly string[]
  /** The bar sounding, if any. */
  playing: number | null
  onBar: (bar: number) => void
  sectionAction?: (bars: SectionBars, section: number) => ReactNode
}) {
  const { t } = useTranslation('piece')
  const locale = useLocale()

  const barOf = (index: number) => {
    const bar = chartBar(performance, index)
    if (!bar) return null
    return (
      <BarButton
        key={index}
        number={index + 1}
        symbols={bar.symbols}
        notes={[
          ...bar.methods.map((code) => localText(METHODS[code].label, locale)),
          ...(bar.signature ? [bar.signature] : []),
        ]}
        pressed={playing === index}
        onClick={() => onBar(index)}
      />
    )
  }

  const bars = chartSections(performance)
  const sections = headings.map((heading, section) => ({ heading, lines: bars[section] ?? [] }))
  // Every line's bars are as wide as the longest line's, so bars line up down the chart.
  const { longest, shareOf } = longestLine(
    sections.flatMap(({ lines }) => lines.map((line) => line.length)),
  )

  return (
    // A bar is at most a few chords wide: on a laptop a line of two bars reads as one glance, not
    // across the screen; the lines keep their shares within it.
    <div className="flex flex-col gap-6" style={{ maxWidth: `${longest * BAR_MOST}rem` }}>
      {sections.map(({ heading, lines }, section) => {
        const all = lines.flat()
        const bars = { first: Math.min(...all), last: Math.max(...all) }
        return (
          <section
            key={section}
            id={sectionAnchor(section)}
            aria-labelledby={`${sectionAnchor(section)}-heading`}
            className="flex scroll-mt-24 flex-col gap-2"
          >
            <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <div className="flex items-baseline gap-2">
                <h3 id={`${sectionAnchor(section)}-heading`} className="text-xl">
                  {heading}
                </h3>
                {all.length > 0 ? (
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {bars.first === bars.last
                      ? t('barOne', { n: bars.first + 1 })
                      : t('barsFromTo', { first: bars.first + 1, last: bars.last + 1 })}
                  </span>
                ) : null}
              </div>
              {all.length > 0 && sectionAction ? sectionAction(bars, section) : null}
            </header>
            {lines.map((bars, line) => (
              <div
                key={line}
                className="grid border-r border-input break-inside-avoid"
                style={{
                  gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
                  width: `${shareOf(bars.length) * 100}%`,
                }}
              >
                {bars.map(barOf)}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
