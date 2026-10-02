# The score editor: your version of a piece, and your own songs (sub-project 9)

- **Status:** decided 2026-10-01 under the owner's standing instruction (decide, record, continue). The owner asked
  for the next sub-project of the roadmap (`2026-09-25-next-features-roadmap-design.md` §2: "**9 The score editor**:
  on a computer: your version of any piece (notes, melody, chord symbols), and new scores written from scratch (a
  listed song with no chart yet); undo and redo; input by mouse, computer keyboard or MIDI; the Player plays your
  version; reset to the original"). Sub-project 6 (the Path as a course) stays skipped at the owner's word; nothing
  here depends on it.
- **Builds on:** ADR 0002 (content as code), ADR 0003 and 0022 (the view in the URL, remembered views), ADR 0013
  (the Performance is the one playable truth; `notate` writes it), ADR 0016 (a recording plays along), ADR 0023 (an
  inversion and a walk of keys play any chart), ADR 0026 (the learner's own beside the built-in, looked up in one
  place).
- **From the owner (roadmap §7):** "we should be able to have real sheet music that is our songs play and not just
  the keyboard. and we should be able to edit the scores and the notes, at least on computer for now"; "yes i can
  upload scores and edit them"; MusicXML "for now it is only planned as coming soon not yet to add"; recording from a
  MIDI keyboard "put this only in plan".

## 1. What the earlier changes mean for this plan

Checked against what shipped after the roadmap and ADR 0013 were written:

- **A piece is a lead sheet arranged by a pattern.** A song or study is its chart (sections of lines of bars of
  chords), an optional tune (`melody`) and a pattern; `arrange` turns them into the Performance the Player plays, in
  any key, chord size, inversion or walk of keys. ADR 0013 expected the editor to edit a Score and add
  `perform(score)`; that would freeze a piece into one key and one accompaniment and throw away what makes it a
  piece here. **The editor edits the piece's music instead** (its chart, its tune, and any bar of either hand
  written note by note), and the Performance still comes from `arrange`. ADR 0027 records this and amends ADR 0013's
  consequence.
- **Only 3 of 54 pieces have a tune,** and 7 songbook entries are listings with no chart. Writing a tune and writing
  a listing's chart are the editor's most valuable work: a tune opens the doubled melody and the tune patterns
  (r5–r7).
- **The learner's own work is saved state beside content, looked up in one place** (ADR 0026's pattern book).
  Pieces follow the same shape: the **repertoire** holds the catalog's pieces, each in the learner's version where
  there is one, and the learner's own songs.
- **Remembered views** (ADR 0022) key a piece's Player view by its path, so a version (same id) keeps the learner's
  view, and an own song gets its own.
- **Lessons and the Patterns reference name catalog pieces** (a lesson's pattern over `otche`, a pattern's "Used in").
  They teach what the catalog holds, so they keep reading the catalog, never a version.
- **Progressions** are numerals grown by the Chord size; the Progressions tool already writes any progression in any
  key. A version of a progression is not needed and is not offered.
- **The keyboard settings' typing keys** (A to ', the row above, Z X) play the piano on every screen, the editor's
  too: the editor's own shortcuts use only keys typing leaves free (digits, `.`, arrows, Backspace, Delete, Enter,
  Escape) and the platform's Cmd/Ctrl shortcuts.

## 2. What the learner writes

