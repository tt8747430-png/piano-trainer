import type { Performance } from '@/shared/lib/arrangement'
import { pedalLine, type PedalEvent, type Tick } from '@/shared/lib/music'

/**
 * A pedal for music written without one (A27): pressed with each new chord symbol and let up where
 * it ends (a change where the next follows at once, the pedal up through a bar of no chord); where
 * the music has no chord symbols, changed at each bar; let up where the music ends.
 */
export function autoPedal(
  performance: Pick<Performance, 'chords' | 'bars' | 'totalTicks'>,
): PedalEvent[] {
  const presses: { from: Tick; to: Tick }[] = []
  if (performance.chords.length > 0) {
    let symbol: string | undefined
    for (const chord of performance.chords) {
      const last = presses.at(-1)
      const to = chord.startTick + chord.durationTicks
      // The same chord written on: the pedal held through it.
      if (last && chord.symbol === symbol && last.to === chord.startTick) last.to = to
      else presses.push({ from: chord.startTick, to })
      symbol = chord.symbol
    }
  } else
    performance.bars.forEach((bar, i) =>
      presses.push({
        from: bar.startTick,
        to: performance.bars[i + 1]?.startTick ?? performance.totalTicks,
      }),
    )
  // A lift and the next press at one tick are a change.
  return pedalLine(
    presses.flatMap(({ from, to }): PedalEvent[] => [
      { tick: from, kind: 'down' },
      { tick: Math.min(to, performance.totalTicks), kind: 'up' },
    ]),
  )
}

/**
 * The performance with its pedal as it plays (R37, "remove it": no setting): as the score marks it,
 * or `autoPedal`'s where it has no marks.
 */
export function withPedal(performance: Performance): Performance {
  return performance.pedal.length > 0
    ? performance
    : { ...performance, pedal: autoPedal(performance) }
}
