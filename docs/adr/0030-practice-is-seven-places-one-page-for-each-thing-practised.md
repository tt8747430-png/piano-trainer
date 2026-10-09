# ADR 0030 — Practice is seven places, one page for each thing practised, and a progression has one model

- **Status:** accepted, amended by ADR 0034 (Free play, the eighth place) · **Date:** 2026-10-05 · **Amends:** ADR 0029 (Practice by topic, Explore · Quiz · what it
  plays), ADR 0015 (progressions as pieces), ADR 0019 and 0020 (Learn's tools, a progression player source), ADR 0022
  (what is remembered)

## Context

After ADR 0029 the owner read Practice again and found it moved, not rebuilt. Six topic tabs listed some forty-five
rows under "Explore", "Quiz" and what each plays: the old Learn pages one level down. Progressions were there three
times (a tool with its own library, a list of pieces, and "Through the keys" exercises); _Daisy fields_, a song, was
listed as a progression; "Chords of a scale" and "Chords by semitones" were rows of their own though the Scales and
Chords pages already walked them; the library was a column of rows with chevrons that chose in place; the explorers
split their choices and "the rest" into two columns that followed no order of reading; and one black key was D♭ here
and C♯ there, sometimes on one screen.

## Decision

- **Practice lists seven places and remembers nothing:** Chords, Scales and keys, Progressions, Intervals,
  Accompaniment, Exercises, Quiz. Each is one page family for a thing practised; a row says what is inside it. The
  topics, their tabs and "Explore" go.
- **A subject's pages are tabs that are links** (`NavTabs`, the widget `subject-tabs`): Chords is Build · Find;
  Scales and keys is Scale · Chords · Key; Progressions is Progression · Passing chords · Reharmonise; Accompaniment is
  Patterns · Studies. Each tab has its own URL and opens as it was left.
- **Everything has one home.** Quiz holds every trainer in four groups (Chords, Scales and keys, By ear, Reading)
  with My gaps in its bar. Exercises holds the drills of no other page (technique, Barry Harris, Piano With Jonny);
  a scale's exercises open from Scales and a chord's arpeggio from Chords, on what is shown. The catalogue's five rows
  that another Player already played are deleted with their type.
- **Available tensions are a part of the chord built**, shown under a 7th chord that takes them; they are no page.
- **A progression that is practised has one model, the library:** a named line of numerals in a style, once in its
  mode, with its note, the pattern its Player opens with and its chord size. The twelve authored progression pieces
  dissolve into it. Numerals read a dominant's written ♭9, the one alteration the resolutions teach.
- **A piece's kind is not its format.** A song may be written in degrees (`isDegreePiece`): _Daisy fields_ is a song,
  in Songs' "Other songs". The kind and collection `progression` go, and with them a piece's walk through the keys.
- **A page that shows a thing on the keys reads top to bottom:** the keys pinned; what it is, with the page's one
  honey Play; its choices as labelled fields in a grid that takes the columns it is given (`grid-fields`,
  `Labelled`); then its sections. The two equal columns go.
- **A row that chooses is never a row that leaves.** `RowLink` is only ever a link; a long list to choose from is a
  pop-up button (the progression library).
- **A note has one name on a screen.** A note is chosen from the twelve in sight (`NotePicker`) and a key from all 24
  (`KeyPicker`: the major keys over the minor, each under the one name the circle gives it, so the picker never
  relabels itself); the pop-up choosers of notes and keys go. Inside a key the circle of fifths writes the key's own
  chords as the key spells them, and a key's borrowed chords are named plainly with their tones.

## Consequences

- `pt-views` is version 3: Practice's topic and Available tensions are forgotten; the Chord finder, Passing chords and
  Reharmonise are remembered under their tabs' paths.
- The Path loses the twelve progression steps. A saved mark for one names a piece no longer there, which the stores
  allow.
- A lesson's link to tensions opens the builder on that chord; its links to Passing chords and Reharmonise open the
  tabs.
- Passing chords and Reharmonise keep ADR 0019's naming (letters, then plainly): a tritone substitution falls a half
  step into its chord, so its root is spelled from where it goes.
- The Scales page shows the playing hand's fingers under the keys; "Fingers" is no choice of its own.
