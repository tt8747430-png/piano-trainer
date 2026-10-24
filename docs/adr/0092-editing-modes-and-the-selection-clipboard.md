# ADR 0092 — Editing modes, and a clipboard that acts on what is chosen

- **Status:** accepted · **Date:** 2026-10-24 · **Amends:** ADR 0089 (Chord as a toggle; the edit row's
  Copy, Cut and Paste of bars) · Research: [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md)
  §5 (Flat's editing modes; Dorico's Insert) · Follows ADR 0088 (the one selection) and 0091 (an editor of a
  score)

## Context

ADR 0089 left two things a notation editor has for later. Writing a note always replaced what stood at the
caret, and Chord was a toggle beside it: a learner who wanted to put a note between two others had to make
room by hand. And the edit row's Copy, Cut and Paste took bars wherever the caret stood, though ADR 0088 had
made the selection notes on a staff, so what was chosen and what was copied were two different things. Flat
has three editing modes (Melody, Insert, Chord; I cycles them) and Dorico two keys (I for Insert, Q for
Chords); in both, Copy and Paste act on the selection.

## Decision

- **One editing mode** (`EditorState.mode`, `EditMode`: `replace` · `insert` · `chord`), Flat's modes under
  our names, in place of the Chord toggle. **Replace** writes a key over what is at the caret, as before.
  **Insert** writes it at the caret and pushes every later note of that staff right by its length
  (`makeRoom`, `insertNotes`); a rest pushes the same way; Delete and Cut take what stands at the caret (or
  the range chosen) and pull the later notes left to close the gap (`closeGap`, `takenAway`), as Flat's do.
  **Chord** adds the key to the chord at the caret, which stays. A value tapped with no note chosen sets the
  next note's value in every mode; with notes chosen it changes them as ADR 0089 says, in Insert mode too.
- **Insert grows the song, never loses a note.** What is pushed past the last bar's end gets bars added at the
  end of the song to hold it (the meter's length, the last chord again), added before the notes move so the
  new bar's timeline does not move them twice. Other staves stay where they are. The gap closed by Delete
  never takes a bar away: the end is left as rests.
- **The Notes section shows the modes** as one `Segmented` control, a picture each (the caret before a note,
  a note with an arrow right, stacked notes), named Replace · Insert · Chord (ru Замена · Вставка · Аккорд),
  with one line under it saying what a key played does in the mode chosen. The caret line names the mode
  where it is not Replace ("… · Insert mode"), on a staff alone: the chord row writes chords whatever it is.
- **I cycles the modes.** Typing owns A to ' and Z X (ADR 0036); I is free, and it is Dorico's key. It is a
  staff's: in the chord row it does nothing. The shortcuts' sheet lists it.
- **Copy, Cut and Paste act on what is chosen** (`ClipEdit`, the `clip` action; Cmd or Ctrl with C, X, V in
  every row). In the chord row they take the bars chosen (else the caret's) as before: that clip stays, and
  the Bar category's edits no longer include them. On a staff they take the notes chosen, the chord's one
  note chosen, or the chord at the caret, timed from where they stand (`copyNotes`; an empty place copies
  nothing). Cut leaves their time as a rest, in Insert mode closing the gap; the chord's one note cut leaves
  the chord, so no gap closes. Paste writes the clip's notes from the caret on the caret's staff
  (`pasteNotes`), spelled in the key there, over what is in their time, or in Insert mode in room made for
  them; bars are added at the end for what runs past it; a hand's chord pasted into the melody keeps its
  highest note at each onset and leaves its fingers behind. The caret lands after what was pasted, so pasting
  again goes on, and the pasted notes stand chosen, so ↑ ↓ or a value act on them at once.
- **One `Clip`,** `{ kind: 'bars', … }` or `{ kind: 'notes', layer, notes, ticks }`. A clip pastes only where
  it goes (`clipFits`): Paste is greyed (`aria-disabled`, a tap doing nothing) with a line saying why
  (`whyNoPaste`: nothing copied yet, the notes copied go on a staff, the bars copied go in the chord symbols),
  so the row never loses a button and the tooltip still opens. Copy and Cut say what they will take in their
  tooltips (`copyTarget`: the bars as printed, the notes chosen counted, the note or chord at the caret).
  Their labels are plain Copy · Cut · Paste again.

## Consequences

- `chordMode` and `EditorState.chord` are gone; `BarEdit` loses `copy`, `cut` and `paste`; `Clip` moves from
  `bars.ts` to `clip.ts`, and the clipboard's edits from `form-edits.ts` to `clip-edits.ts`. `deleteBack`
  becomes `backFrom`, where Backspace takes from, so Replace and Insert can take differently from there.
- A pasted or inserted note never overlaps what was there in the melody (its held note is cut at the caret,
  as writing cuts it); in a hand a note sounding into the caret from before keeps sounding, as writing leaves
  it.
- Flat's separate Duration setting (Replace or Insert for a value changing a note) is not taken: a value on
  notes chosen always replaces, as ADR 0089 says. If a learner asks for it, it is a second mode of the value
  keys, not of writing.
- jsdom opens no tooltip on a hover, so the words of the tooltips are held by the unit tests of `copyTarget`
  and `whyNoPaste`; the screen's test holds the greyed Paste.
