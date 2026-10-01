import {
  beatsPerBar,
  midi,
  otherSpelling,
  PIANO,
  pitchClass,
  spellInKey,
  TICKS_PER_BEAT,
  type Finger,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import type { Draft, DraftBar, DraftNote, HandId } from './draft'
import { barAt, barsOf, totalTicks, type PlacedBar } from './timeline'

/** A line of notes the editor writes: the melody or a hand. */
export type Voice = 'melody' | HandId

/** A draft after writing, and where the caret goes next. */
export interface Written {
  readonly draft: Draft
  readonly end: Tick
}

export const notesOf = (draft: Draft, voice: Voice): readonly DraftNote[] =>
  voice === 'melody' ? draft.melody : draft.hands[voice]

function withNotes(draft: Draft, voice: Voice, notes: readonly DraftNote[]): Draft {
  const sorted = [...notes].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  return voice === 'melody'
    ? { ...draft, melody: sorted }
    : { ...draft, hands: { ...draft.hands, [voice]: sorted } }
}

/** The draft with bar `index` changed. */
export function withBar(draft: Draft, index: number, change: (bar: DraftBar) => DraftBar): Draft {
  let at = 0
  return {
    ...draft,
    sections: draft.sections.map((section) => ({
      ...section,
      lines: section.lines.map((line) => line.map((bar) => (at++ === index ? change(bar) : bar))),
    })),
  }
}

/** A bar after the last: the last chord again, for the meter's length. */
function appendBar(draft: Draft): Draft {
  const chord = barsOf(draft).at(-1)?.bar.chords.at(-1)
  if (!chord) return draft
  const bar: DraftBar = {
    ticks: beatsPerBar(draft.meter) * TICKS_PER_BEAT,
    chords: [{ at: 0, chord: chord.chord, ...(chord.method ? { method: chord.method } : {}) }],
    rh: false,
    lh: false,
  }
  return {
    ...draft,
    sections: draft.sections.map((section, s) =>
      s === draft.sections.length - 1
        ? {
            ...section,
            lines: section.lines.map((line, l) =>
              l === section.lines.length - 1 ? [...line, bar] : line,
            ),
          }
        : section,
    ),
  }
}

/** The draft long enough for a note at `at`. */
function reaching(draft: Draft, at: Tick): Draft {
  let grown = draft
  while (at >= totalTicks(grown)) {
    const next = appendBar(grown)
    if (next === grown) return grown
    grown = next
  }
  return grown
}

/** Where a hand's note from `at` must stop: the end of the run of bars the hand writes from there. */
function handReach(draft: Draft, hand: HandId, at: Tick): Tick {
  const bars = barsOf(draft)
  let end = barAt(draft, at).start
  for (const placed of bars.slice(barAt(draft, at).index)) {
    if (!placed.bar[hand]) break
    end = placed.start + placed.bar.ticks
  }
  return end
}

/** The hand's bar at `at` written out (it holds no notes while the pattern plays it). */
function writtenAt(draft: Draft, hand: HandId, at: Tick): Draft {
  const { index, bar } = barAt(draft, at)
  return bar[hand] ? draft : withBar(draft, index, (written) => ({ ...written, [hand]: true }))
}

const spelledIn = (draft: Draft, key: Midi) => ({
  midi: key,
  spelled: spellInKey(pitchClass(key), draft.key),
})

/**
 * Takes the notes starting in [at, to) from a voice; in the melody, a note sounding into `at` is cut
 * there, so the tune stays one line.
 */
function clearUnder(draft: Draft, voice: Voice, at: Tick, to: Tick): DraftNote[] {
  return notesOf(draft, voice).flatMap((n) => {
    if (n.startTick >= at && n.startTick < to) return []
    if (voice === 'melody' && n.startTick < at && n.startTick + n.durationTicks > at) {
      return [{ ...n, durationTicks: at - n.startTick }]
    }
    return [n]
  })
}

/**
 * Writes keys at `at` for `ticks`: the melody one note (the highest key), a hand all of them. A note
 * past the end adds bars; a hand's bar the pattern played is written out first, and its note stops
 * where the hand stops being written.
 */
export function writeNotes(
  draft: Draft,
  voice: Voice,
  at: Tick,
  keys: readonly Midi[],
  ticks: Tick,
): Written {
  const grown = reaching(draft, at)
  const ready = voice === 'melody' ? grown : writtenAt(grown, voice, at)
  const reach = voice === 'melody' ? totalTicks(ready) : handReach(ready, voice, at)
  const end = Math.min(at + ticks, reach)
  const played = voice === 'melody' ? [Math.max(...keys)].map(midi) : [...new Set(keys)]
  const written: DraftNote[] = played.map((key) => ({
    ...spelledIn(ready, key),
    startTick: at,
    durationTicks: end - at,
  }))
  return { draft: withNotes(ready, voice, [...clearUnder(ready, voice, at, end), ...written]), end }
}

/** A rest at `at`: the notes starting under it are taken (a hand's bar the pattern played is written out, silent). */
export function writeRest(draft: Draft, voice: Voice, at: Tick, ticks: Tick): Written {
  if (at >= totalTicks(draft)) return { draft, end: at }
  const ready = voice === 'melody' ? draft : writtenAt(draft, voice, at)
  const reach = voice === 'melody' ? totalTicks(ready) : handReach(ready, voice, at)
  const end = Math.min(at + ticks, reach)
  return { draft: withNotes(ready, voice, clearUnder(ready, voice, at, end)), end }
}

/** The notes starting at `at`. */
export const notesAt = (draft: Draft, voice: Voice, at: Tick): DraftNote[] =>
  notesOf(draft, voice).filter((n) => n.startTick === at)

/**
 * A key joining the notes at `at`, at their length: the melody keeps its highest; where nothing starts
 * at `at` the key is written as a note of `ticks`.
 */
export function addToChord(draft: Draft, voice: Voice, at: Tick, key: Midi, ticks: Tick): Draft {
  const [first] = notesAt(draft, voice, at)
  if (!first) return writeNotes(draft, voice, at, [key], ticks).draft
  if (voice === 'melody') {
    return key > first.midi
      ? withNotes(
          draft,
          voice,
          notesOf(draft, voice).map((n) => (n === first ? { ...n, ...spelledIn(draft, key) } : n)),
        )
      : draft
  }
  if (notesAt(draft, voice, at).some((n) => n.midi === key)) return draft
  const added = { ...spelledIn(draft, key), startTick: at, durationTicks: first.durationTicks }
  return withNotes(draft, voice, [...notesOf(draft, voice), added])
}

/** Takes the notes starting at `at` away. */
export const deleteNotes = (draft: Draft, voice: Voice, at: Tick): Draft =>
  withNotes(
    draft,
    voice,
    notesOf(draft, voice).filter((n) => n.startTick !== at),
  )

/** The notes at `at`, each changed; the draft as it was when none is there. */
function changeAt(
  draft: Draft,
  voice: Voice,
  at: Tick,
  change: (n: DraftNote) => DraftNote | null,
): Draft {
  const notes = notesOf(draft, voice)
  const changed = notes.map((n) => (n.startTick === at ? change(n) : n))
  if (changed.some((n) => n === null)) return draft
  return changed.every((n, i) => n === notes[i])
    ? draft
    : withNotes(
        draft,
        voice,
        changed.flatMap((n) => (n ? [n] : [])),
      )
}

/** The notes at `at` moved by semitones, spelled in the key; nothing moves past the piano's ends. */
export const shiftNotes = (draft: Draft, voice: Voice, at: Tick, semitones: number): Draft =>
  changeAt(draft, voice, at, (n) => {
    const moved = n.midi + semitones
    return moved < PIANO.from || moved > PIANO.to
      ? null
      : { ...n, ...spelledIn(draft, midi(moved)) }
  })

/** The notes at `at` written the other way (C♯ ↔ D♭). */
export const respellNotes = (draft: Draft, voice: Voice, at: Tick): Draft =>
  changeAt(draft, voice, at, (n) => ({ ...n, spelled: otherSpelling(n.spelled) }))

/** A finger on one note at `at` in a hand, or none. */
export const setFinger = (
  draft: Draft,
  hand: HandId,
  at: Tick,
  key: Midi,
  finger: Finger | null,
): Draft =>
  changeAt(draft, hand, at, (n) => {
    if (n.midi !== key) return n
    const { finger: _old, ...rest } = n
    return finger === null ? rest : { ...rest, finger }
  })

/** The notes of a hand that start in a bar. */
const inBar = (n: DraftNote, { start, bar }: PlacedBar) =>
  n.startTick >= start && n.startTick < start + bar.ticks

/** A hand's bar written out with what the pattern plays there, each note kept inside the bar. */
export function writeOut(
  draft: Draft,
  hand: HandId,
  index: number,
  played: readonly DraftNote[],
): Draft {
  const placed = barsOf(draft)[index]
  if (!placed) return draft
  const end = placed.start + placed.bar.ticks
  const kept = draft.hands[hand].filter((n) => !inBar(n, placed))
  const inside = played
    .filter((n) => inBar(n, placed))
    .map((n) => ({ ...n, durationTicks: Math.min(n.durationTicks, end - n.startTick) }))
  return withNotes(
    withBar(draft, index, (bar) => ({ ...bar, [hand]: true })),
    hand,
    [...kept, ...inside],
  )
}

/** A hand's bar given back to the pattern: its notes taken, a note held into it cut at its start. */
export function backToPattern(draft: Draft, hand: HandId, index: number): Draft {
  const placed = barsOf(draft)[index]
  if (!placed) return draft
  const notes = draft.hands[hand].flatMap((n) => {
    if (inBar(n, placed)) return []
    const end = n.startTick + n.durationTicks
    return n.startTick < placed.start && end > placed.start
      ? [{ ...n, durationTicks: placed.start - n.startTick }]
      : [n]
  })
  return withNotes(
    withBar(draft, index, (bar) => ({ ...bar, [hand]: false })),
    hand,
    notes,
  )
}
