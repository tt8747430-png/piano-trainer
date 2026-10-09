import {
  beatsBefore,
  beatsPerBar,
  beatsToTicks,
  chordBass,
  chordSymbol,
  midi,
  pitchClass,
  pitchClassOf,
  spellChord,
  TICKS_PER_BEAT,
  transposeNote,
  type Chord,
  type Hand,
  type Inversion,
  type Key,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import {
  autoFingers,
  chordContext,
  spellInChord,
  tokenNotes,
  type ChordContext,
} from './chord-context'
import type {
  BeatGroup,
  Chart,
  ChartChord,
  EventFigure,
  EventPattern,
  Figure,
  HandNote,
  Melody,
  MelodyFigure,
  MelodyNote,
  MelodyPattern,
  Pattern,
  Performance,
  PerformanceBar,
  PerformanceNote,
  PerformedChord,
  WrittenHands,
} from './types'

export interface ArrangeOptions {
  /** The tonic to transpose to; the chart's mode stays. */
  readonly tonic: SpelledNote
  /** Every chord's pattern… */
  readonly pattern: Pattern
  /** …unless its method code is here: the chart's own plan. */
  readonly methods?: ReadonlyMap<string, Pattern>
  /** Replaces every pattern's right hand. */
  readonly rh?: Figure
  /** Replaces every pattern's left hand. */
  readonly lh?: EventFigure
  /** The tune, in the chart's key. */
  readonly melody?: Melody
  /** Also play the tune an octave up (hand 'melody'). */
  readonly doubleMelody?: boolean
  /** The right hand's chord in this inversion every time; left out, each voice-led from the last. */
  readonly inversion?: Inversion
}

const VELOCITY = {
  left: 0.2,
  right: 0.12,
  accent: 0.17,
  tune: 0.19,
  harmony: 0.11,
  doubled: 0.15,
} as const

/** A chart chord on the timeline, with the bar it sits in. */
interface PlacedChord {
  readonly chord: ChartChord
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly bar: number
  readonly offsetInBar: Tick
}

interface Layout {
  readonly chords: readonly PlacedChord[]
  readonly bars: readonly PerformanceBar[]
  /** Each bar's hands written note by note, by bar. */
  readonly hands: readonly (WrittenHands | undefined)[]
  /** Bars that open or close their line. */
  readonly lineEnds: ReadonlySet<number>
  readonly totalTicks: Tick
  /** The ticks of the meter's bar a pickup leaves out before it; 0 without one. */
  readonly pickup: Tick
}

function layOut(chart: Chart): Layout {
  const chords: PlacedChord[] = []
  const bars: PerformanceBar[] = []
  const hands: (WrittenHands | undefined)[] = []
  const lineEnds = new Set<number>()
  const written = chart.sections.flatMap((section) => section.lines.flat())
  // A pickup is the end of a bar: its chords sit where they fall in the meter's bar.
  const pickup = beatsBefore(written, 0, chart.meter) * TICKS_PER_BEAT
  let tick = 0
  chart.sections.forEach((section, sectionIndex) =>
    section.lines.forEach((line, lineIndex) =>
      line.forEach((bar, barInLine) => {
        const index = bars.length
        const barStart = tick
        const gridStart = tick - (index === 0 ? pickup : 0)
        if (barInLine === 0 || barInLine === line.length - 1) lineEnds.add(index)
        const chordIndexes = bar.chords.map((chord) => {
          const durationTicks = beatsToTicks(chord.beats)
          chords.push({
            chord,
            startTick: tick,
            durationTicks,
            bar: index,
            offsetInBar: tick - gridStart,
          })
          tick += durationTicks
          return chords.length - 1
        })
        hands.push(bar.hands)
        bars.push({
          startTick: barStart,
          beats: bar.beats,
          section: sectionIndex,
          line: lineIndex,
          chords: chordIndexes,
        })
      }),
    ),
  )
  return { chords, bars, hands, lineEnds, totalTicks: tick, pickup }
}

/** The index of the last start at or before `tick`: which chord or bar is sounding then. */
function sounding(starts: readonly Tick[], tick: Tick): number {
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if ((starts[middle] ?? 0) <= tick) low = middle
    else high = middle - 1
  }
  return low
}

/** Keeps the chord's letters: its root moves by the interval between tonics, its bass likewise. */
export function transposeChord(chord: Chord, from: SpelledNote, to: SpelledNote): Chord {
  const root = transposeNote(chord.root, from, to)
  if (!chord.bass) return { root, quality: chord.quality }
  return {
    root,
    quality: chord.quality,
    bass: chordBass(root, chord.quality, transposeNote(chord.bass, from, to)),
  }
}

