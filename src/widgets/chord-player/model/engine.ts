import { DEFAULT_SHEET_SETTINGS, type ChordSheetSettings } from '@/entities/chord-sheet'
import { variationParts, type Style } from '@/entities/pattern'
import { PLAY_DELAY, type AudioOutput, type PlayHandle } from '@/shared/api/audio'
import {
  MIDI_DIVISION,
  noteEvents,
  standardMidiFile,
  type MidiNote,
  type MidiTrack,
  type TimedMidiEvent,
} from '@/shared/lib'
import {
  arrangeStyle,
  imitatedOrder,
  imitatedPlay,
  MAINS,
  NO_MARKS,
  playOrder,
  type ArrangerPress,
  type Band,
  type BandBar,
  type ChordSheet,
  type DrumVoice,
  type ImitatedBar,
  type PlayedBar,
  VARIATIONS,
} from '@/shared/lib/arrangement'
import {
  barTicks,
  beatsPerBar,
  beatsToTicks,
  C_MAJOR,
  isCompound,
  meterParts,
  TICKS_PER_BEAT,
  type Tick,
} from '@/shared/lib/music'
import { gainVelocity, SWING_SHARE, type KitPiece, type Sound } from '@/shared/lib/schedule'
import type { Ticker } from '@/shared/lib/ticker'

/** What the transport plays, read again before each chord: an edit lands at the next one. */
export interface PlayPlan {
  readonly sheet: ChordSheet
  readonly style: Style
  readonly tempo: number
  readonly settings: ChordSheetSettings
  /** The piano's chords in root position, not voice-led (Settings' Voicing). */
  readonly block?: boolean
  /** A connected arranger plays: the band keeps the time in silence, the count-in still heard. */
  readonly silent?: boolean
  /** The band stands in for an arranger none is connected for: its sections as the sheet and the panel set them. */
  readonly arranger?: ArrangerTake
}

/** The panel's sections pressed for the band standing in for an arranger: before Start, and while it plays. */
export interface ArrangerTake {
  readonly start: readonly number[]
  readonly presses: readonly ArrangerPress[]
}

/** A box: its section and its index there. */
export interface BoxPlace {
  readonly section: number
  readonly index: number
}
export interface TransportState {
  readonly playing: boolean
  /** The box sounding now (lit), while it plays. */
  readonly lit: BoxPlace | null
  /** The beat of its bar sounding now, from 0, while it plays: the bar's tick lit. */
  readonly beat: number | null
  /** The panel's section lit for the bar sounding, while the band stands in for an arranger. */
  readonly lamp: number | null
}

/** How far ahead a chord is queued. */
const LOOKAHEAD = 0.1
/** Stop fades the sound over this many beats. */
const FADE_BEATS = 2
/** The sheet's last chord rings this long after its last time through. */
const TAIL = 3
/** Notes release a little early, so a chord struck again is heard twice. */
const LEGATO = 0.95

/** The kernel's drum voices are the drum sounds' kit pieces, name for name. */
const kitPiece = (voice: DrumVoice): KitPiece => voice

/** Ticks in a swung bar: each beat's off-beat 8th on its third triplet, what lies between in proportion. */
function swung(tick: Tick): number {
  const beat = Math.floor(tick / TICKS_PER_BEAT) * TICKS_PER_BEAT
  const into = tick - beat
  const half = TICKS_PER_BEAT / 2
  const long = TICKS_PER_BEAT * SWING_SHARE.medium
  return (
    beat +
    (into <= half ? (into * long) / half : long + ((into - half) * (TICKS_PER_BEAT - long)) / half)
  )
}

/** A chord's window as played: its bar, where it starts and ends in the band's ticks, and its box. */
interface Window {
  readonly bar: number
  readonly from: Tick
  readonly to: Tick
  readonly box: BoxPlace
}

