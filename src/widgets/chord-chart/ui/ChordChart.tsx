import { useEffect, useRef } from 'react'
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
  const locale = useLocale()
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (layout !== 'strip' || current === null) return
    buttons.current[current]?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [layout, current, reduceMotion])

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
      <div className="-mx-4 flex snap-x overflow-x-auto border-y border-border bg-card px-4 scrollbar-none">
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
