import {
  keyScale,
  midi,
  note,
  otherSpelling,
  PIANO,
  pitchClass,
  pitchClassOf,
  spellInKey,
  spellScale,
  type Accidental,
  type Finger,
  type Key,
  type Letter,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import type { HandId } from '@/entities/piece'
import { isHandLayer, type Draft, type DraftBar, type DraftNote, type NoteLayer } from './draft'
import { insertBar } from './bars'
import type { TickSpan } from './state'
import { barsOf, keyAt, totalTicks } from './timeline'

/** A draft after writing, and where the caret goes next. */
interface Written {
  readonly draft: Draft
  readonly end: Tick
}

export const notesOf = (draft: Draft, layer: NoteLayer): readonly DraftNote[] =>
  layer === 'melody' ? draft.melody : draft.hands[layer]

/** The draft with a layer's notes, in order. */
export function withNotes(draft: Draft, layer: NoteLayer, notes: readonly DraftNote[]): Draft {
  const sorted = [...notes].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  if (layer === 'melody')
    return { ...draft, melody: sorted, melodyStaff: draft.melodyStaff || sorted.length > 0 }
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

/** A layer's notes with those starting at `from` or later moved `by` ticks. */
const shifted = (notes: readonly DraftNote[], from: Tick, by: Tick): DraftNote[] =>
  notes.map((n) => (n.startTick >= from ? { ...n, startTick: n.startTick + by } : n))

/**
 * Insert mode's room (ADR 0092, Flat's): the notes of a layer from `at` on pushed `ticks` to the
 * right, bars added at the end of the song first to hold what is pushed past it, so nothing is
 * lost. A note sounding into `at` from before stays.
 */
export function makeRoom(draft: Draft, layer: NoteLayer, at: Tick, ticks: Tick): Draft {
  const pushed = notesOf(draft, layer).filter((n) => n.startTick >= at)
  const end = Math.max(0, ...pushed.map((n) => n.startTick + n.durationTicks)) + ticks
  const grown = pushed.length > 0 && end > totalTicks(draft) ? reaching(draft, end - 1) : draft
  return withNotes(grown, layer, shifted(notesOf(grown, layer), at, ticks))
}

/**
 * Insert mode's Delete (ADR 0092): the notes starting in `span` taken and the later notes pulled
 * left by its length, closing the gap as Flat's does. In the melody a note held into the gap (a
 * tie over the barline) is cut there, so the notes pulled left never sound under it.
 */
export function closeGap(draft: Draft, layer: NoteLayer, { from, to }: TickSpan): Draft {
  if (to <= from) return draft
  return withNotes(draft, layer, shifted(clearUnder(draft, layer, from, to), to, from - to))
}

/** A key as the draft writes it at a tick: spelled in the key there (a section's own, ADR 0089). */
export const spelledIn = (draft: Draft, key: Midi, at: Tick) => ({
  midi: key,
  spelled: spellInKey(pitchClass(key), keyAt(draft, at)),
})

/**
 * Takes the notes starting in [at, to) from a layer; in the melody, a note sounding into `at` is cut
 * there, so the tune stays one line.
 */
export function clearUnder(draft: Draft, layer: NoteLayer, at: Tick, to: Tick): DraftNote[] {
  return notesOf(draft, layer).flatMap((n) => {
    if (n.startTick >= at && n.startTick < to) return []
    if (!isHandLayer(layer) && n.startTick < at && n.startTick + n.durationTicks > at) {
      return [{ ...n, durationTicks: at - n.startTick }]
    }
    return [n]
  })
}

/**
 * Notes as the tune holds them, one line (a hand's played into the melody, a take's): the highest at
 * each onset, each cut where the next starts, so no note sounds under another.
 */
export function oneLine<N extends Pick<DraftNote, 'midi' | 'startTick' | 'durationTicks'>>(
  notes: readonly N[],
): N[] {
  const highest = new Map<Tick, N>()
  for (const n of notes) {
    const top = highest.get(n.startTick)
    if (!top || n.midi > top.midi) highest.set(n.startTick, n)
  }
  const line = [...highest.values()].sort((a, b) => a.startTick - b.startTick)
  return line.map((n, i) => {
    const end = Math.min(n.startTick + n.durationTicks, line[i + 1]?.startTick ?? Infinity)
    return end === n.startTick + n.durationTicks ? n : { ...n, durationTicks: end - n.startTick }
  })
}

/**
 * Writes keys at `at` for `ticks`: the melody one note (the highest key), a hand all of them. A note
 * past the end adds bars; a note stops at the piece's end.
 */
export function writeNotes(
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
  keys: readonly Midi[],
  ticks: Tick,
): Written {
  const grown = reaching(draft, at)
  const end = Math.min(at + ticks, totalTicks(grown))
  const played = isHandLayer(layer) ? [...new Set(keys)] : [Math.max(...keys)].map(midi)
  const written: DraftNote[] = played.map((key) => ({
    ...spelledIn(grown, key, at),
    startTick: at,
    durationTicks: end - at,
  }))
  return { draft: withNotes(grown, layer, [...clearUnder(grown, layer, at, end), ...written]), end }
}

/** Insert mode's writing (ADR 0092): keys written at `at` in the room made for them. */
export const insertNotes = (
  draft: Draft,
  layer: NoteLayer,
  at: Tick,
  keys: readonly Midi[],
  ticks: Tick,
): Written => writeNotes(makeRoom(draft, layer, at, ticks), layer, at, keys, ticks)

/** A rest at `at`: the notes starting under it are taken. */
export function writeRest(draft: Draft, layer: NoteLayer, at: Tick, ticks: Tick): Written {
  if (at >= totalTicks(draft)) return { draft, end: at }
  const end = Math.min(at + ticks, totalTicks(draft))
  return { draft: withNotes(draft, layer, clearUnder(draft, layer, at, end)), end }
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
          notesOf(draft, layer).map((n) =>
            n === first ? { ...n, ...spelledIn(draft, key, at) } : n,
          ),
        )
      : draft
  }
  if (notesAt(draft, layer, at).some((n) => n.midi === key)) return draft
  const added = { ...spelledIn(draft, key, at), startTick: at, durationTicks: first.durationTicks }
  return withNotes(draft, layer, [...notesOf(draft, layer), added])
}

