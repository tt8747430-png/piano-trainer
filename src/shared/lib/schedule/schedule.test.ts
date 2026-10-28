import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { C_MAJOR, midi, note, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import {
  audibleHands,
  beatGroupSounds,
  schedule,
  untilNextBeatGroup,
  type NoteSound,
  type Sound,
} from './schedule'
import type { SwingFeel } from './swing'

const B = TICKS_PER_BEAT

const oneChordBar = (symbol: string) => ({
  chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
  beats: 4,
})
const chart = (...symbols: string[]): Chart => ({
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [symbols.map(oneChordBar)] }],
})
const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
/** A staff over the piano of a C5 held `ticks`. */
const tuneOf = (ticks: number) => [
  {
    clef: 'treble' as const,
    notes: [{ midi: midi(72), spelled: note('C'), startTick: 0, durationTicks: ticks }],
  },
]
const perform = (...symbols: string[]): Performance =>
  arrange(chart(...symbols), {
    tonic: note('C'),
    pattern: BLOCK,
    staves: tuneOf(4 * B),
    hearTune: true,
  })

const ALL = audibleHands('both')
const notes = (sounds: readonly Sound[]) =>
  sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
const clicks = (sounds: readonly Sound[]) => sounds.filter((sound) => sound.kind === 'click')

