import {
  keyScale,
  midi,
  otherSpelling,
  PIANO,
  pitchClass,
  pitchClassOf,
  spellInKey,
  spellScale,
  type Finger,
  type Key,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import type { HandId } from '@/entities/piece'
import {
  isHandLayer,
  isVoiceLayer,
  voiceIndex,
  type Draft,
  type DraftBar,
  type DraftNote,
  type NoteLayer,
} from './draft'
import { insertBar } from './bars'
import { barAt, barsOf, startsIn, totalTicks } from './timeline'

/** A draft after writing, and where the caret goes next. */
interface Written {
  readonly draft: Draft
  readonly end: Tick
}

export const notesOf = (draft: Draft, layer: NoteLayer): readonly DraftNote[] =>
  layer === 'melody'
    ? draft.melody
    : isVoiceLayer(layer)
      ? (draft.voices[voiceIndex(layer)] ?? [])
      : draft.hands[layer]

/** The draft with a layer's notes, in order. */
export function withNotes(draft: Draft, layer: NoteLayer, notes: readonly DraftNote[]): Draft {
  const sorted = [...notes].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  if (layer === 'melody')
    return { ...draft, melody: sorted, melodyStaff: draft.melodyStaff || sorted.length > 0 }
  if (isVoiceLayer(layer)) {
    const index = voiceIndex(layer)
    const voices = [...draft.voices]
    while (voices.length <= index) voices.push([])
    voices[index] = sorted
    return { ...draft, voices }
  }
  return { ...draft, hands: { ...draft.hands, [layer]: sorted } }
}

/** The draft with bar `index` changed; the draft itself where the change leaves the bar as it was. */
export function withBar(draft: Draft, index: number, change: (bar: DraftBar) => DraftBar): Draft {
  const bar = barsOf(draft)[index]?.bar
  const changed = bar && change(bar)
  if (!changed || changed === bar) return draft
  return {
    ...draft,
    sections: draft.sections.map((section) => ({
      ...section,
      lines: section.lines.map((line) => line.map((other) => (other === bar ? changed : other))),
    })),
  }
}

/** The draft long enough for a note at `at`. */
export function reaching(draft: Draft, at: Tick): Draft {
  let grown = draft
  while (at >= totalTicks(grown)) {
    const next = insertBar(grown, barsOf(grown).length - 1)
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

/** A key as the draft writes it: spelled in its key. */
export const spelledIn = (draft: Draft, key: Midi) => ({
  midi: key,
  spelled: spellInKey(pitchClass(key), draft.key),
})

/**
 * Takes the notes starting in [at, to) from a layer; in the melody, a note sounding into `at` is cut
 * there, so the tune stays one line.
 */
function clearUnder(draft: Draft, layer: NoteLayer, at: Tick, to: Tick): DraftNote[] {
  return notesOf(draft, layer).flatMap((n) => {
    if (n.startTick >= at && n.startTick < to) return []
    if (!isHandLayer(layer) && n.startTick < at && n.startTick + n.durationTicks > at) {
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
  layer: NoteLayer,
  at: Tick,
  keys: readonly Midi[],
  ticks: Tick,
): Written {
  const grown = reaching(draft, at)
  const ready = isHandLayer(layer) ? writtenAt(grown, layer, at) : grown
  const reach = isHandLayer(layer) ? handReach(ready, layer, at) : totalTicks(ready)
  const end = Math.min(at + ticks, reach)
  const played = isHandLayer(layer) ? [...new Set(keys)] : [Math.max(...keys)].map(midi)
  const written: DraftNote[] = played.map((key) => ({
    ...spelledIn(ready, key),
    startTick: at,
    durationTicks: end - at,
  }))
  return { draft: withNotes(ready, layer, [...clearUnder(ready, layer, at, end), ...written]), end }
}

/** A rest at `at`: the notes starting under it are taken (a hand's bar the pattern played is written out, silent). */
export function writeRest(draft: Draft, layer: NoteLayer, at: Tick, ticks: Tick): Written {
  if (at >= totalTicks(draft)) return { draft, end: at }
  const ready = isHandLayer(layer) ? writtenAt(draft, layer, at) : draft
  const reach = isHandLayer(layer) ? handReach(ready, layer, at) : totalTicks(ready)
  const end = Math.min(at + ticks, reach)
  return { draft: withNotes(ready, layer, clearUnder(ready, layer, at, end)), end }
}

/** The notes starting at `at`. */
export const notesAt = (draft: Draft, layer: NoteLayer, at: Tick): DraftNote[] =>
  notesOf(draft, layer).filter((n) => n.startTick === at)

/**
 * A key joining the notes at `at`, at their length: the melody keeps its highest; where nothing starts
 * at `at` the key is written as a note of `ticks`.
 */
export function addToChord(
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
  key: Midi,
  ticks: Tick,
): Draft {
  const [first] = notesAt(draft, layer, at)
  if (!first) return writeNotes(draft, layer, at, [key], ticks).draft
  if (!isHandLayer(layer)) {
    return key > first.midi
      ? withNotes(
          draft,
          layer,
          notesOf(draft, layer).map((n) => (n === first ? { ...n, ...spelledIn(draft, key) } : n)),
        )
      : draft
  }
  if (notesAt(draft, layer, at).some((n) => n.midi === key)) return draft
  const added = { ...spelledIn(draft, key), startTick: at, durationTicks: first.durationTicks }
  return withNotes(draft, layer, [...notesOf(draft, layer), added])
}

/** Takes the notes starting at `at` away. */
/** What an edit takes: the notes at a tick (the caret's), or those starting in a span (bars chosen). */
export type Where = Tick | { readonly from: Tick; readonly to: Tick }

const isAt = (where: Where) => (n: DraftNote) =>
  typeof where === 'number'
    ? n.startTick === where
    : n.startTick >= where.from && n.startTick < where.to

export const deleteNotes = (draft: Draft, layer: NoteLayer, where: Where): Draft => {
  const taken = isAt(where)
  const notes = notesOf(draft, layer)
  return notes.some(taken)
    ? withNotes(
        draft,
        layer,
        notes.filter((n) => !taken(n)),
      )
    : draft
}

/** The notes `where` says, each changed; the draft as it was when none is there. */
function changeAt(
  draft: Draft,
  layer: NoteLayer,
  where: Where,
  change: (n: DraftNote) => DraftNote | null,
): Draft {
  const notes = notesOf(draft, layer)
  const taken = isAt(where)
  const changed = notes.map((n) => (taken(n) ? change(n) : n))
  if (changed.some((n) => n === null)) return draft
  return changed.every((n, i) => n === notes[i])
    ? draft
    : withNotes(
        draft,
        layer,
        changed.flatMap((n) => (n ? [n] : [])),
      )
}

/** The notes at `at` moved by semitones, spelled in the key; nothing moves past the piano's ends. */
export const shiftNotes = (
  draft: Draft,
  layer: NoteLayer,
  where: Where,
  semitones: number,
): Draft =>
  changeAt(draft, layer, where, (n) => {
    const moved = n.midi + semitones
    return moved < PIANO.from || moved > PIANO.to
      ? null
      : { ...n, ...spelledIn(draft, midi(moved)) }
  })

/** The key's next note from `from`, up (1) or down (−1): a step on the staff in its key. */
export function keyStep(key: Key, from: Midi, direction: 1 | -1): Midi {
  const inKey = new Set(spellScale(key.tonic, keyScale(key)).map((tone) => pitchClassOf(tone.note)))
  for (let m = from + direction; m >= PIANO.from && m <= PIANO.to; m += direction)
    if (inKey.has(pitchClass(m))) return midi(m)
  return from
}

/**
 * The notes at `at` moved `steps` notes of the key up or down, as a note dragged on the staff moves
 * (ADR 0064); nothing moves past the piano's ends.
 */
export const stepNotes = (draft: Draft, layer: NoteLayer, where: Where, steps: number): Draft =>
  changeAt(draft, layer, where, (n) => {
    let moved = n.midi
    for (let i = 0; i < Math.abs(steps); i++) moved = keyStep(draft.key, moved, steps > 0 ? 1 : -1)
    return moved === n.midi ? n : { ...n, ...spelledIn(draft, moved) }
  })

/**
 * What Delete takes, as a text field's Backspace: the notes at the caret (those chosen), else the
 * last notes before it, the caret going back to where they started; the draft as it was where there
 * are none. Pressed again and again, it takes the notes one by one back from the end.
 */
export function deleteBack(
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
): { readonly draft: Draft; readonly caret: Tick } {
  if (notesAt(draft, layer, at).length > 0)
    return { draft: deleteNotes(draft, layer, at), caret: at }
  const before = notesOf(draft, layer).filter((n) => n.startTick < at)
  const last = Math.max(...before.map((n) => n.startTick))
  return before.length === 0
    ? { draft, caret: at }
    : { draft: deleteNotes(draft, layer, last), caret: last }
}

/** The notes at `at` written the other way (C♯ ↔ D♭). */
export const respellNotes = (draft: Draft, layer: NoteLayer, where: Where): Draft =>
  changeAt(draft, layer, where, (n) => ({ ...n, spelled: otherSpelling(n.spelled) }))

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

/** The notes at `at` joined to the same keys' notes starting where they end: one note, tied as written. */
export function tieNotes(draft: Draft, layer: NoteLayer, at: Tick): Draft {
  const notes = notesOf(draft, layer)
  const joined = new Set<DraftNote>()
  const tied = notes.map((n) => {
    if (n.startTick !== at) return n
    const next = notes.find(
      (m) => m.midi === n.midi && m.startTick === n.startTick + n.durationTicks,
    )
    if (!next) return n
    joined.add(next)
    return { ...n, durationTicks: n.durationTicks + next.durationTicks }
  })
  return joined.size === 0
    ? draft
    : withNotes(
        draft,
        layer,
        tied.filter((n) => !joined.has(n)),
      )
}

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
  const kept = draft.hands[hand].filter((n) => !startsIn(n.startTick, placed))
  const inside = played
    .filter((n) => startsIn(n.startTick, placed))
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
  if (!placed?.bar[hand]) return draft
  const notes = draft.hands[hand].flatMap((n) => {
    if (startsIn(n.startTick, placed)) return []
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