/**
 * What an edit takes: the notes at a tick (the caret's), one note of the chord there (its key, chosen
 * alone, ADR 0088), or those starting in a span (the notes chosen).
 */
export type Where =
  Tick | { readonly from: Tick; readonly to: Tick } | { readonly at: Tick; readonly key: Midi }

/** Whether a note is one `where` takes. */
export const isAt = (where: Where) => (n: DraftNote) =>
  typeof where === 'number'
    ? n.startTick === where
    : 'key' in where
      ? n.startTick === where.at && n.midi === where.key
      : n.startTick >= where.from && n.startTick < where.to

/** Takes the notes `where` says away. */
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

/**
 * The notes `where` takes made `ticks` long, as the palette's value tapped with notes chosen makes
 * them (spec 2026-10-23): each onset's notes together (a chord's one note chosen takes its chord, a
 * chord's notes being one length), the first onsets first. Shorter, the time they leave is a rest;
 * longer, the notes starting under them are taken, as writing a note there takes them; a note stops
 * at the piece's end.
 */
export function setDuration(draft: Draft, layer: NoteLayer, where: Where, ticks: Tick): Draft {
  const taken = isAt(where)
  const onsets = [
    ...new Set(
      notesOf(draft, layer)
        .filter(taken)
        .map((n) => n.startTick),
    ),
  ].sort((a, b) => a - b)
  let next = draft
  for (const at of onsets) {
    const chord = notesAt(next, layer, at)
    // Taken by a longer note before it.
    if (chord.length === 0) continue
    const end = Math.min(at + ticks, totalTicks(next))
    const others = notesOf(next, layer).filter((n) => n.startTick !== at)
    const under = others.some((n) => n.startTick > at && n.startTick < end)
    if (!under && chord.every((n) => n.durationTicks === end - at)) continue
    const without = withNotes(next, layer, others)
    next = withNotes(next, layer, [
      ...clearUnder(without, layer, at, end),
      ...chord.map((n) => ({ ...n, durationTicks: end - at })),
    ])
  }
  return next
}