describe('schedule', () => {
  it('plays a note’s marks: a trill in 32nds, a forte loud', () => {
    const plain = perform('C')
    const marked: Performance = {
      ...plain,
      notes: plain.notes.map((n) =>
        n.hand === 'staff' ? { ...n, marks: { ornament: 'trill', dynamic: 'f' } } : n,
      ),
    }
    const tune = (performance: Performance) =>
      notes(schedule(performance, { tempo: 60, hands: ALL }).sounds).filter((s) => s.at < 0.5)
    const before = tune(plain).find((s) => s.midi === 72)
    const trill = tune(marked).filter((s) => s.midi === 72 || s.midi === 74)
    expect(trill.map((s) => s.at)).toContain(0.125)
    expect(trill.some((s) => s.midi === 74)).toBe(true)
    expect(trill[0]?.velocity).toBeGreaterThan(before?.velocity ?? 1)
  })

  it('counts a pickup as the end of a bar: no accent on it, the next bar’s first beat accented', () => {
    const withPickup = arrange(
      {
        key: C_MAJOR,
        meter: '4/4',
        sections: [
          {
            lines: [
              [{ chords: [{ ...parseChordSymbol('C'), beats: 1 }], beats: 1 }, oneChordBar('F')],
            ],
          },
        ],
      },
      { tonic: note('C'), pattern: BLOCK },
    )
    const { sounds } = schedule(withPickup, {
      tempo: 60,
      hands: ALL,
      metronome: true,
      countIn: true,
    })
    expect(clicks(sounds).slice(0, 6)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: true },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
      { kind: 'click', at: 4, accent: false },
      { kind: 'click', at: 5, accent: true },
    ])
  })

  it('says where the pass runs and when its music starts, after a count-in', () => {
    const plain = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, fromTick: B, toTick: 5 * B })
    expect([plain.fromTick, plain.toTick, plain.musicStart]).toEqual([B, 5 * B, 0])
    const counted = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, countIn: true })
    expect([counted.fromTick, counted.toTick, counted.musicStart]).toEqual([0, 8 * B, 4])
  })

  it('holds the notes under a slur to the next, and cuts the others a little short', () => {
    const tune = (marks: object | undefined) =>
      arrange(
        {
          key: { tonic: note('C'), minor: false },
          meter: '4/4',
          sections: [{ lines: [[{ chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4 }]] }],
        },
        {
          tonic: note('C'),
          pattern: {
            id: 'none',
            rh: { kind: 'events', events: [] },
            lh: { kind: 'events', events: [] },
          },
          staves: [
            {
              clef: 'treble',
              notes: [
                {
                  midi: midi(72),
                  spelled: note('C'),
                  startTick: 0,
                  durationTicks: B,
                  ...(marks ? { marks: { slurStart: true } } : {}),
                },
                {
                  midi: midi(74),
                  spelled: note('D'),
                  startTick: B,
                  durationTicks: B,
                  ...(marks ? { marks: { slurEnd: true } } : {}),
                },
              ],
            },
          ],
          hearTune: true,
        },
      )
    const first = (marks: object | undefined) =>
      schedule(tune(marks), { tempo: 60, hands: ALL }).sounds.find(
        (sound) => sound.kind === 'note' && sound.midi === 72,
      )
    expect(first(undefined)).toMatchObject({ duration: expect.closeTo(0.95, 3) })
    expect(first({})).toMatchObject({ duration: expect.closeTo(1.03, 3) })
  })

  it('holds a note under the pedal until it is let up, and slows at a rit.', () => {
    const plain = perform('C', 'C')
    const marked: Performance = {
      ...plain,
      notes: plain.notes.map((n) =>
        n.startTick === 0
          ? { ...n, marks: { pedal: 'down' as const, expression: 'rit' as const } }
          : n.startTick === 4 * B
            ? { ...n, marks: { pedal: 'up' as const } }
            : n,
      ),
    }
    const first = (performance: Performance) =>
      notes(schedule(performance, { tempo: 60, hands: ALL }).sounds).filter((s) => s.at === 0)
    const held = first(marked)
    expect(Math.max(...held.map((s) => s.duration))).toBeGreaterThan(
      Math.max(...first(plain).map((s) => s.duration)),
    )
    const end = (performance: Performance) => schedule(performance, { tempo: 60, hands: ALL }).end
    expect(end(marked)).toBeGreaterThan(end(plain))
  })

  it('times a bar in seconds at 60 bpm', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 60, hands: ALL })
    expect(notes(sounds).map((sound) => sound.at)).toEqual([0, 0, 0, 0, 0])
    expect(notes(sounds)[0]?.duration).toBeCloseTo(3.8)
    expect(end).toBe(4)
  })

  it('halves the time at 120 bpm', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 120, hands: ALL })
    expect(notes(sounds)[0]?.duration).toBeCloseTo(1.9)
    expect(end).toBe(2)
  })

  it('starts from a tick', () => {
    const performance = perform('C', 'F')
    const { sounds, end } = schedule(performance, { tempo: 60, hands: ALL, fromTick: 4 * B })
    const played = notes(sounds)
    expect(played.map((sound) => sound.midi % 12).sort()).toEqual([0, 5, 5, 9])
    expect(played.every((sound) => sound.at === 0)).toBe(true)
    expect(end).toBe(4)
  })

  it('sounds a note still held where the pass starts, from there for what is left of it', () => {
    const held = arrange(chart('C', 'F'), {
      tonic: note('C'),
      pattern: BLOCK,
      staves: tuneOf(8 * B),
      hearTune: true,
    })
    const { sounds } = schedule(held, { tempo: 60, hands: ALL, fromTick: 4 * B })
    const tied = notes(sounds).find((sound) => sound.midi === 72)
    expect(tied?.at).toBe(0)
    expect(tied?.duration).toBeCloseTo(4 * 0.95)
  })

  it('counts in one bar of clicks before the music', () => {
    const { sounds, end } = schedule(perform('C'), { tempo: 60, hands: ALL, countIn: true })
    expect(clicks(sounds)).toEqual([
      { kind: 'click', at: 0, accent: true },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
    ])
    expect(notes(sounds).every((sound) => sound.at === 4)).toBe(true)
    expect(end).toBe(8)
  })

  it('counts in on the beats of the bar it starts in, so the music comes in on its beat', () => {
    // From beat 3: "3 4 | 1 2", then the music on beat 3, the accent on the bar's first beat.
    const { sounds, musicStart } = schedule(perform('C', 'F'), {
      tempo: 60,
      hands: ALL,
      fromTick: 2 * B,
      countIn: true,
      metronome: true,
    })
    expect(clicks(sounds).slice(0, 6)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: true },
      { kind: 'click', at: 3, accent: false },
      { kind: 'click', at: 4, accent: false },
      { kind: 'click', at: 5, accent: false },
    ])
    expect(musicStart).toBe(4)
  })

  it('comes in half a beat after the last click when it starts on an off-beat', () => {
    const { sounds, musicStart } = schedule(perform('C', 'F'), {
      tempo: 60,
      hands: ALL,
      fromTick: 1.5 * B,
      countIn: true,
    })
    expect(clicks(sounds).map((click) => click.at)).toEqual([0, 1, 2, 3])
    expect(musicStart).toBe(3.5)
  })

  it('says when each beat of its count-in sounds: a bar before the music, counted down', () => {
    const counted = schedule(perform('C', 'F'), { tempo: 120, hands: ALL, countIn: true })
    expect(counted.counts).toEqual([0, 0.5, 1, 1.5])
    expect(counted.musicStart).toBe(2)
    const from = schedule(perform('C', 'F'), {
      tempo: 60,
      hands: ALL,
      fromTick: 2 * B,
      countIn: true,
    })
    expect(from.counts).toEqual([0, 1, 2, 3])
    expect(schedule(perform('C'), { tempo: 60, hands: ALL }).counts).toEqual([])
  })

  it('counts its bar in unheard and clicks nothing where the click is silent (ADR 0105)', () => {
    const silent = schedule(perform('C'), {
      tempo: 60,
      hands: ALL,
      countIn: true,
      metronome: true,
      clicks: false,
    })
    expect(clicks(silent.sounds)).toEqual([])
    expect(silent.counts).toEqual([0, 1, 2, 3])
    expect(notes(silent.sounds).every((sound) => sound.at === 4)).toBe(true)
  })

  it('names each note’s part, its hand or a staff over the piano, for the mix (ADR 0105)', () => {
    const parts = (sounds: readonly Sound[]) =>
      notes(sounds).map((sound) => `${sound.midi}:${sound.part ?? '-'}`)
    expect(parts(schedule(perform('C'), { tempo: 60, hands: ALL }).sounds)).toEqual([
      '36:lh',
      '60:rh',
      '64:rh',
      '67:rh',
      '72:staff',
    ])
    expect(parts(beatGroupSounds(perform('C'), 0, { tempo: 60, hands: ALL }))).toEqual([
      '36:lh',
      '60:rh',
      '64:rh',
      '67:rh',
      '72:staff',
    ])
  })

  it('clicks every beat with the metronome, accenting each bar’s first', () => {
    const whole = schedule(perform('C'), { tempo: 60, hands: ALL, metronome: true })
    expect(clicks(whole.sounds)).toEqual([
      { kind: 'click', at: 0, accent: true },
      { kind: 'click', at: 1, accent: false },
      { kind: 'click', at: 2, accent: false },
      { kind: 'click', at: 3, accent: false },
    ])
    const late = schedule(perform('C'), { tempo: 60, hands: ALL, metronome: true, fromTick: 2 * B })
    expect(clicks(late.sounds)).toEqual([
      { kind: 'click', at: 0, accent: false },
      { kind: 'click', at: 1, accent: false },
    ])
  })

  it('clicks and counts in a section in a meter of its own by its own beats (ADR 0097)', () => {
    const changing: Chart = {
      ...chart('C'),
      sections: [
        ...chart('C').sections,
        {
          meter: '3/4',
          lines: [[{ chords: [{ ...parseChordSymbol('F'), beats: 3 }], beats: 3 }]],
        },
      ],
    }
    const performance = arrange(changing, { tonic: note('C'), pattern: BLOCK })
    const whole = schedule(performance, { tempo: 60, hands: ALL, metronome: true })
    expect(clicks(whole.sounds).map(({ at, accent }) => `${at}${accent ? '!' : ''}`)).toEqual([
      ...['0!', '1', '2', '3'],
      ...['4!', '5', '6'],
    ])
    const counted = schedule(performance, { tempo: 60, hands: ALL, countIn: true, fromTick: 4 * B })
    expect(clicks(counted.sounds)).toHaveLength(3)
    expect(counted.musicStart).toBe(3)
  })

  it('plays only the audible hands, and always the staves over the piano', () => {
    expect(audibleHands('rh')).toEqual({ rh: true, lh: false, staff: true })
    expect(audibleHands('lh')).toEqual({ rh: false, lh: true, staff: true })
    const { sounds } = schedule(perform('C'), { tempo: 60, hands: audibleHands('rh') })
    expect(notes(sounds).map((sound) => sound.midi)).toEqual([60, 64, 67, 72])
  })

  it('plays nothing of a note written silent: a tune not played along (ADR 0097)', () => {
    const silent = arrange(chart('C'), { tonic: note('C'), pattern: BLOCK, staves: tuneOf(4 * B) })
    const { sounds } = schedule(silent, { tempo: 60, hands: ALL })
    expect(notes(sounds).map((sound) => sound.midi)).toEqual([36, 60, 64, 67])
    expect(beatGroupSounds(silent, 0, { tempo: 60, hands: ALL }).map((s) => s.midi)).toEqual([
      36, 60, 64, 67,
    ])
  })

  it('cues each beat group from the start tick', () => {
    const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })
    const { cues } = schedule(performance, { tempo: 60, hands: ALL, fromTick: 4 * B })
    expect(cues).toEqual([
      { beatGroup: 4, tick: 4 * B, at: 0 },
      { beatGroup: 5, tick: 5 * B, at: 1 },
      { beatGroup: 6, tick: 6 * B, at: 2 },
      { beatGroup: 7, tick: 7 * B, at: 3 },
    ])
  })

  it('keeps a very short note audible', () => {
    const performance = perform('C')
    const blip: Performance = {
      ...performance,
      notes: [
        {
          midi: midi(60),
          spelled: note('C'),
          hand: 'rh',
          startTick: 0,
          durationTicks: 1,
          velocity: 0.12,
          chord: 0,
        },
      ],
    }
    expect(notes(schedule(blip, { tempo: 60, hands: ALL }).sounds)[0]?.duration).toBe(0.15)
  })
})

