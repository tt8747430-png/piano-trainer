import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { isMethodCode, METHODS } from '@/entities/pattern'
import { barLength, type Meter } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { cn, useMediaQuery } from '@/shared/lib'
import { BarButton } from './BarButton'

/** A Chart's bars with their numbers and chords, by section: line by line to read, or one strip to follow. */
export function ChordChart({
  performance,
  headings,
  meter,
  layout,
  current = null,
  onBar,
}: {
  performance: Performance
  headings: readonly string[]
  meter: Meter
  layout: 'lines' | 'strip'
  current?: number | null
  onBar: (bar: number) => void
}) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const strip = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // The strip scrolls itself to centre the current bar; scrollIntoView would scroll every
  // scrollable ancestor too, the Player's own layout included.
  useEffect(() => {
    const row = strip.current
    const bar = current === null ? undefined : buttons.current[current]
    if (!row || !bar || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({
      left: bar.offsetLeft - (row.clientWidth - bar.offsetWidth) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [current, reduceMotion])

  const barOf = (index: number) => {
    const bar = performance.bars[index]
    if (!bar) return null
    const chords = bar.chords.map((i) => performance.chords[i]).filter((c) => c !== undefined)
    const methods = [...new Set(chords.map((c) => c.method).filter((m) => m !== undefined))]
      .filter(isMethodCode)
      .map((code) => localText(METHODS[code].label, locale))
    const notes =
      bar.beats === performance.beatsPerBar ? methods : [...methods, barLength(bar.beats, meter)]
    return (
      <BarButton
        key={index}
        ref={(element) => {
          buttons.current[index] = element
        }}
        number={index + 1}
        symbols={chords.map((c) => c.symbol)}
        notes={notes}
        current={current === index}
        onClick={() => onBar(index)}
      />
    )
  }

  const sections = headings.map((heading, section) => ({
    heading,
    lines: [
      ...new Set(performance.bars.flatMap((b) => (b.section === section ? [b.line] : []))),
    ].map((line) =>
      performance.bars.flatMap((b, i) => (b.section === section && b.line === line ? [i] : [])),
    ),
  }))

  if (layout === 'strip') {
    return (
      <div
        ref={strip}
        role="group"
        aria-label={t('chart')}
        className="relative -mx-4 flex snap-x scroll-px-4 overflow-x-auto border-y border-border bg-card px-4 scrollbar-none landscape-phone:mx-0 landscape-phone:rounded-2xl landscape-phone:border landscape-phone:px-0"
      >
        {sections.flatMap(({ heading, lines }) =>
          lines.flat().map((index, i) => (
            <div key={index} className="flex shrink-0 snap-center flex-col">
              <span
                className={cn(
                  'h-5 px-2.5 pt-1 text-xs font-semibold text-muted-foreground',
                  i > 0 && 'invisible',
                )}
              >
                {heading}
              </span>
              {barOf(index)}
            </div>
          )),
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      {sections.map(({ heading, lines }, section) => (
        <section key={section} className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{heading}</h3>
          {lines.map((bars, line) => (
            <div key={line} className="flex flex-wrap border-r-2 border-foreground/80">
              {bars.map(barOf)}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