/** Written notes (a tune, a hand) move the short way, −5 to +6 semitones, their letters with the key. */
export function transposeNotes<N extends { readonly midi: Midi; readonly spelled: SpelledNote }>(
  notes: readonly N[],
  from: SpelledNote,
  to: SpelledNote,
): N[] {
  const up = pitchClass(pitchClassOf(to) - pitchClassOf(from))
  const semitones = up > 6 ? up - 12 : up
  return notes.map((n) => ({
    ...n,
    midi: midi(n.midi + semitones),
    spelled: transposeNote(n.spelled, from, to),
  }))
}

const isMelodyPattern = (pattern: Pattern): pattern is MelodyPattern => pattern.rh.kind === 'melody'

function patternFor(method: string | undefined, options: ArrangeOptions, hasMelody: boolean) {
  const planned = method === undefined ? undefined : options.methods?.get(method)
  const pattern = planned ?? options.pattern
  return isMelodyPattern(pattern) && !hasMelody ? pattern.withoutMelody : pattern
}

/** A right hand that plays the tune plays its fallback when there is no tune. */
const playable = (figure: Figure, hasMelody: boolean): Figure =>
  figure.kind === 'melody' && !hasMelody ? figure.withoutMelody : figure

/** What the right hand plays in a bar: `ends` plays the tune in a line's first and last bars only. */
const inBar = (figure: Figure, atLineEnd: boolean): Figure =>
  figure.kind === 'melody' && figure.use === 'ends' && !atLineEnd ? figure.between : figure

/** Where a stretch of a chord sits in pattern time and on the timeline. */
interface Window {
  /** Pattern ticks [from, to). */
  readonly from: Tick
  readonly to: Tick
  /** The timeline tick `from` plays at. */
  readonly at: Tick
  readonly chord: number
}

function playFigure(
  figure: EventFigure,
  context: ChordContext,
  hand: Hand,
  window: Window,
  barBeats: number,
): PerformanceNote[] {
  const events =
    (barBeats === 3 ? figure.inThree : undefined) ??
    (context.major ? figure.onMajor : undefined) ??
    figure.events
  return events.flatMap((event) => {
    if (event.start < window.from || event.start >= window.to) return []
    const duration = Math.min(event.duration, window.to - event.start)
    const played = event.tones.flatMap((tone) =>
      tokenNotes(tone.token, context).map((sounded) => ({ ...sounded, finger: tone.finger })),
    )
    const written = played.some((p) => p.finger !== undefined)
    const fingers = written
      ? played.map((p) => p.finger)
      : autoFingers(
          played.map((p) => p.midi),
          hand,
        )
    return played.map((p, i): PerformanceNote => {
      const finger = fingers[i]
      return {
        midi: p.midi,
        spelled: p.spelled,
        hand,
        ...(finger === undefined ? {} : { finger }),
        startTick: window.at + event.start - window.from,
        durationTicks: duration,
        velocity: hand === 'lh' ? VELOCITY.left : event.accent ? VELOCITY.accent : VELOCITY.right,
        chord: window.chord,
      }
    })
  })
}

/** The tune's notes that start in [start, end), from a melody in time order. */
function tuneBetween(melody: readonly MelodyNote[], start: Tick, end: Tick): MelodyNote[] {
  let low = 0
  let high = melody.length
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if ((melody[middle]?.startTick ?? end) < start) low = middle + 1
    else high = middle
  }
  const found: MelodyNote[] = []
  for (let i = low; i < melody.length; i++) {
    const n = melody[i]
    if (!n || n.startTick >= end) break
    found.push(n)
  }
  return found
}

/** Up to two chord tones at least a whole tone under a tune note. */
function harmonyUnder(tune: Midi, context: ChordContext): Midi[] {
  return context.pitchClasses
    .filter((pc) => pc !== pitchClass(tune))
    .map((pc) => tune - pitchClass(tune - pc))
    .filter((m) => tune - m >= 2)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .map(midi)
}

function playTune(
  figure: MelodyFigure,
  melody: readonly MelodyNote[],
  context: ChordContext,
  window: Window,
): PerformanceNote[] {
  const end = window.at + window.to - window.from
  return tuneBetween(melody, window.at, end).flatMap((n) => {
    const at = { startTick: n.startTick, durationTicks: n.durationTicks, chord: window.chord }
    const tune: PerformanceNote = {
      midi: n.midi,
      spelled: n.spelled,
      hand: 'rh',
      velocity: VELOCITY.tune,
      ...at,
    }
    if (figure.use !== 'harmony' || n.durationTicks < TICKS_PER_BEAT) return [tune]
    return [
      tune,
      ...spellInChord(context, harmonyUnder(n.midi, context)).map(
        ({ midi: key, spelled }): PerformanceNote => ({
          midi: key,
          spelled,
          hand: 'rh',
          velocity: VELOCITY.harmony,
          ...at,
        }),
      ),
    ]
  })
}

const HANDS: readonly Hand[] = ['rh', 'lh']