describe('beatGroupSounds', () => {
  it('sounds one beat group now, long enough to hear', () => {
    const performance = arrange(chart('C'), { tonic: note('C'), pattern: BEATS })
    const sounds = beatGroupSounds(performance, 1, { tempo: 60, hands: audibleHands('rh') })
    expect(sounds.map((sound) => sound.midi)).toEqual([60, 64, 67])
    expect(sounds.every((sound) => sound.at === 0 && sound.duration === 1)).toBe(true)
    const fast = beatGroupSounds(performance, 1, { tempo: 160, hands: ALL })
    expect(fast.every((sound) => sound.duration === 0.375)).toBe(true)
    const faster = beatGroupSounds(performance, 1, { tempo: 240, hands: ALL })
    expect(faster.every((sound) => sound.duration === 0.35)).toBe(true)
  })

  it('has nothing for a beat group that does not exist', () => {
    const performance = arrange(chart('C'), { tonic: note('C'), pattern: BEATS })
    expect(beatGroupSounds(performance, 99, { tempo: 60, hands: ALL })).toEqual([])
  })
})

describe('untilNextBeatGroup', () => {
  const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })

  it('lasts until the next beat group sounds, whole beats exactly', () => {
    expect(untilNextBeatGroup(performance, 0, { tempo: 60 })).toBe(1)
    expect(untilNextBeatGroup(performance, 3, { tempo: 72 })).toBe(60 / 72)
  })

  it('gives the last beat group one beat', () => {
    expect(untilNextBeatGroup(performance, 7, { tempo: 120 })).toBe(0.5)
  })

  it('waits on the swung grid the music is heard on', () => {
    const eighths = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'eighths',
        rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const due = (swing: SwingFeel) => {
      const times = [0]
      for (let group = 0; group < 3; group += 1) {
        const wait = untilNextBeatGroup(eighths, group, { tempo: 60, swing })
        times.push(Number(((times.at(-1) ?? 0) + wait).toFixed(4)))
      }
      return times
    }
    expect(due('straight')).toEqual([0, 0.5, 1, 1.5])
    expect(due('medium')).toEqual([0, 0.6667, 1, 1.6667])
    expect(due('hard')).toEqual([0, 0.75, 1, 1.75])
  })
})

