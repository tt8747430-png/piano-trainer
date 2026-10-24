import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { METHODS } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { cn, longestLine, useScrollMotion } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { chartBar, chartSections, sectionAnchor, sectionBars } from '../model/chart-sections'
import { BarButton, type BarTap } from './BarButton'

/** The widest a bar is drawn, in rem. */
const BAR_MOST = 14

/**
 * A Chart's bars as written, with their numbers and chords, by section, line by line; each section
 * under a heading that says its bars. The bar playing is marked: on a song's chart a tap plays a bar,
 * pressed while it sounds; on the Player's (`tap="go"`, ADR 0098) a tap goes there, and the bar the
 * Player is in stays in sight as the music moves on.
 */
export function ChordChart({
  performance,
  headings,
  tap = 'play',
  playing,
  onBar,
  className,
}: {
  performance: Performance
  headings: readonly string[]
  tap?: BarTap
  /** The bar playing, as written: the one sounding, or the one the Player is in. */
  playing: number | null
  onBar: (bar: number) => void
  /** Where it stands in its page. */
  className?: string
}) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  // Read once a performance: the Player's chart renders again as each beat plays.
  const sections = useMemo(() => {
    const bars = chartSections(performance)
    return headings.map((heading, section) => {
      const lines = bars[section] ?? []
      return {
        heading,
        bars: sectionBars(lines),
        lines: lines.map((line) =>
          line.flatMap((written) => {
            const bar = chartBar(performance, written)
            if (!bar) return []
            const methods = bar.methods.map((code) => localText(METHODS[code].label, locale))
            const notes = bar.signature ? [...methods, bar.signature] : methods
            return [{ written, symbols: bar.symbols, notes }]
          }),
        ),
      }
    })
  }, [performance, headings, locale])
  // Every line's bars are as wide as the longest line's, so bars line up down the chart.
  const { longest, shareOf } = longestLine(
    sections.flatMap(({ lines }) => lines.map((line) => line.length)),
  )
  // The bar the Player is in, brought into sight as it moves on, as its sheet brings the line playing.
  const here = useRef<HTMLButtonElement>(null)
  const motion = useScrollMotion()
  useEffect(() => {
    if (tap === 'go') here.current?.scrollIntoView({ block: 'nearest', behavior: motion })
  }, [tap, playing, motion])

  return (
    // A bar is at most a few chords wide: on a laptop a line of two bars reads as one glance, not
    // across the screen; the lines keep their shares within it.
    <div
      className={cn('flex flex-col gap-6', className)}
      style={{ maxWidth: `${longest * BAR_MOST}rem` }}
    >
      {sections.map(({ heading, bars, lines }, section) => (
        <section
          key={section}
          id={sectionAnchor(section)}
          aria-labelledby={`${sectionAnchor(section)}-heading`}
          className="flex flex-col gap-2"
        >
          <header className="flex items-baseline gap-2">
            <h2 id={`${sectionAnchor(section)}-heading`} className="text-xl">
              {heading}
            </h2>
            {bars ? (
              <span className="text-sm text-muted-foreground tabular-nums">
                {bars.first === bars.last
                  ? t('barOne', { n: bars.first + 1 })
                  : t('barsFromTo', { first: bars.first + 1, last: bars.last + 1 })}
              </span>
            ) : null}
          </header>
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid border-r border-input break-inside-avoid"
              style={{
                gridTemplateColumns: `repeat(${line.length}, minmax(0, 1fr))`,
                width: `${shareOf(line.length) * 100}%`,
              }}
            >
              {line.map(({ written, symbols, notes }) => (
                <BarButton
                  key={written}
                  ref={playing === written ? here : undefined}
                  tap={tap}
                  number={written + 1}
                  symbols={symbols}
                  notes={notes}
                  marked={playing === written}
                  onClick={() => onBar(written)}
                />
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