- **A version** is the learner's music for a catalog song or study, or the chart they wrote for a listing: a key, the
  meter (the original's, fixed), a tempo, a pattern, sections of lines of bars of chords, a tune, and written hands.
  It replaces the original wherever the piece is played (its page, the Player) until **Reset to the original**
  deletes it. A version equal to its original is no version: saving it removes it. Title, credits, source and note
  stay the original's.
- **An own song** is a song the learner wrote from scratch: a title of their own (1 to 80 characters) and the same
  music. Its id is `my-<n>`, never given twice. It sits on Songs under **Your songs** and plays like any song.
- **A written hand** is one bar of the right or left hand written note by note, played in place of the pattern's hand
  in that bar. Any bar of either hand may be written; the rest are the pattern's. Written notes carry fingers where
  they were written with them.
- **The repertoire** (`repertoire(state)` in `entities/piece`, `useRepertoire()` from the store): `entry(id)` (a
  catalog entry, in its version when there is one: a listing with a version is a song; or an own song), `piece(id)`
  (the same, playable), `original(id)`, `ownSongs`; whether the learner has a version is a selector over the store
  (`selectHasVersion`, with `selectVersion` and `selectOwnSong`). The router asks it whether a
  piece, its page or its editor is there.
- **A recording plays along with a version** only while the version keeps the original's timeline: the same meter,
  key and every bar's length. Otherwise the version has none (the singer would be over other bars).

## 3. The format: a written hand in the piece's own text

A version is stored as the content writes a piece (CONTENT.md), so one parser reads content and saved music alike,
and a version is a `ChartPiece`. The format gains one field:

`hands: { rh?: string, lh?: string }`: each hand's bars separated by `|`, one entry per bar of the chart in order:

| Written                      | Means                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `-`                          | The pattern plays this hand in this bar                                                   |
| `C4/1 E4/1 G4/2`             | Notes one after another, each a pitch and its beats, as the melody writes them             |
| `C4+E4+G4/2`                 | Notes struck together (`+`)                                                               |
| `E4^3`                       | A finger (1–5) on a note, as the figure notation writes it                                |
| `r/1`                        | A rest                                                                                    |
| `C3/4 E3+G3/1@2 E3+G3/1`     | `@beat` places a token on a beat of the bar, counted from 1 (`@2.5` the "and" of 2), so a held note and the notes over it are both written; the next token follows it |

A note may last past its bar's end only into a bar where the same hand is written (it is held across the barline).
Every note lies on the piano (A0–C8) and on whole ticks. `parseChart` reads the hands into each bar, so a mistake
names its bar like a chord's.

**The writer** (`entities/piece/model/write-*.ts`): music → text in the shortest form the parsers read back the
same: a bar's chords without `@beats` when they share a full bar equally, else each with its beats; the melody's
notes with rests for gaps and `|` where a barline falls between notes; a hand's notes in onset order, chords joined,
`@beat` only where a note starts before the one before it ends. `parse(write(music))` equals `music` for every piece
in the catalog (a test).

## 4. Saved state: `pt-pieces` (version 1)

`entities/piece/model/store.ts`, a `createSavedStore`:

```ts
interface PiecesState {
  /** The learner's version of a catalog song, study or listing, by its id. */
  readonly versions: Readonly<Record<PieceId, PieceMusic>>
  /** In the order made. */
  readonly songs: readonly OwnSong[]
  /** The next own song's number: a deleted id is never given again. */
  readonly nextSong: number
}
/** A piece's music as the content writes it. */
type PieceMusic = Pick<ChartPiece, 'key' | 'meter' | 'tempo' | 'pattern' | 'sections' | 'melody' | 'hands'>
interface OwnSong extends PieceMusic { readonly id: OwnSongId; readonly title: string }
```

The sanitiser keeps what reads: music that parses as a chart piece (its key, meter, a tempo of 40–160, a built-in
pattern, sections whose chart, melody and hands read), own songs with a title of 1 to 80 characters (trimmed) and an
`my-<n>` id once each, `nextSong` past every own id. A version of an id the catalog no longer has is kept (it comes
back if the piece does) and the repertoire passes it by. It follows other tabs.

**Commands** (`features/edit-piece`, one use case per file): `saveMusic(store, target, music)` (a version: removed
when it equals the original; an own song: its music replaced), `resetVersion(store, id)`, `makeSong(store, { title,
key, meter })` (returns the id: one Verse of four bars of the key's tonic chord, tempo 90, pattern r1),
`renameSong(store, id, title)`, `deleteSong(store, id)`.

## 5. How the Player plays it

- `ChartBar` gains `hands?: { rh?, lh? }`: the bar's written notes, from its start, in the chart's key.
- **`arrange`**: in a bar whose hand is written, the pattern does not play that hand (nor the tune a melody pattern
  would give it); the written notes play instead, transposed like the tune (the short way, letters with the key),
  fingered as written, each note under the chord sounding at its onset. The tune and its doubling are the tune's,
  unchanged.
- **`chartInKeys`** moves written notes into each key with the chords.
- **`notate`** is unchanged for the Player. For the editor its timed music may leave a staff of a bar **blank**
  (`TimedMusic.bars[i].blank`): written as one hidden rest that holds the time, so a bar the pattern plays shows no
  rests that would read as silence.
- Everything else reads a version as a piece: `chartOf`, `melodyOf`, `pieceFit`, the headings, the Setup, Wait mode,
  the loop, speed training.

## 6. The score editor

**`/edit/$pieceId`**, full screen like the Player (`notFound()` for a progression, an unknown id or an unknown own
song). Opened from a piece's page (**Edit**; a listing's **Write the chart**) and from Songs' **New song**. It works
with a mouse, a computer keyboard and a MIDI keyboard; on a laptop first, and on a tablet or phone it stays whole.

### 6.1 Layout (the `editor-screen` grid)

- **Toolbar:** ✕ (back where it was opened from, else the piece's page), the title (an own song's, or the piece's
  with "Your version" under it once there is one), Undo and Redo (round, disabled when there is nothing), MIDI, the
  song's settings (⚙), and **Play** (honey, the screen's one action; Stop while it sounds): the piece arranged as the
  Player plays it, from the caret's bar to the end, its keys shown on the keyboard.