/** The windows of the band's bars, in play order. */
function windowsOf(bars: readonly PlayedBar[]): Window[] {
  return bars.flatMap((bar, index) =>
    bar.chords.map((chord) => ({
      bar: index,
      from: bar.startTick + beatsToTicks(chord.from),
      to: bar.startTick + beatsToTicks(chord.from + chord.beats),
      box: { section: bar.section, index: chord.index },
    })),
  )
}

/** The metronome's clicks in a window, from its start: each beat of its bar inside it, the bar's first accented. */
function windowClicks(
  barStart: Tick,
  window: Window,
  meter: ChordSheet['meter'],
  seconds: (ticks: Tick) => number,
): Sound[] {
  const beats = beatsPerBar(meter)
  const step = barTicks(meter) / beats
  const clicks: Sound[] = []
  for (
    let beat = Math.ceil((window.from - barStart) / step);
    barStart + beat * step < window.to;
    beat++
  )
    clicks.push({
      kind: 'click',
      at: seconds(barStart + beat * step - window.from),
      accent: beat % beats === 0,
    })
  return clicks
}

/**
 * The sounds of a window, from its start: the piano's notes struck in it, the bass's and the drums'.
 * The bass and the drums are swung by the style already (their triplet grid); the piano is swung here.
 */
function windowSounds(
  band: Band & { readonly bassInstrument: Style['bass'] },
  window: Window,
  seconds: (ticks: Tick) => number,
  swing: boolean,
  tail: number,
): Sound[] {
  const inside = (tick: Tick) => tick >= window.from && tick < window.to
  const place = (tick: Tick) => seconds(swing ? swung(tick - window.from) : tick - window.from)
  const length = (start: Tick, ticks: Tick) => {
    const end = Math.min(start + ticks, window.to)
    return Math.max(0.05, seconds(end - start) * LEGATO + (start + ticks >= window.to ? tail : 0))
  }
  const piano: Sound[] = (band.piano?.notes ?? []).flatMap((note) =>
    inside(note.startTick) && note.silent !== true
      ? [
          {
            kind: 'note' as const,
            midi: note.midi,
            at: place(note.startTick),
            duration: length(note.startTick, note.durationTicks),
            velocity: note.velocity,
            instrument: 'piano' as const,
          },
        ]
      : [],
  )
  return [...piano]
    .concat(
      band.bass.flatMap((note) =>
        inside(note.startTick)
          ? [
              {
                kind: 'note' as const,
                midi: note.midi,
                at: seconds(note.startTick - window.from),
                duration: length(note.startTick, note.durationTicks),
                velocity: note.velocity,
                instrument: band.bassInstrument,
              },
            ]
          : [],
      ),
    )
    .concat(
      band.drums.flatMap((hit) =>
        inside(hit.tick)
          ? [
              {
                kind: 'drum' as const,
                at: seconds(hit.tick - window.from),
                piece: kitPiece(hit.voice),
                velocity: hit.velocity,
              },
            ]
          : [],
      ),
    )
    .sort((a, b) => a.at - b.at)
}

/** The band arranged for a plan, kept while its sheet, style and panel are the same objects. */
interface Arranged {
  readonly sheet: ChordSheet
  readonly style: Style
  readonly block: boolean
  readonly take: ArrangerTake | undefined
  readonly band: Band & { readonly bassInstrument: Style['bass'] }
  readonly windows: readonly Window[]
  /** Each bar's sections, while the band stands in for an arranger. */
  readonly marks: readonly ImitatedBar[] | null
  /** The bars before the sheet's first that are the Intro's. */
  readonly intro: number
}

