import {
  barMarksOf,
  clefsInForce,
  HOME_CLEF,
  withoutBarMarks,
  beatsBefore,
  playOrder,
  beatsPerBar,
  beatsToTicks,
  chordBass,
  chordSymbol,
  isCompound,
  midi,
  PIANO,
  pitchClass,
  pitchClassOf,
  sameKey,
  spellChord,
  TICKS_PER_BEAT,
  transposeNote,
  type Chord,
  type Hand,
  type Inversion,
  type Key,
  type Meter,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import {
  autoFingers,
  chordContext,
  type RightHandPosition,
  spellInChord,
  tokenNotes,
  type ChordContext,
} from './chord-context'
import type {
  BeatGroup,
  Chart,
  ChartBar,
  ChartChord,
  EventFigure,
  EventPattern,
  Figure,
  FigureEvent,
  HandNote,
  TuneFigure,
  TunePattern,
  Pattern,
  Performance,
  PerformanceBar,
  PerformanceNote,
  PerformedChord,
  StaffMusic,
  StaffNote,
  WrittenHands,
} from './types'

export interface ArrangeOptions {
  /** The tonic to transpose to; the chart's mode stays. */
  readonly tonic: SpelledNote
  /** Every chord's pattern… */
  readonly pattern: Pattern
  /** …unless its method code is here: the chart's own plan… */
  readonly methods?: ReadonlyMap<string, Pattern>
  /** …or its section has a pattern of its own, by the section's index. */
  readonly sections?: readonly (Pattern | undefined)[]
  /** Replaces every pattern's right hand. */
  readonly rh?: Figure
  /** Replaces every pattern's left hand. */
  readonly lh?: EventFigure
  /**
   * The single staves over the grand staff, top down, in the chart's key (ADR 0097): each staff's
   * notes carried as written, heard as the piano's are. The top one is the tune a pattern's right
   * hand may play.
   */
  readonly staves?: readonly StaffMusic[]
  /**
   * Whether the tune, the top staff, is heard (the Player's play-along): left out, its notes are
   * written and silent. Where the right hand plays the tune it is not heard twice. The other staves
   * are always heard.
   */
  readonly hearTune?: boolean
  /**
   * The right hand's chord in this inversion every time; with `nearest`, the first only, each after
   * it nearest the last. Left out, each chord voice-led from the last, the first near middle C.
   */
  readonly inversion?: Inversion
  /** After the first chord in `inversion`, each nearest the last. */
  readonly nearest?: boolean
  /** Play the repeats taken (`playOrder`), the bars unrolled; else as written, the repeats' signs kept. */
  readonly unfold?: boolean
  /** The tempo marked over the first bar, in beats a minute. */
  readonly tempo?: number
}

const VELOCITY = {
  left: 0.2,
  right: 0.12,
  accent: 0.17,
  tune: 0.19,
  harmony: 0.11,
  staff: 0.17,
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

/** A chart's bar where it is written: its section, its line, and whether it opens or closes the line. */
interface WrittenBar {
  readonly bar: ChartBar
  readonly section: number
  readonly line: number
  readonly lineEnd: boolean
}

/** The bars as written, each with its place. */
const writtenBars = (chart: Chart): WrittenBar[] =>
  chart.sections.flatMap((section, sectionIndex) =>
    section.lines.flatMap((line, lineIndex) =>
      line.map((bar, barInLine) => ({
        bar,
        section: sectionIndex,
        line: lineIndex,
        lineEnd: barInLine === 0 || barInLine === line.length - 1,
      })),
    ),
  )

/**
 * The bars in the order they are played: as written, their barlines kept; or unrolled
 * (`unfold`), the repeats taken and their signs and endings left out, a double or final barline kept.
 */
function playedBars(chart: Chart, unfold: boolean): { written: number; bar: WrittenBar }[] {
  const all = writtenBars(chart)
  const order = unfold ? playOrder(all.map(({ bar }) => bar)) : all.map((_, i) => i)
  return order.flatMap((written) => {
    const place = all[written]
    if (!place) return []
    if (!unfold) return [{ written, bar: place }]
    const { barline } = place.bar
    const plain = withoutBarMarks(place.bar)
    const kept = barline === 'repeat' || barline === undefined ? plain : { ...plain, barline }
    return [{ written, bar: { ...place, bar: kept } }]
  })
}

/** Notes timed on the written bars, moved to wherever each of their bars is played. */
function unrolled<N extends { readonly startTick: Tick }>(
  notes: readonly N[],
  chart: Chart,
  bars: readonly PerformanceBar[],
): N[] {
  const starts: Tick[] = []
  let tick = 0
  for (const { bar } of writtenBars(chart)) {
    starts.push(tick)
    tick += beatsToTicks(bar.beats)
  }
  return bars.flatMap((bar) => {
    if (bar.written === undefined) return []
    const from = starts[bar.written] ?? 0
    const to = starts[bar.written + 1] ?? Infinity
    return notes
      .filter((n) => n.startTick >= from && n.startTick < to)
      .map((n) => ({ ...n, startTick: n.startTick - from + bar.startTick }))
  })
}

function layOut(chart: Chart, unfold = false): Layout {
  const chords: PlacedChord[] = []
  const bars: PerformanceBar[] = []
  const hands: (WrittenHands | undefined)[] = []
  const lineEnds = new Set<number>()
  const written = chart.sections.flatMap((section) => section.lines.flat())
  // A pickup is the end of a bar: its chords sit where they fall in its meter's bar, the first
  // section's (ADR 0095).
  const pickup = beatsToTicks(beatsBefore(written, 0, chart.sections[0]?.meter ?? chart.meter))
  let tick = 0
  // Where the order goes back, each hand's clef as it stands at the bar gone back to.
  const clefs = clefsInForce(written)
  let previous = -1
  for (const played of playedBars(chart, unfold)) {
    const jumped = played.written !== previous + 1
    previous = played.written
    const { bar, section: sectionIndex, line: lineIndex, lineEnd } = played.bar
    const index = bars.length
    const barStart = tick
    const gridStart = tick - (index === 0 ? pickup : 0)
    if (lineEnd) lineEnds.add(index)
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
    // Its chords fill it end to end; a bar of no chord lasts its beats all the same (ADR 0094).
    tick = barStart + beatsToTicks(bar.beats)
    hands.push(bar.hands)
    const meter = chart.sections[sectionIndex]?.meter
    bars.push({
      startTick: barStart,
      beats: bar.beats,
      section: sectionIndex,
      line: lineIndex,
      chords: chordIndexes,
      ...(meter ? { meter } : {}),
      ...barMarksOf(bar),
      ...(jumped && index > 0
        ? { clefs: clefs[played.written] ?? HOME_CLEF }
        : bar.clefs
          ? { clefs: bar.clefs }
          : {}),
      ...(unfold ? { written: played.written } : {}),
    })
  }
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

/**
 * The chord sounding at `tick`, whose time holds it: its index among the chords placed in order; none
 * in a bar of no chord (ADR 0094), where the chord before has ended.
 */
function chordAt(chords: readonly PlacedChord[], starts: readonly Tick[], tick: Tick) {
  const index = sounding(starts, tick)
  const placed = chords[index]
  return placed && placed.startTick <= tick && tick < placed.startTick + placed.durationTicks
    ? index
    : undefined
}

/**
 * Keeps the chord's letters: its root moves by the interval between tonics, its bass likewise, a
 * double sharp or flat where the key writes one, as the written notes are spelled.
 */
export function transposeChord(chord: Chord, from: SpelledNote, to: SpelledNote): Chord {
  const root = transposeNote(chord.root, from, to, 2)
  if (!chord.bass) return { root, quality: chord.quality }
  return {
    root,
    quality: chord.quality,
    bass: chordBass(root, chord.quality, transposeNote(chord.bass, from, to, 2)),
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
    // Spelled as the chords are: a double sharp where the key writes one, not a natural.
    spelled: transposeNote(n.spelled, from, to, 2),
  }))
}

/** The tokens that play the voiced chord, or a part of it, as it stands. */
const VOICED_TOKENS = new Set(['chord', 'upper-voices', 'voice'])

/** Whether a figure plays the voiced chord, so its position is the chord's. */
const playsVoiced = (figure: EventFigure): boolean =>
  figure.events.some((event) => event.tones.some((tone) => VOICED_TOKENS.has(tone.token.kind)))

const isTunePattern = (pattern: Pattern): pattern is TunePattern => pattern.rh.kind === 'tune'

function patternFor(
  method: string | undefined,
  section: number,
  options: ArrangeOptions,
  hasTune: boolean,
) {
  const planned = method === undefined ? undefined : options.methods?.get(method)
  const pattern = planned ?? options.sections?.[section] ?? options.pattern
  return isTunePattern(pattern) && !hasTune ? pattern.withoutTune : pattern
}

/** A right hand that plays the tune plays its fallback when there is no tune. */
const playable = (figure: Figure, hasTune: boolean): Figure =>
  figure.kind === 'tune' && !hasTune ? figure.withoutTune : figure

/** What the right hand plays in a bar: `ends` plays the tune in a line's first and last bars only. */
const inBar = (figure: Figure, atLineEnd: boolean): Figure =>
  figure.kind === 'tune' && figure.use === 'ends' && !atLineEnd ? figure.between : figure

/** Where a stretch of a chord sits in pattern time and on the timeline. */
interface Window {
  /** Pattern ticks [from, to). */
  readonly from: Tick
  readonly to: Tick
  /** The timeline tick `from` plays at. */
  readonly at: Tick
  readonly chord: number
}

/** How a bar's meter plays a figure: its beats, and whether each divides in three (6/8, 12/8). */
interface BarMeter {
  readonly beats: number
  readonly compound: boolean
}

const barMeterOf = (meter: Meter): BarMeter => ({
  beats: beatsPerBar(meter),
  compound: isCompound(meter),
})

/**
 * The events a figure plays in a meter: in compound time its 6/8 form in a two-beat bar, else its
 * compound version; its 3/4 one in three.
 */
function eventsIn(figure: EventFigure, meter: BarMeter, major: boolean): readonly FigureEvent[] {
  const compound = meter.compound
    ? ((meter.beats === 2 ? figure.inSix : undefined) ??
      (major ? figure.inCompoundOnMajor : undefined) ??
      figure.inCompound)
    : undefined
  return (
    compound ??
    (meter.beats === 3 ? figure.inThree : undefined) ??
    (major ? figure.onMajor : undefined) ??
    figure.events
  )
}

function playFigure(
  figure: EventFigure,
  context: ChordContext,
  hand: Hand,
  window: Window,
  meter: BarMeter,
): PerformanceNote[] {
  const events = eventsIn(figure, meter, context.major)
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

/** The tune's notes that start in [start, end), from a tune in time order. */
function tuneBetween(tune: readonly StaffNote[], start: Tick, end: Tick): StaffNote[] {
  let low = 0
  let high = tune.length
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if ((tune[middle]?.startTick ?? end) < start) low = middle + 1
    else high = middle
  }
  const found: StaffNote[] = []
  for (let i = low; i < tune.length; i++) {
    const n = tune[i]
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

/** The tune in the right hand, over a window of its chord: doubled as written, or harmonised under. */
function playTune(
  figure: TuneFigure,
  tune: readonly StaffNote[],
  context: ChordContext,
  window: Window,
): PerformanceNote[] {
  const end = window.at + window.to - window.from
  return tuneBetween(tune, window.at, end).flatMap((n) => {
    const at = { startTick: n.startTick, durationTicks: n.durationTicks, chord: window.chord }
    const played: PerformanceNote = {
      midi: n.midi,
      spelled: n.spelled,
      hand: 'rh',
      velocity: VELOCITY.tune,
      ...at,
      ...(n.marks ? { marks: n.marks } : {}),
      ...(n.lyrics ? { lyrics: n.lyrics } : {}),
    }
    if (figure.use !== 'harmony' || n.durationTicks < TICKS_PER_BEAT) return [played]
    return [
      played,
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

/** A written note moved past either end of the piano, an octave back onto it. */
const onThePiano = (key: Midi): Midi =>
  key < PIANO.from ? midi(key + 12) : key > PIANO.to ? midi(key - 12) : key

/**
 * A hand's written notes on the timeline, in the chosen key, each under the chord sounding at its
 * onset (`chordOf`): none in a bar of no chord.
 */
function playWritten(
  written: readonly HandNote[],
  hand: Hand,
  barStart: Tick,
  chordOf: (tick: Tick) => number | undefined,
  from: SpelledNote,
  to: SpelledNote,
): PerformanceNote[] {
  return transposeNotes(written, from, to).map((n): PerformanceNote => {
    const startTick = barStart + n.startTick
    const grace = n.marks?.grace
    const marks = grace
      ? {
          ...n.marks,
          grace: transposeNotes(grace, from, to).map((g) => ({ ...g, midi: onThePiano(g.midi) })),
        }
      : n.marks
    const chord = chordOf(startTick)
    return {
      ...(marks ? { marks } : {}),
      midi: onThePiano(n.midi),
      spelled: n.spelled,
      hand,
      ...(n.finger === undefined ? {} : { finger: n.finger }),
      ...(n.lyrics ? { lyrics: n.lyrics } : {}),
      startTick,
      durationTicks: n.durationTicks,
      velocity: hand === 'lh' ? VELOCITY.left : VELOCITY.right,
      ...(chord === undefined ? {} : { chord }),
    }
  })
}

/** The right hand's notes by onset, and the longest of them, to find those sounding at a time. */
interface RightHand {
  readonly notes: readonly PerformanceNote[]
  readonly longest: Tick
}

/** The lowest right-hand key sounding at any time in [start, end). */
function lowestRightBetween(right: RightHand, start: Tick, end: Tick): number {
  // The first note that can still sound at `start`: none earlier is held that long.
  let low = 0
  let high = right.notes.length
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    if ((right.notes[middle]?.startTick ?? start) + right.longest <= start) low = middle + 1
    else high = middle
  }
  let lowest = Infinity
  for (let i = low; i < right.notes.length; i++) {
    const n = right.notes[i]
    if (!n || n.startTick >= end) break
    if (n.startTick + n.durationTicks > start) lowest = Math.min(lowest, n.midi)
  }
  return lowest
}

/**
 * The left hand's figure kept under the right hand: a note it plays above a key the right hand
 * sounds with it goes down an octave, and again, until it is not (a figure climbing from a low bass
 * into a right hand voiced low). The right hand keeps its voicing, which the tune and the voice
 * leading set.
 */
function keepUnder(notes: PerformanceNote[], left: ReadonlySet<PerformanceNote>) {
  const sorted = notes.filter((n) => n.hand === 'rh').sort((a, b) => a.startTick - b.startTick)
  const right = { notes: sorted, longest: Math.max(0, ...sorted.map((n) => n.durationTicks)) }
  notes.forEach((n, i) => {
    if (!left.has(n)) return
    const lowest = lowestRightBetween(right, n.startTick, n.startTick + n.durationTicks)
    let key: number = n.midi
    while (key > lowest) key -= 12
    if (key !== n.midi) notes[i] = { ...n, midi: midi(key) }
  })
}

/** How chord `index` is voiced: in the inversion asked, nearest the last after the first, or freely. */
function positionOf({ inversion, nearest }: ArrangeOptions, index: number): RightHandPosition {
  if (inversion === undefined) return null
  return index === 0 || !nearest ? inversion : 'nearest'
}

/** Arranges a chart for the piano: every chord voiced, patterned, fingered and placed in ticks. */
export function arrange(chart: Chart, options: ArrangeOptions): Performance {
  const key: Key = { tonic: options.tonic, minor: chart.key.minor }
  // A section written in a key of its own is played in it moved as the chart's key is.
  const sectionKeys = chart.sections.map((section): Key | null =>
    section.key && !sameKey(section.key, chart.key)
      ? {
          tonic: transposeNote(section.key.tonic, chart.key.tonic, options.tonic),
          minor: section.key.minor,
        }
      : null,
  )
  const layout = layOut(chart, options.unfold)
  // A staff is written on the written bars: where the repeats are played, it goes round with them.
  // Each in the chosen key, its notes in time order.
  const staves = (options.staves ?? []).map(({ notes }) => {
    const moved = transposeNotes(notes, chart.key.tonic, options.tonic)
    return (options.unfold ? unrolled(moved, chart, layout.bars) : moved).sort(
      (a, b) => a.startTick - b.startTick,
    )
  })
  // The tune a pattern's right hand may play: the top staff's (ADR 0097).
  const tune = staves[0]?.length ? staves[0] : null
  // How each section's bars play a figure: in its own meter, else the chart's (ADR 0095).
  const barMeters = chart.sections.map((section) => barMeterOf(section.meter ?? chart.meter))
  const chords: PerformedChord[] = []
  const notes: PerformanceNote[] = []
  // The left hand's notes its figure plays, kept under the right hand once both are placed.
  const leftFigure = new Set<PerformanceNote>()
  const playsTune: boolean[] = []
  let previous: readonly Midi[] | null = null
  // Each chord's bass, in the key played: what a walking bass approaches from the chord before.
  const basses = layout.chords.map(({ chord }) => {
    const { bass, root } = transposeChord(chord, chart.key.tonic, options.tonic)
    return pitchClassOf(bass ?? root)
  })
  // The next chord's, where it follows straight on: a bar of no chord between leaves none to lead to.
  const nextBasses = basses.map((_, index) => {
    const [here, next] = [layout.chords[index], layout.chords[index + 1]]
    return here && next?.startTick === here.startTick + here.durationTicks
      ? basses[index + 1]
      : undefined
  })

  layout.chords.forEach((placed, index) => {
    const chord = transposeChord(placed.chord, chart.key.tonic, options.tonic)
    const tones = spellChord(chord.root, chord.quality)
    const section = layout.bars[placed.bar]?.section ?? 0
    const context = chordContext(
      { root: chord.root, bass: chord.bass ?? chord.root, tones },
      previous,
      sectionKeys[section] ?? key,
      positionOf(options, index),
    )
    previous = context.voiced
    const { method } = placed.chord
    const pattern: EventPattern | TunePattern = patternFor(method, section, options, tune !== null)
    const rh = inBar(
      playable(options.rh ?? pattern.rh, tune !== null),
      layout.lineEnds.has(placed.bar),
    )
    const lh = options.lh ?? pattern.lh
    const written = layout.hands[placed.bar]
    playsTune.push(rh.kind === 'tune' && !written?.rh)
    chords.push({
      ...chord,
      symbol: chordSymbol(chord),
      tones,
      startTick: placed.startTick,
      durationTicks: placed.durationTicks,
      bar: placed.bar,
      ...(method ? { method } : {}),
      pattern: pattern.id,
      ...(rh.kind === 'events' && !written?.rh && playsVoiced(rh) ? { hand: context.voiced } : {}),
    })

    // A chord plays its pattern in windows of one bar of its section's meter. A chord shorter than
    // two beats, or in a pickup, picks the pattern up where it sits in the bar; every other window
    // starts at the pattern's beginning.
    const barMeter = barMeters[section] ?? barMeterOf(chart.meter)
    const meterTicks = barMeter.beats * TICKS_PER_BEAT
    const end = placed.startTick + placed.durationTicks
    const picksUp = placed.chord.beats < 2 || (placed.bar === 0 && layout.pickup > 0)
    let at = placed.startTick
    while (at < end) {
      const from = at === placed.startTick && picksUp ? placed.offsetInBar % meterTicks : 0
      const length = Math.min(meterTicks - from, end - at)
      const window: Window = { from, to: from + length, at, chord: index }
      // The last stretch of a chord leads to the next chord's bass; the others back to its own.
      const ahead = at + length >= end ? nextBasses[index] : undefined
      const stretch = ahead === undefined ? context : { ...context, nextBass: ahead }
      // A hand written in this bar plays its written notes instead (after the chords).
      if (!written?.rh) {
        if (rh.kind === 'events') notes.push(...playFigure(rh, stretch, 'rh', window, barMeter))
        else if (tune) notes.push(...playTune(rh, tune, stretch, window))
      }
      if (!written?.lh) {
        const left = playFigure(lh, stretch, 'lh', window, barMeter)
        for (const n of left) leftFigure.add(n)
        notes.push(...left)
      }
      at += length
    }
  })

  const chordStarts = layout.chords.map((placed) => placed.startTick)
  const chordOf = (tick: Tick) => chordAt(layout.chords, chordStarts, tick)
  layout.hands.forEach((written, bar) => {
    const barStart = layout.bars[bar]?.startTick ?? 0
    for (const hand of HANDS) {
      const played = written?.[hand]
      if (played)
        notes.push(...playWritten(played, hand, barStart, chordOf, chart.key.tonic, options.tonic))
    }
  })
  staves.forEach((written, staff) => {
    for (const n of written) {
      const chord = chordOf(n.startTick)
      // The tune heard where it is played along, and not again where a chord's pattern plays it in
      // the right hand (a bar of no chord has none).
      const silent = staff === 0 && (!options.hearTune || (chord !== undefined && playsTune[chord]))
      notes.push({
        midi: onThePiano(n.midi),
        spelled: n.spelled,
        hand: 'staff',
        staff,
        ...(silent ? { silent } : {}),
        startTick: n.startTick,
        durationTicks: n.durationTicks,
        velocity: VELOCITY.staff,
        ...(chord === undefined ? {} : { chord }),
        ...(n.marks ? { marks: n.marks } : {}),
        ...(n.lyrics ? { lyrics: n.lyrics } : {}),
      })
    }
  })

  keepUnder(notes, leftFigure)
  notes.sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  const barStarts = layout.bars.map((bar) => bar.startTick)
  const onsets = new Map<Tick, number[]>()
  notes.forEach((n, i) => {
    const members = onsets.get(n.startTick)
    if (members) members.push(i)
    else onsets.set(n.startTick, [i])
  })
  const beatGroups = [...onsets].map(([tick, members]): BeatGroup => {
    const chord = chordOf(tick)
    return {
      tick,
      bar: sounding(barStarts, tick),
      ...(chord === undefined ? {} : { chord }),
      notes: members,
    }
  })

  // The tempo and the pedal as every staff marks them, whichever the learner hears (ADR 0068).
  const timing = notes.flatMap(({ startTick, marks }) =>
    marks?.expression !== undefined || marks?.pedal !== undefined ? [{ startTick, marks }] : [],
  )
  return {
    key,
    meter: chart.meter,
    totalTicks: layout.totalTicks,
    ...(staves.length > 0 ? { staves: (options.staves ?? []).map(({ clef }) => ({ clef })) } : {}),
    ...(timing.length > 0 ? { timing } : {}),
    bars: layout.bars.map((bar, index) => {
      const own = sectionKeys[bar.section]
      const keyed = own ? { ...bar, key: own } : bar
      return index === 0 && options.tempo ? { ...keyed, tempo: options.tempo } : keyed
    }),
    chords,
    notes,
    beatGroups,
  }
}