- **What to write:** a segmented control, **Chords · Melody · Right hand · Left hand** (the editor's **layer**).
- **The sheet:** the piece by section (each heading a pop-up button) and by line: each chart line is one line of
  grand staff (`ScoreView`), its bars numbered, chord symbols over them, the melody and the written right hand on the
  treble staff, the written left hand on the bass, each line opening with its clef and key signature and the time
  signature only where it changes. It scrolls down; the caret's line stays in sight. In the hand layers, a bar the
  pattern plays reads **Pattern** in soft ink on its staff.
- **The tools** for the layer, in one row over the keys (scrolling sideways on a phone): see 6.3 and 6.4.
- **The keyboard** (`LiveKeyboard`): the notes at the caret marked; a key played is written (6.3).

### 6.2 The caret

Where the next note or chord goes: a tick in the piece, drawn as the Player's cursor band (sky mist) on the layer's
staff, as wide as the note value chosen; in Chords, over the chord row at a beat.

- **← →** move it to the next place: a note's start or end, a step of the chosen value from the bar's start, or a
  barline; in Chords, the next beat or chord. **Alt ← →** a bar. **Home End** the piece's start and end.
- A **click** on a bar puts it at the nearest step of the chosen value; a click on the bass staff chooses Left hand,
  on the treble staff Melody or Right hand (as chosen), on the chord row Chords.
- A line of soft text (and a live region) says what is at the caret: "Bar 3, beat 2 · C5 quarter", "Bar 5 · G7".

### 6.3 Notes (Melody, Right hand, Left hand)

- **The value:** a segmented control of whole, half, quarter, eighth and sixteenth (keys **1–5**), **Dot** (`.`) and
  **Triplet** (in x/4 only); the value's glyph (Noto Music) with its name for a screen reader.
- **A key played** (tapped, clicked, typed, or on a MIDI keyboard) writes a note of that value at the caret, spelled
  as the key spells it (`spellInKey`), and moves the caret past it. **Keys struck together** (within 80 ms of the
  first) are one chord; in the melody, the highest of them. **Chord** (a toggle) keeps the caret where it is, so each
  key played joins the notes there: chords with a mouse or one finger.
- **Rest** (`0`) writes a rest of the value. **Delete** (Backspace or Delete) takes away the notes at the caret.
  **↑ ↓** move them a semitone, **Cmd/Ctrl ↑ ↓** an octave, spelled in the key; **Respell** writes them the other way
  (C♯ ↔ D♭). In a hand, a **Finger** pop-up for each note at the caret (1–5 or none).
- **Writing over:** in the melody, a note cuts the one sounding into it and replaces those starting under it; in a
  hand, it replaces the notes starting under it (a note held from before keeps sounding: a held bass under chords).
  A melody note may cross a barline (the sheet ties it); a hand's note stops at a bar the pattern plays. Past the
  last bar a note adds a bar (the last chord again, the meter's length).
- **A bar the pattern plays** in a hand: a key played writes it out (empty, then the note); **Write out** fills it
  with what the pattern plays there, to change; **Back to the pattern** gives it back.

### 6.4 Chords and form (Chords)

- **A chord at the caret:** typed in the **Chord** field (any symbol the chart reads; Enter sets it and moves to the
  next bar, Tab to the next beat; a symbol it cannot read says so in one line), tapped from **the key's chords** (its
  seven triads and V7, by name), or played: keys struck together (three or more) set the chord the Chord finder names
  there. A chord lasts until the next or the barline. **Delete** gives its beats to the chord before it (a bar's first
  to the one after; a bar keeps one chord). A chord's method code stays with it; a new one takes its bar's.
- **Bars:** **Shift ← →** or Shift-click selects bars. A **Bar** pop-up: Add a bar after, Delete the bars, Copy,
  Cut, Paste after (Cmd/Ctrl C X V), New line here, Join with the next line, New section here, and **Length** (from
  an eighth to the meter's bar, named as a time signature: 1/8 … 4/4). A new bar takes the bar before's last chord.
  Bars carry their melody and written hands with them. The piece keeps at least one bar.
- **Sections:** each heading is a pop-up: its kind (Intro, Verse, Chorus, Ending, Part, Hymn, Practice; a new verse
  takes the next number, a new part the next letter) and **Join with the section before**.
- **The song's settings** (⚙, a sheet): an own song's **Title**; **Key** (the 24 keys: a new tonic moves the music
  by the interval between the tonics, letters kept, as the Player moves it; the other mode of the same tonic changes
  only the key); **Tempo** (40–160); **Pattern** (the built-in patterns the music can play, by group); the meter as a
  fact.

### 6.5 Saving, undo and redo

- **Every change is saved as it is made** (`saveMusic`): there is no Save. Undo (Cmd/Ctrl Z) and Redo (Shift
  Cmd/Ctrl Z, Ctrl Y) walk this visit's changes (up to 200), the caret with them; keys struck together are one step.
- The editor's session is a small store made for the visit (`createEditorStore`): a pure reducer over the draft,
  the caret, the layer, the value, the clipboard and the history; `dispatch` saves the draft when it changed. The
  clipboard lives for the visit.

## 7. Songs and a piece's page

- **Songs:** **New song** is the bar's round + action: a sheet with Title, Key and Meter (2/4 · 3/4 · 4/4 · 6/8 ·
  12/8) and **Make** (honey), which makes the song and opens it in the editor. **Your songs** comes first when there
  are any, and is a choice of the Collection pop-up. A listing with a version lists as a song.
- **A piece's page** (song, study, own song): **Edit** (outline) beside Practise. A version adds the fact "Your
  version" and **Reset to the original** (crimson line; asks first). An own song has **Delete** (crimson line; asks
  first) and no learned toggle (it is on no Path).