/** A hand's written notes on the timeline, in the chosen key, each under the chord sounding at its onset. */
function playWritten(
  written: readonly HandNote[],
  hand: Hand,
  barStart: Tick,
  chordStarts: readonly Tick[],
  from: SpelledNote,
  to: SpelledNote,
): PerformanceNote[] {
  return transposeNotes(written, from, to).map((n): PerformanceNote => {
    const startTick = barStart + n.startTick
    return {
      midi: n.midi,
      spelled: n.spelled,
      hand,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
      startTick,
      durationTicks: n.durationTicks,
      velocity: hand === 'lh' ? VELOCITY.left : VELOCITY.right,
      chord: sounding(chordStarts, startTick),
    }
  })
}

/** Arranges a chart for the piano: every chord voiced, patterned, fingered and placed in ticks. */
export function arrange(chart: Chart, options: ArrangeOptions): Performance {
  const key: Key = { tonic: options.tonic, minor: chart.key.minor }
  const melody = options.melody?.length
    ? transposeNotes(options.melody, chart.key.tonic, options.tonic).sort(
        (a, b) => a.startTick - b.startTick,
      )
    : null
  const layout = layOut(chart)
  const barBeats = beatsPerBar(chart.meter)
  const meterTicks = barBeats * TICKS_PER_BEAT
  const chords: PerformedChord[] = []
  const notes: PerformanceNote[] = []
  const playsTune: boolean[] = []
  let previous: readonly Midi[] | null = null

  layout.chords.forEach((placed, index) => {
    const chord = transposeChord(placed.chord, chart.key.tonic, options.tonic)
    const tones = spellChord(chord.root, chord.quality)
    const context = chordContext(
      { root: chord.root, bass: chord.bass ?? chord.root, tones },
      previous,
      key,
      options.inversion ?? null,
    )
    previous = context.voiced
    const { method } = placed.chord
    const pattern: EventPattern | MelodyPattern = patternFor(method, options, melody !== null)
    const rh = inBar(
      playable(options.rh ?? pattern.rh, melody !== null),
      layout.lineEnds.has(placed.bar),
    )
    const lh = options.lh ?? pattern.lh
    const written = layout.hands[placed.bar]
    playsTune.push(rh.kind === 'melody' && !written?.rh)
    chords.push({
      ...chord,
      symbol: chordSymbol(chord),
      tones,
      startTick: placed.startTick,
      durationTicks: placed.durationTicks,
      bar: placed.bar,
      ...(method ? { method } : {}),
      pattern: pattern.id,
    })

    // A chord plays its pattern in windows of one meter bar. A chord shorter than two beats, or in a
    // pickup, picks the pattern up where it sits in the bar; every other window starts at the
    // pattern's beginning.
    const end = placed.startTick + placed.durationTicks
    const picksUp = placed.chord.beats < 2 || (placed.bar === 0 && layout.pickup > 0)
    let at = placed.startTick
    while (at < end) {
      const from = at === placed.startTick && picksUp ? placed.offsetInBar % meterTicks : 0
      const length = Math.min(meterTicks - from, end - at)
      const window: Window = { from, to: from + length, at, chord: index }
      // A hand written in this bar plays its written notes instead (after the chords).
      if (!written?.rh) {
        if (rh.kind === 'events') notes.push(...playFigure(rh, context, 'rh', window, barBeats))
        else if (melody) notes.push(...playTune(rh, melody, context, window))
      }
      if (!written?.lh) notes.push(...playFigure(lh, context, 'lh', window, barBeats))
      at += length
    }
  })

  const chordStarts = layout.chords.map((placed) => placed.startTick)
  layout.hands.forEach((written, bar) => {
    const barStart = layout.bars[bar]?.startTick ?? 0
    for (const hand of HANDS) {
      const played = written?.[hand]
      if (played)
        notes.push(
          ...playWritten(played, hand, barStart, chordStarts, chart.key.tonic, options.tonic),
        )
    }
  })
  if (options.doubleMelody && melody) {
    for (const n of melody) {
      const chord = sounding(chordStarts, n.startTick)
      if (playsTune[chord]) continue
      notes.push({
        midi: midi(n.midi + 12),
        spelled: n.spelled,
        hand: 'melody',
        startTick: n.startTick,
        durationTicks: n.durationTicks,
        velocity: VELOCITY.doubled,
        chord,
      })
    }
  }

  notes.sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  const barStarts = layout.bars.map((bar) => bar.startTick)
  const onsets = new Map<Tick, number[]>()
  notes.forEach((n, i) => {
    const members = onsets.get(n.startTick)
    if (members) members.push(i)
    else onsets.set(n.startTick, [i])
  })
  const beatGroups = [...onsets].map(([tick, members]): BeatGroup => ({
    tick,
    bar: sounding(barStarts, tick),
    chord: sounding(chordStarts, tick),
    notes: members,
  }))

  return {
    key,
    meter: chart.meter,
    totalTicks: layout.totalTicks,
    bars: layout.bars,
    chords,
    notes,
    beatGroups,
  }
}