describe('a tempo', () => {
  it.each([0, -60, Number.NaN])('refuses %s', (tempo) => {
    expect(() => schedule(perform('C'), { tempo, hands: ALL })).toThrow(RangeError)
    expect(() => untilNextBeatGroup(perform('C'), 0, { tempo })).toThrow(RangeError)
  })
})

describe('schedule: a passage and swing', () => {
  const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })

  it('ends a pass where it is told, cutting what would sound past it', () => {
    const { sounds, cues, end } = schedule(performance, {
      tempo: 60,
      hands: ALL,
      fromTick: B,
      toTick: 3 * B,
    })
    expect(cues.map((cue) => cue.beatGroup)).toEqual([1, 2])
    expect(end).toBe(2)
    // The bass struck on beat 1 is still held: it sounds from the pass's start to its end.
    const bass = notes(sounds).find((sound) => sound.midi < 48)
    expect(bass?.at).toBe(0)
    expect(bass?.duration).toBeCloseTo(2 * 0.95)
  })

  it('cuts a note that would sound past the pass’s end', () => {
    const { sounds } = schedule(performance, { tempo: 60, hands: ALL, toTick: 3 * B })
    const bass = notes(sounds).find((sound) => sound.midi < 48)
    expect(bass?.duration).toBeCloseTo(3 * 0.95)
  })

  it('swings the off-beat 8th to two thirds of the beat, the beats kept', () => {
    const eighths = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'eighths',
        rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const rh = (swing: SwingFeel) => [
      ...new Set(
        notes(schedule(eighths, { tempo: 60, hands: audibleHands('rh'), swing }).sounds).map(
          (s) => s.at,
        ),
      ),
    ]
    expect(rh('straight')).toEqual([0, 0.5, 1, 1.5])
    expect(rh('light').map((at) => Number(at.toFixed(4)))).toEqual([0, 0.6, 1, 1.6])
    expect(rh('medium').map((at) => Number(at.toFixed(4)))).toEqual([0, 0.6667, 1, 1.6667])
  })

  it('swings on the bar’s beats after a pickup, not on beats counted from the pickup', () => {
    const eighths = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'eighths',
        rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    // The same bar after an 8th's pickup: every note 12 ticks on, its beats on 12, 36, …
    const [bar] = eighths.bars
    if (!bar) throw new Error('no bar')
    const afterPickup: Performance = {
      ...eighths,
      totalTicks: eighths.totalTicks + 0.5 * B,
      bars: [
        { ...bar, beats: 0.5, chords: [] },
        { ...bar, startTick: 0.5 * B },
      ],
      notes: eighths.notes.map((n) => ({ ...n, startTick: n.startTick + 0.5 * B })),
    }
    const rh = [
      ...new Set(
        notes(
          schedule(afterPickup, { tempo: 60, hands: audibleHands('rh'), swing: 'medium' }).sounds,
        ).map((s) => Number(s.at.toFixed(4))),
      ),
    ]
    // The pickup is the "and" of 4, swung late itself: the downbeat comes a third of a beat after it.
    expect(rh).toEqual([0.3333, 1, 1.3333, 2])
  })

  it('never swings a compound meter', () => {
    const inEighths = arrange({ ...chart('C'), meter: '6/8' }, { tonic: note('C'), pattern: BEATS })
    expect(schedule(inEighths, { tempo: 60, hands: ALL, swing: 'hard' })).toEqual(
      schedule(inEighths, { tempo: 60, hands: ALL }),
    )
  })
})
