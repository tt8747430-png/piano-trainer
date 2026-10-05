# Every choice in sight, and a sheet you write on

- **Date:** 2026-10-05 · **Follows:** `2026-10-05-chord-builder-every-part-in-sight-design.md`
- **Decided without a review gate** (memory: decide and continue).

## What the owner said

Read against the chord trainer's builder (`~/Downloads/piano/chord-trainer`), Sibelius and Flat:

1. "I still don't get how to add add2 or others to the chords." The builder must separate its choices by purpose,
   as the reference does: the **accidental** (natural, sharp, flat) apart from the letter; the **quality** (major,
   minor, augmented, diminished, nothing else); the **size** (triad, 7th, 9th, 11th, 13th); the **suspension** (none,
   sus2, sus4); the **added tones** (add2, add4, add6, add9, add11, add13), each offered only where the chord can take
   it (a 9th sus2 takes no add2 or add9); then the **inversion**.
2. "Why does the major have D♭ and the minor C♯ minor? It is very misleading." A chooser relabels its notes by the
   quality or mode chosen.
3. Build chord's options are odd ("6th & add", "9ths & more"), and the trainers' one setting hides in a settings
   sheet. "Put more options like the toggle, not hidden in settings pop-ups, like the keyboard controls."
4. The score editor: the four layers (Chords · Melody · Right hand · Left hand) are not needed: "the user clicks on the
   sheet, and whatever part he selected, like Sibelius's blue line, there the note is written." Chords are an extra
   ("a toggle to add chord names"). Clicking the time signature, the clef, a note or a chord should open what changes
   it. The section kinds (Intro, Verse, Ending, Practice, Hymn, Part) make no sense together. The pattern in the song's
   settings changes nothing on the sheet, and "add your own pattern" should be there.
5. Row cards look like they lead to a web page, and their hover is an inset box; the hover over a bar of the sheet is
   a thin ring that looks wrong.

## Decisions

### 1. A note is a letter and an accidental

`NoteChoice` (the kit) replaces `NotePicker`: the seven letters as segments, then ♮ · ♯ · ♭ as segments. What is
chosen is what is written: D♭ stays D♭ whatever the chord, scale or mode. `KeyChoice` replaces `KeyPicker`: letter,
accidental and Major · Minor; only the accidentals that make one of the 30 written keys are offered (D♭ major and C♯
minor, never D♭ minor), so a key is never spelled by a rule the learner did not choose. A root (a chord's, a scale's,
an interval's) takes all 21 spellings; a key the 30.

### 2. The chord builder in the reference's order

Root (letter, accidental) · Quality (Major · Minor · Aug · Dim) · Size (Triad · 7th · 9th · 11th · 13th) · 7th (♭7 · 7,
𝄫7 under a diminished 7th) · Suspension (None · sus2 · sus4, under Major only: a suspended chord has no 3rd, so a minor
one is the same chord) · Added tones (chips named add2 … add13) · Alterations · Inversion · Hands.

- The kernel keeps `ChordParts` (the triad is the quality or the suspension): the fields split it on screen.
- **Each field is offered only what fits the fields before it:** a size the quality stacks to; a suspension the size
  takes (sus2 to the 7th, sus4 but at the 11th); added tones by `addedOf`, which now also offers a 6th over a sus2
  (`6sus2`) and a 9th over an augmented triad (`+(add9)`). Choosing a size the suspension cannot take drops the
  suspension, not the size.
- The root is read as written: `readChordsSearch` no longer respells it.

### 3. Quiz: the reference's chord types, and no settings sheet

- Build chord and Name chord's Custom asks by **size** (Triads · 7ths · 9ths · 11ths · 13ths), **Suspended**
  (sus2 · sus4) and **Added tones** (6 · 6/9 · add9) as chips, and **Altered** as a switch, over the table's chords:
  a quality is asked when its size is on and each of its suspension, added tone and alteration is on.
- **Auto next** is a switch on the trainer's page beside Rounds; the settings sheet goes.

### 4. The keyboard's settings in the rail

From 1024px the rail holds every setting in sight: ‹ ›, then Key size (Fit · Large · Whole) and Note names (C · All ·
None) as small segments, then the map, typing and glissando as toggles. Below 1024px the settings button opens the
same controls as a row under the rail, in place, never a popover over the keys.

### 5. The score editor: click where you write

- **No layer control.** A click on the sheet chooses where the caret writes: the treble staff (the tune), the bass
  staff (the left hand), the chord row over the staff (a chord). The dock shows that place's tools. The written right
  hand is the treble staff's second voice, chosen as Sibelius chooses a voice: **Voice 1 · 2** chips in the note tools
  while the caret is on the treble staff.
- **Chord names** is a toggle in the toolbar (on by default where the music has chords): off, the chord row and its
  tools leave the sheet; the chords stay in the music.
- **What is clicked opens what changes it:** the clef and key signature open the key; the time signature opens the
  song's meter (a fact for a version, which keeps its music); a chord symbol opens the chord tools on it.
- **Sections** are named by what a song has: Intro · Verse · Chorus · Bridge · Ending. The songbooks' own kinds
  (Practice, Hymn, Part) stay on their pieces and are not offered for a new one.
- **The pattern** leaves the song's settings: the Player's Setup chooses it, where it is heard at once. A song's
  page links to making your own pattern from the Patterns page.

### 6. Rows and hovers

A row card is the link: its hover fills the whole card (no inset box), the chevron moves 2px on hover. A bar of the
sheet shows a sand wash under the pointer, no ring.

## Build order

Each its own commit, verified by `typecheck`, `lint`, `test` (and `build` where routes change):

1. Rows and the sheet's hover. 2. `NoteChoice` and `KeyChoice` everywhere. 3. The chord builder. 4. The quiz.
5. The keyboard's rail. 6. The editor: no layers, voices, chord names, clickable signatures, sections, no pattern.
7. DESIGN.md, PRODUCT.md, CLAUDE.md and the glossary.