/** Whether notes all carry a sign, ♯ (1), ♭ (−1) or ♮ (0): the palette shows it pressed, and a tap takes it off. */
export const carriesAccidental = (notes: readonly DraftNote[], accidental: Accidental): boolean =>
  notes.length > 0 && notes.every((n) => n.spelled.accidental === accidental)

/** A letter as the key spells it: its note of the key's scale (G major's F is F♯), else plain. */
const letterInKey = (letter: Letter, key: Key): SpelledNote =>
  spellScale(key.tonic, keyScale(key)).find((tone) => tone.note.letter === letter)?.note ??
  note(letter)

/**
 * Flat's accidentals (ADR 0091): the notes `where` takes written on their letter with the sign, ♯
 * (1), ♭ (−1) or ♮ (0), their key following; where every one carries it already, the sign comes off
 * and each letter is spelled as its key spells it, the note back at the key's pitch. Nothing moves
 * past the piano's ends.
 */
export function toggleAccidental(
  draft: Draft,
  layer: NoteLayer,
  where: Where,
  accidental: Accidental,
): Draft {
  const off = carriesAccidental(notesOf(draft, layer).filter(isAt(where)), accidental)
  return changeAt(draft, layer, where, (n) => {
    const spelled = off
      ? letterInKey(n.spelled.letter, keyAt(draft, n.startTick))
      : note(n.spelled.letter, accidental)
    if (spelled.accidental === n.spelled.accidental) return n
    const moved = n.midi + spelled.accidental - n.spelled.accidental
    return moved < PIANO.from || moved > PIANO.to ? null : { ...n, midi: midi(moved), spelled }
  })
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
      : { ...n, ...spelledIn(draft, midi(moved), n.startTick) }
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
    const key = keyAt(draft, n.startTick)
    for (let i = 0; i < Math.abs(steps); i++) moved = keyStep(key, moved, steps > 0 ? 1 : -1)
    return moved === n.midi ? n : { ...n, ...spelledIn(draft, moved, n.startTick) }
  })

/**
 * Where Backspace takes from, as a text field's: the caret, where notes start there, else where the
 * last notes before it start, the caret going back there; null where there are none. Pressed again
 * and again, it takes the notes one by one back from the end.
 */
export function backFrom(draft: Draft, layer: NoteLayer, at: Tick): Tick | null {
  if (notesAt(draft, layer, at).length > 0) return at
  const before = notesOf(draft, layer).filter((n) => n.startTick < at)
  return before.length === 0 ? null : Math.max(...before.map((n) => n.startTick))
}

/** The notes at `at` written the other way (C♯ ↔ D♭). */
export const respellNotes = (draft: Draft, layer: NoteLayer, where: Where): Draft =>
  changeAt(draft, layer, where, (n) => ({ ...n, spelled: otherSpelling(n.spelled) }))

/**
 * The notes a finger goes on (ADR 0091, Flat's), of those `where` takes: a note alone at its place,
 * or the chord's one note chosen alone; a whole chord's notes take none, each fingered in turn (Alt
 * ↑ ↓, `chordNote`).
 */
export function fingeredNotes(draft: Draft, layer: NoteLayer, where: Where): DraftNote[] {
  const taken = notesOf(draft, layer).filter(isAt(where))
  if (typeof where !== 'number' && 'key' in where) return taken
  return taken.filter((n) => notesAt(draft, layer, n.startTick).length === 1)
}

/** A finger on the notes `where` gives one to (`fingeredNotes`), or none. */
export function setFinger(draft: Draft, hand: HandId, where: Where, finger: Finger | null): Draft {
  const fingered = new Set(fingeredNotes(draft, hand, where))
  return changeAt(draft, hand, where, (n) => {
    if (!fingered.has(n) || (n.finger ?? null) === finger) return n
    const { finger: _old, ...rest } = n
    return finger === null ? rest : { ...rest, finger }
  })
}

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