- **A listing's page:** its facts and **Write the chart** (honey) in place of "No chart yet".

## 8. Where the code goes

| Slice                      | What                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `shared/lib/arrangement`   | `ChartBar.hands`, `HandNote`; `arrange` plays written hands; `chartInKeys` moves them             |
| `shared/lib/notation`      | `TimedMusic` bars' `blank` staves                                                                |
| `shared/ui/score`          | `ScoreView`'s `timeBefore` (a line that continues prints no time signature it already has)       |
| `entities/piece`           | `hands` in the format, `parseHands`, the writers, `PieceMusic`, `pt-pieces`, the repertoire, its context and hooks |
| `features/edit-piece`      | the commands (§4)                                                                                |
| `features/score-editor`    | the draft (music ↔ draft), its pure edits (notes, chords, bars, sections, key), the editor's reducer and store |
| `widgets/score-sheet`      | the editor's sheet: sections, lines, the caret, the selection, bar targets, Pattern marks        |
| `pages/score-editor`       | the screen: `useScoreEditor` (store, input from keys, MIDI and shortcuts, Play), the toolbar, tools, settings sheet |
| `pages/songs`, `pages/piece` | New song, Your songs, Edit, Reset, Delete, Write the chart                                     |
| `app`                      | `/edit/$pieceId`, the router's `pieces` context, the provider, `renderApp`'s `piecesStore`       |