function arranged(plan: PlayPlan, last: Arranged | null): Arranged {
  const block = plan.block === true
  const take = plan.arranger
  if (
    last &&
    last.sheet === plan.sheet &&
    last.style === plan.style &&
    last.block === block &&
    last.take === take
  )
    return last
  const { sheet, style } = plan
  const order = take ? imitatedOrder(sheet, imitatedPlay(sheet, take.start, take.presses)) : null
  const bars = order?.bars ?? playOrder(sheet)
  const plays = bars.map((bar, at): BandBar => {
    const marks = order?.marks[at]
    const section = sheet.sections[bar.section]
    // Main A to D play variations 1 to 4.
    const variation =
      (marks?.main ? VARIATIONS[MAINS.indexOf(marks.main)] : undefined) ?? section?.variation ?? 1
    return {
      parts: variationParts(style, variation),
      fill: marks ? marks.fill : bar.fill,
      break: marks?.break === true,
      ending: marks?.ending === true,
    }
  })
  const band = arrangeStyle(sheet, bars, plays, { swing: style.swing, block })
  return {
    sheet,
    style,
    block,
    take,
    band: { ...band, bassInstrument: style.bass },
    windows: windowsOf(band.bars),
    marks: order?.marks ?? null,
    intro: order?.intro ?? 0,
  }
}

/** General MIDI's drum keys (channel 10), voice for voice. */
const DRUM_KEYS: Readonly<Record<DrumVoice, number>> = {
  kick: 36,
  snare: 38,
  rim: 37,
  hatClosed: 42,
  hatOpen: 46,
  hatPedal: 44,
  ride: 51,
  rideBell: 53,
  crash: 49,
  tomHigh: 50,
  tomMid: 47,
  tomFloor: 43,
}
/** General MIDI's programs (from 0) for the band's bass. */
const BASS_PROGRAMS: Readonly<Record<Style['bass'], number>> = {
  bassUpright: 32,
  bassElectric: 33,
}
/** The band's channels: the piano, the bass, and General MIDI's drums (channel 10: 9 from 0). */
const PIANO_CHANNEL = 0
const BASS_CHANNEL = 1
const DRUM_CHANNEL = 9
/** A drum hit's length in the file: a 16th. */
const HIT_TICKS = MIDI_DIVISION / 4

/** The tracks' names in the learner's language. */
export interface BandNames {
  readonly piano: string
  readonly bass: string
  readonly drums: string
}

/**
 * The sheet once through as the band plays it, a Standard MIDI File: the meter and tempo's track,
 * then the piano, the bass and the drums each on its own, a part turned off in Settings left out.
 * The piano's swing is written in, as the transport plays it.
 */
export function bandMidi(plan: PlayPlan, title: string, names: BandNames): Uint8Array<ArrayBuffer> {
  const { band, style } = arranged(plan, null)
  const compound = isCompound(plan.sheet.meter)
  // A compound meter's beat is a dotted quarter.
  const click = compound ? 1.5 : 1
  const fileTick = (tick: number) => Math.round((tick * MIDI_DIVISION * click) / TICKS_PER_BEAT)
  const end = fileTick(band.totalTicks)
  const { count, unit } = meterParts(plan.sheet.meter)
  const playing = (part: keyof Pick<ChordSheetSettings, 'piano' | 'bass' | 'drums'>) =>
    plan.settings[part].on && plan.settings[part].level > 0
  const track = (name: string, events: readonly TimedMidiEvent[]): MidiTrack => ({
    events: [{ tick: 0, kind: 'name', text: name }, ...events],
    end,
  })
  // Swing works beat by beat, and every bar starts on a beat.
  const pianoTick = (tick: Tick) => (style.swing ? swung(tick) : tick)
  const piano: MidiNote[] = (band.piano?.notes ?? []).flatMap((note) =>
    note.silent === true
      ? []
      : [
          {
            key: note.midi,
            on: fileTick(pianoTick(note.startTick)),
            off: fileTick(
              pianoTick(Math.min(note.startTick + note.durationTicks, band.totalTicks)),
            ),
            velocity: gainVelocity(note.velocity),
          },
        ],
  )
  const bass: MidiNote[] = band.bass.map((note) => ({
    key: note.midi,
    on: fileTick(note.startTick),
    off: fileTick(Math.min(note.startTick + note.durationTicks, band.totalTicks)),
    velocity: gainVelocity(note.velocity),
  }))
  const drums: MidiNote[] = band.drums.map((hit) => ({
    key: DRUM_KEYS[hit.voice],
    on: fileTick(hit.tick),
    off: fileTick(hit.tick) + HIT_TICKS,
    velocity: Math.min(127, Math.max(1, Math.round(127 * hit.velocity))),
  }))
  return standardMidiFile([
    track(title, [
      { tick: 0, kind: 'time', count, unit, click },
      { tick: 0, kind: 'tempo', quarters: plan.tempo * click },
    ]),
    ...(playing('piano') ? [track(names.piano, noteEvents(piano, PIANO_CHANNEL))] : []),
    ...(playing('bass')
      ? [
          track(names.bass, [
            { tick: 0, kind: 'program', channel: BASS_CHANNEL, program: BASS_PROGRAMS[style.bass] },
            ...noteEvents(bass, BASS_CHANNEL),
          ]),
        ]
      : []),
    ...(playing('drums') ? [track(names.drums, noteEvents(drums, DRUM_CHANNEL))] : []),
  ])
}

