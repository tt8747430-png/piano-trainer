import {
  midi,
  otherSpelling,
  PIANO,
  pitchClass,
  spellInKey,
  type Finger,
  type Midi,
  type Tick,
} from '@/shared/lib/music'
import type { HandId } from '@/entities/piece'
import type { Draft, DraftBar, DraftNote, NoteLayer } from './draft'
import { insertBar } from './bars'
import { barAt, barsOf, startsIn, totalTicks } from './timeline'

/** A draft after writing, and where the caret goes next. */
export interface Written {
  readonly draft: Draft
  readonly end: Tick
}

export const notesOf = (draft: Draft, layer: NoteLayer): readonly DraftNote[] =>
  layer === 'melody' ? draft.melody : draft.hands[layer]

/** The draft with a layer's notes, in order. */
export function withNotes(draft: Draft, layer: NoteLayer, notes: readonly DraftNote[]): Draft {
  const sorted = [...notes].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  return layer === 'melody'
    ? { ...draft, melody: sorted }
    : { ...draft, hands: { ...draft.hands, [layer]: sorted } }
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
    if (layer === 'melody' && n.startTick < at && n.startTick + n.durationTicks > at) {
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
  const ready = layer === 'melody' ? grown : writtenAt(grown, layer, at)
  const reach = layer === 'melody' ? totalTicks(ready) : handReach(ready, layer, at)
  const end = Math.min(at + ticks, reach)
  const played = layer === 'melody' ? [Math.max(...keys)].map(midi) : [...new Set(keys)]
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
  const ready = layer === 'melody' ? draft : writtenAt(draft, layer, at)
  const reach = layer === 'melody' ? totalTicks(ready) : handReach(ready, layer, at)
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
  if (layer === 'melody') {
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
export const deleteNotes = (draft: Draft, layer: NoteLayer, at: Tick): Draft =>
  notesAt(draft, layer, at).length === 0
    ? draft
    : withNotes(
        draft,
        layer,
        notesOf(draft, layer).filter((n) => n.startTick !== at),
      )

/** The notes at `at`, each changed; the draft as it was when none is there. */
function changeAt(
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
  change: (n: DraftNote) => DraftNote | null,
): Draft {
  const notes = notesOf(draft, layer)
  const changed = notes.map((n) => (n.startTick === at ? change(n) : n))
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
export const shiftNotes = (draft: Draft, layer: NoteLayer, at: Tick, semitones: number): Draft =>
  changeAt(draft, layer, at, (n) => {
    const moved = n.midi + semitones
    return moved < PIANO.from || moved > PIANO.to
      ? null
      : { ...n, ...spelledIn(draft, midi(moved)) }
  })

/** The notes at `at` written the other way (C♯ ↔ D♭). */
export const respellNotes = (draft: Draft, layer: NoteLayer, at: Tick): Draft =>
  changeAt(draft, layer, at, (n) => ({ ...n, spelled: otherSpelling(n.spelled) }))

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
