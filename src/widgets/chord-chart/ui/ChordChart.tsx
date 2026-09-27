import { isMethodCode, METHODS } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { beatsPerBar, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { chartSections } from '../model/chart-sections'
import { BarButton } from './BarButton'

/**
 * A Chart's bars with their numbers and chords, by section, line by line; a tap plays a bar, which is
 * pressed while it sounds.
 */
export function ChordChart({
  performance,
  headings,
  playing,
  onBar,
}: {
  performance: Performance
  headings: readonly string[]
  /** The bar sounding, if any. */
  playing: number | null
  onBar: (bar: number) => void
}) {
  const locale = useLocale()

  const barOf = (index: number) => {
    const bar = performance.bars[index]
    if (!bar) return null
    const chords = bar.chords.map((i) => performance.chords[i]).filter((c) => c !== undefined)
    const methods = [...new Set(chords.map((c) => c.method).filter((m) => m !== undefined))]
      .filter(isMethodCode)
      .map((code) => localText(METHODS[code].label, locale))
    const notes =
      bar.beats === beatsPerBar(performance.meter)
        ? methods
        : [...methods, timeSignatureText(timeSignature(bar.beats, performance.meter))]
    return (
      <BarButton
        key={index}
        number={index + 1}
        symbols={chords.map((c) => c.symbol)}
        notes={notes}
        pressed={playing === index}
        onClick={() => onBar(index)}
      />
    )
  }

  const bars = chartSections(performance)
  const sections = headings.map((heading, section) => ({ heading, lines: bars[section] ?? [] }))
  /** The longest line's bars: every line's bars are as wide as its, so bars line up down the chart. */
  const longest = Math.max(1, ...sections.flatMap(({ lines }) => lines.map((line) => line.length)))

  return (
    <div className="flex flex-col gap-6">
      {sections.map(({ heading, lines }, section) => (
        <section key={section} className="flex flex-col gap-2">
          <h3 className="text-lg">{heading}</h3>
          {lines.map((bars, line) => (
            <div
              key={line}
              className="grid border-r border-input"
              style={{
                gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
                width: `${(bars.length / longest) * 100}%`,
              }}
            >
              {bars.map(barOf)}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