/** How loud a sound is in the plan's mix: its part's level, or none where the part is off, times the volume. */
export function mixGain(settings: ChordSheetSettings, sound: Sound): number {
  const part =
    sound.kind === 'drum'
      ? settings.drums
      : sound.kind === 'note' && sound.instrument !== undefined && sound.instrument !== 'piano'
        ? settings.bass
        : sound.kind === 'note'
          ? settings.piano
          : null
  const level = part === null ? 1 : part.on ? part.level / 100 : 0
  return level * (settings.volume / 100)
}

/**
 * The Chord player's transport (R29 CP4): it queues each chord of the band a little before it sounds,
 * reading the plan again each time, so an edit or a new tempo is heard from the next chord; counts a
 * bar in on the click where asked; repeats the sheet or one section (Loop) until Stop, or lets the
 * last chord ring; Stop fades over two beats; a sound started elsewhere stops it.
 */
export function createChordEngine({
  audio,
  ticker,
  plan,
  onChange = () => {},
  onBar = () => {},
}: {
  audio: Pick<AudioOutput, 'play' | 'stop' | 'now' | 'isPlaying' | 'unlock'>
  ticker: Ticker
  plan: () => PlayPlan
  onChange?: () => void
  /** A bar in play order queued to begin at `at` (the audio clock's seconds): a followed arranger's cue. */
  onBar?: (bar: number, at: number) => void
}) {
  let state: TransportState = { playing: false, lit: null, beat: null, lamp: null }
  let cache: Arranged | null = null
  let stopTicker: (() => void) | null = null
  /** The next window to queue, by its bar in play order and its start in that bar, in beats. */
  let next: { bar: number; beat: number } | null = null
  let nextAt = 0
  let loop: number | null = null
  /** Each window queued: when it sounds, its box, its first beat in its bar, a beat's seconds and the panel's section lit. */
  let queued: {
    at: number
    box: BoxPlace
    beat: number
    perBeat: number
    lamp: number | null
    handle: PlayHandle
  }[] = []
  let fading: { from: number; seconds: number } | null = null
  let ending: number | null = null
  /** The times through the sheet finished in this run. */
  let pass = 0

  const set = (change: Partial<TransportState>) => {
    const changed = { ...state, ...change }
    if (
      changed.playing === state.playing &&
      sameBox(changed.lit, state.lit) &&
      changed.beat === state.beat &&
      changed.lamp === state.lamp
    )
      return
    state = changed
    onChange()
  }
  const fade = () => {
    if (!fading) return 1
    const into = audio.now() - fading.from
    return Math.max(0, 1 - into / fading.seconds)
  }
  // A connected arranger plays the style: the band is silent, the count-in's click still heard.
  const gain = (sound: Sound) =>
    (plan().silent && sound.kind !== 'click' ? 0 : mixGain(plan().settings, sound)) * fade()

  const finish = () => {
    stopTicker?.()
    stopTicker = null
    next = null
    queued = []
    fading = null
    ending = null
    set({ playing: false, lit: null, beat: null, lamp: null })
  }

  /** The bars a pass may play: the whole sheet's after any Intro, or the looped section's. */
  const range = ({ band, intro }: Arranged) => {
    const whole = { first: intro, last: band.bars.length - 1 }
    if (loop === null) return whole
    const first = band.bars.findIndex((bar, at) => at >= intro && bar.section === loop)
    const last = band.bars.findLastIndex((bar) => bar.section === loop)
    return first < 0 ? whole : { first, last }
  }

  /** Queues every window due within the look-ahead. */
  const queue = () => {
    while (next && nextAt <= audio.now() + LOOKAHEAD) {
      const current = plan()
      cache = arranged(current, cache)
      const { band, windows, marks } = cache
      const { first, last } = range(cache)
      if (band.bars.length === 0) return finish()
      const at = next
      // The Intro plays before the first pass; anywhere else outside the pass goes back to its start.
      const inIntro = at.bar < cache.intro && loop === null
      if (at.bar > last || (at.bar < first && !inIntro)) next = { bar: first, beat: 0 }
      const cursor = next
      const window =
        windows.find(
          (each) =>
            each.bar === cursor.bar &&
            each.from - (band.bars[cursor.bar]?.startTick ?? 0) >= beatsToTicks(cursor.beat),
        ) ?? windows.find((each) => each.bar === cursor.bar)
      if (!window) return finish()
      const seconds = (ticks: Tick) => (ticks * 60) / (current.tempo * TICKS_PER_BEAT)
      const isLast = window.bar === last && windows.at(-1) === window && loop === null
      const plays = current.settings.plays
      const following = windows[windows.indexOf(window) + 1]
      // The Ending's bar is the last: its chord rings on, and the run ends.
      const ended = marks?.[window.bar]?.ending === true && following?.bar !== window.bar
      const ringing = ended || (isLast && plays > 0 && pass >= plays - 1)
      const sounds = windowSounds(band, window, seconds, current.style.swing, ringing ? TAIL : 0)
      if (current.settings.click)
        sounds.push(
          ...windowClicks(
            band.bars[window.bar]?.startTick ?? 0,
            window,
            current.sheet.meter,
            seconds,
          ),
        )
      const handle = audio.play(sounds, nextAt, gain)
      if (window.from === band.bars[window.bar]?.startTick) onBar(window.bar, nextAt)
      queued = [
        ...queued.filter((each) => each.at > audio.now() - 10),
        {
          at: nextAt,
          box: window.box,
          beat: (window.from - (band.bars[window.bar]?.startTick ?? 0)) / TICKS_PER_BEAT,
          perBeat: seconds(TICKS_PER_BEAT),
          lamp: marks?.[window.bar]?.lamp ?? null,
          handle,
        },
      ]
      const length = seconds(window.to - window.from)
      nextAt += length
      if (ringing) {
        ending = nextAt + TAIL
        next = null
      } else if (following && following.bar <= last) {
        const barStart = band.bars[following.bar]?.startTick ?? 0
        next = { bar: following.bar, beat: (following.from - barStart) / TICKS_PER_BEAT }
      } else {
        if (window.bar === last) pass += 1
        next = { bar: first, beat: 0 }
      }
    }
  }

  const tick = () => {
    const now = audio.now()
    if (fading) {
      if (now >= fading.from + fading.seconds) {
        audio.stop()
        finish()
      }
      return
    }
    // A sound started elsewhere cut ours off.
    const latest = queued.at(-1)
    if (latest && !audio.isPlaying(latest.handle) && now < latest.handle.until - 0.01)
      return finish()
    if (ending !== null && now >= ending) return finish()
    queue()
    const sounding = queued.findLast((each) => each.at <= now + 1e-9) ?? queued[0]
    set({
      lit: sounding?.box ?? null,
      beat: sounding
        ? sounding.beat + Math.floor(Math.max(0, now - sounding.at) / sounding.perBeat)
        : null,
      lamp: sounding?.lamp ?? null,
    })
  }

  return {
    /**
     * Plays from the top, the looped section's first bar, or a chord (Play from here), round and round;
     * from `at` on the audio clock where given (a followed arranger's Main), else at once. Returns when its
     * first chord sounds, after any count-in.
     */
    play({
      loop: section = null,
      from,
      at: given,
    }: { loop?: number | null; from?: BoxPlace; at?: number } = {}): number {
      if (stopTicker) finish()
      void audio.unlock()
      audio.stop()
      loop = section
      const current = plan()
      cache = arranged(current, cache)
      const { first } = range(cache)
      const { intro, windows } = cache
      const start = from
        ? windows.find((each) => each.bar >= intro && sameBox(each.box, from))
        : undefined
      // From the top, an Intro plays first; from a chord or a looped section, none does.
      next = start
        ? {
            bar: start.bar,
            beat: (start.from - (cache.band.bars[start.bar]?.startTick ?? 0)) / TICKS_PER_BEAT,
          }
        : { bar: loop === null ? 0 : first, beat: 0 }
      const at = Math.max(given ?? 0, audio.now() + PLAY_DELAY)
      nextAt = at
      if (current.settings.countIn) {
        const beats = beatsPerBar(current.sheet.meter)
        const bar = (barTicks(current.sheet.meter) * 60) / (current.tempo * TICKS_PER_BEAT)
        const clicks: Sound[] = Array.from(
          { length: beats * current.settings.countIn },
          (_, i) => ({ kind: 'click', at: (i * bar) / beats, accent: i % beats === 0 }),
        )
        audio.play(clicks, at, gain)
        nextAt = at + bar * current.settings.countIn
      }
      fading = null
      ending = null
      pass = 0
      queued = []
      state = { playing: true, lit: null, beat: null, lamp: null }
      queue()
      set({
        playing: true,
        lit: queued[0]?.box ?? null,
        beat: queued[0]?.beat ?? null,
        lamp: queued[0]?.lamp ?? null,
      })
      stopTicker = ticker(tick)
      return queued[0]?.at ?? nextAt
    },
    /** Stops: the sound fades over two beats, then is silenced. */
    stop() {
      if (!stopTicker || fading) return
      const tempo = plan().tempo
      fading = { from: audio.now(), seconds: (FADE_BEATS * 60) / tempo }
      next = null
      set({ playing: false, lit: null, beat: null, lamp: null })
    },
    /**
     * The first bar in the sheet's play order still to be queued: where a section pressed on the panel
     * of the band standing in for an arranger is taken (the first bar, while the Intro plays).
     */
    nextBar(): number {
      if (!next || !cache) return 0
      return Math.max(0, next.bar + (next.beat > 0 ? 1 : 0) - cache.intro)
    },
    /** Loops a section (its index), or the whole sheet again (null), from the next chord on. */
    loop(section: number | null) {
      loop = section
    },
    state: () => state,
    /** Stops at once, the sound cut: the page is left. */
    dispose() {
      if (stopTicker) audio.stop()
      finish()
    },
  }
}

const sameBox = (a: BoxPlace | null, b: BoxPlace | null) =>
  a === b || (a !== null && b !== null && a.section === b.section && a.index === b.index)

/** A bar of a style over C at its tempo (its Style sheet's ▷): its first variation, its parts as written. */
export function styleBar(style: Style): Sound[] {
  const sheet: ChordSheet = {
    key: C_MAJOR,
    meter: style.meter,
    sections: [
      {
        kind: 'verse',
        repeats: 1,
        variation: 1,
        marks: NO_MARKS,
        bars: [
          {
            chords: [
              { chord: { root: C_MAJOR.tonic, quality: 'maj' }, beats: beatsPerBar(style.meter) },
            ],
          },
        ],
      },
    ],
  }
  const { band, windows } = arranged(
    { sheet, style, tempo: style.tempo, settings: DEFAULT_SHEET_SETTINGS },
    null,
  )
  const seconds = (ticks: Tick) => (ticks * 60) / (style.tempo * TICKS_PER_BEAT)
  return windows.flatMap((window) =>
    windowSounds(band, window, seconds, style.swing, 0).map((sound) => ({
      ...sound,
      at: sound.at + seconds(window.from),
    })),
  )
}