## 9. Not built now, and why

| Item | Why not yet |
| --- | --- |
| MusicXML load and save | The owner's word: planned only (roadmap §5) |
| Recording from a MIDI keyboard into a score | The owner's word: planned only (roadmap §5) |
| Lyrics under the staff | No piece carries its words; a syllable needs its note (roadmap §5) |
| A lead sheet exported as ChordPro or PDF | Not for this app: no sharing or export; MusicXML is the one exchange format, planned |
| Writing an own pattern's figure note by note | A figure's notes are tokens over any chord, not pitches: a different input from the editor's (patterns spec §8) |
| A version of a progression | The Progressions tool writes any progression in any key (§1) |
| Changing a piece's meter | It would re-bar every note; a new song takes any meter |
| A clipboard across visits or apps | The visit's clipboard covers repeated verses and choruses |

## 10. Words, look and records

- **Glossary:** Version, Own song, Repertoire, Score editor, Layer (Chords · Melody · Right hand · Left hand), Caret,
  Written hand, Struck together; Reset to the original.
- **DESIGN.md:** the editor's layout and sheet (the caret band, the bar selection in sand, Pattern in soft ink), New
  song, the piece page's Edit, Reset and Delete.
- **ADR 0027:** a learner's version is the piece's music in the content's own format; the editor edits music, not a
  Score.
- **CONTENT.md** (written hands), **PRODUCT.md**, **CLAUDE.md**, the roadmap's Built line (sub-project 9), ADR 0013's
  consequence amended.

## 11. Testing

- **Format:** `parseHands` (each token, `@beat`, a note held into a written bar, every mistake named), the writers
  (each rule), and the round trip over every catalog piece.
- **Arrangement:** a written hand replaces the pattern's in its bar and only there, transposed, fingered, under its
  chord; a walk of keys moves it.
- **Store and repertoire:** the sanitiser (each bad shape dropped, `nextSong` past the ids, another tab followed), the
  repertoire (a version over its original, a listing made a song, an own song, the recording rule), each command.
- **Editor model:** every edit (notes, rests, chords, struck together, Chord mode, delete, transpose, respell,
  fingers, bars, lines, sections, length, copy and paste, write out and back), undo and redo, and the draft ↔ music
  round trip.
- **App (`renderApp`):** make a song, write chords and a melody with the keys and the computer keyboard, play it,
  open it in the Player and hear the melody; a version of a song is played in the Player and reset; a listing gets a
  chart and opens in the Player; undo and redo; a MIDI chord sets a chord; a written left hand plays in the Player in
  another key.

## Review amendments (2026-10-02)

- **A value is always whole ticks:** Dot is off where the dotted value falls between ticks (a 16th in x/4), and a dot
  and a triplet never go together, so whatever the editor writes reads back.
- **An edit that changes nothing is no step:** no undo entry and no save (deleting where nothing is, the same tempo,
  key, pattern or chord, a bar given back to the pattern it already is).
- **A tapped chord stops on the last bar;** Enter in the Chord field still adds a bar past it, to type a chart on.
- **Cmd/Ctrl C X V edit bars in the chords only;** in the melody or a hand they do nothing.
- **The caret line names the value:** "Bar 1, beat 4 · F4 half", a dotted or triplet value too; a length no one
  value writes (tied over) is named by its notes alone.
- **`@beats` are written in the shortest decimal that reads back as the same ticks** (`.3333333333` a third of a
  beat), and the chart reads them as whole ticks.
- **A page whose song is gone** (deleted in another tab) shows Page not found with the way back, as the router does.
