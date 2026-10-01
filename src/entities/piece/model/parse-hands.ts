import type { HandNote } from '@/shared/lib/arrangement'
import { PIANO, type Finger, type Tick } from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError, type ContentPosition } from './content-error'
import { readPitch } from './note-text'
import type { ChartPiece, Hands } from './types'

export const HAND_IDS = ['rh', 'lh'] as const satisfies readonly (keyof Hands)[]
export type HandId = (typeof HAND_IDS)[number]

/** A bar of the chart as the hands are read against it: its length and where it is written. */
export interface HandBar {
  readonly ticks: Tick
  readonly position: ContentPosition
}

/** Each bar's written notes, null where the pattern plays; a hand written in no bar is left out. */
export type ReadHands = Partial<Record<HandId, readonly (readonly HandNote[] | null)[]>>

const HAND_NAMES: Readonly<Record<HandId, string>> = {
  rh: 'the right hand',
  lh: 'the left hand',
}
const FINGERS: ReadonlyMap<string, Finger> = new Map([
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
])
/** `pitches/beats` and an optional `@beat`. */
const TOKEN = /^([^/@]+)\/([^/@]+)(?:@(.+))?$/

type Fail = (problem: string) => never

/** `C4^1+E4^3`: notes struck together, each with an optional finger; null when one cannot be read or lies off the piano. */
function readPitches(text: string): Omit<HandNote, 'startTick' | 'durationTicks'>[] | null {
  const pitches = text.split('+').map((written) => {
    const [name = '', finger, ...extra] = written.split('^')
    const read = readPitch(name)
    const pitch = read && read.midi >= PIANO.from && read.midi <= PIANO.to ? read : null
    const fingered = finger === undefined ? undefined : FINGERS.get(finger)
    if (!pitch || extra.length > 0 || (finger !== undefined && fingered === undefined)) return null
    return fingered === undefined ? pitch : { ...pitch, finger: fingered }
  })
  return pitches.every((pitch) => pitch !== null) ? pitches : null
}

/** One bar's tokens: one after another, or from `@beat` (counted from 1). */
function readBar(entry: string, bar: HandBar, hand: HandId, fail: Fail): HandNote[] {
  const tokens = entry.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) fail(`${HAND_NAMES[hand]} has an empty bar: write - for the pattern`)
  const notes: HandNote[] = []
  let running: Tick = 0
  for (const token of tokens) {
    const unreadable: () => never = () => fail(`${HAND_NAMES[hand]} cannot read "${token}"`)
    const [, pitches = '', beatsText = '', atText] = TOKEN.exec(token) ?? unreadable()
    const beats = readBeats(beatsText)
    const durationTicks = beats === null ? null : ticksIn(beats)
    const at = atText === undefined ? null : readBeats(atText)
    const atTicks = at === null || at < 1 ? null : ticksIn(at - 1)
    if (durationTicks === null || (atText !== undefined && atTicks === null)) unreadable()
    const startTick = atTicks ?? running
    if (startTick >= bar.ticks) fail(`${HAND_NAMES[hand]}'s "${token}" starts past its bar's end`)
    if (pitches !== 'r') {
      const played = readPitches(pitches) ?? unreadable()
      notes.push(...played.map((pitch) => ({ ...pitch, startTick, durationTicks })))
    }
    running = startTick + durationTicks
  }
  return notes
}

/** A note may last past its bar only into the bars after it that the hand writes too. */
function checkHeld(
  bars: readonly HandBar[],
  read: readonly (readonly HandNote[] | null)[],
  hand: HandId,
  failAt: (position: ContentPosition) => Fail,
) {
  read.forEach((notes, index) => {
    const bar = bars[index]
    if (!notes || !bar) return
    const fail: Fail = failAt(bar.position)
    const longest = Math.max(0, ...notes.map((n) => n.startTick + n.durationTicks))
    let left = longest - bar.ticks
    for (let next = index + 1; left > 0; next++) {
      const after = bars[next]
      if (!after) fail(`${HAND_NAMES[hand]} holds a note past the piece's end`)
      if (read[next] === null) fail(`${HAND_NAMES[hand]} holds a note into a bar the pattern plays`)
      left -= after.ticks
    }
  })
}

/** Reads a piece's written hands against its chart's bars, naming the bar of any mistake. */
export function parseHands(piece: ChartPiece, bars: readonly HandBar[]): ReadHands {
  const failAt =
    (position: ContentPosition): Fail =>
    (problem) => {
      throw new ContentError(piece.id, position, problem)
    }
  const read: ReadHands = {}
  for (const hand of HAND_IDS) {
    const text = piece.hands?.[hand]
    if (text === undefined) continue
    const entries = text.split('|').map((entry) => entry.trim())
    if (entries.length !== bars.length) {
      failAt({})(
        `${HAND_NAMES[hand]} has ${entries.length} bar entries for a chart of ${bars.length} bars`,
      )
    }
    const notes = entries.map((entry, index) => {
      const bar = bars[index]
      if (!bar || entry === '-') return null
      return readBar(entry, bar, hand, failAt(bar.position))
    })
    checkHeld(bars, notes, hand, failAt)
    if (notes.some((bar) => bar !== null)) read[hand] = notes
  }
  return read
}
