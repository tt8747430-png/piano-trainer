import { beatsToTicks, midi, pitchClassOf, simplifyChord } from '@/shared/lib/music'
import type { Chart, ChartBar, HandNote } from './types'

/** The octave the left hand plays each root in: C3 to B3. */
const ROOT_OCTAVE = 48

/** The top line of a hand written note by note: at each onset, its highest note. */
function topLine(notes: readonly HandNote[]): HandNote[] {
  const highest = new Map<number, HandNote>()
  for (const each of notes) {
    const kept = highest.get(each.startTick)
    if (!kept || each.midi > kept.midi) highest.set(each.startTick, each)
  }
  return [...highest.values()].sort((a, b) => a.startTick - b.startTick)
}

/** A bar as the Easy version plays it: the tune its right hand writes, each chord's root under it. */
function easyBar(bar: ChartBar): ChartBar {
  let at = 0
  const roots: HandNote[] = bar.chords.map((chord) => {
    const root: HandNote = {
      midi: midi(ROOT_OCTAVE + pitchClassOf(chord.root)),
      spelled: chord.root,
      startTick: beatsToTicks(at),
      durationTicks: beatsToTicks(chord.beats),
    }
    at += chord.beats
    return root
  })
  return {
    ...bar,
    chords: bar.chords.map(({ beats, method, ...chord }) => ({
      ...simplifyChord(chord),
      beats,
      ...(method === undefined ? {} : { method }),
    })),
    hands: { rh: topLine(bar.hands?.rh ?? []), lh: roots },
  }
}

/**
 * A chart as its Easy version plays it (R29 B8): the tune and each chord's root. The right hand keeps
 * the top line it writes (a tune over chords), else rests while the single staves sing the tune; the
 * left hand plays each chord's root, as long as the chord; each chord is named as its plain triad.
 */
export const easyChart = (chart: Chart): Chart => ({
  ...chart,
  sections: chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) => line.map(easyBar)),
  })),
})
