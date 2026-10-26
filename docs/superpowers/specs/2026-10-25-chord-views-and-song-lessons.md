# The Player's chord views and learning a song by its sections

Date: 2026-10-25 · Decisions: [ADR 0099](../../adr/0099-the-players-chord-views.md),
[ADR 0100](../../adr/0100-learn-the-song-by-its-sections.md) · Reference: Chordify's app (the owner's 22 screenshots,
2026-10-25), on a phone held upright.

The owner: add Chordify's ways of showing a song to the Player (its chords over the words, its chord diagrams, its
grid of beats, the views to choose between), its chord summary as diagrams, and its song overview: a song learned
step by step, section by section. Piano only: Chordify's guitar, ukulele, capo and tuning have no place here.

## 1. What Chordify does (the reference, read off the screenshots)

### 1.1 Pick your view

A sheet "Pick your view — Choose how you want your chords to be presented": a segmented choice **Over lyrics ·
Diagrams · Grid**, under it a picture of the view chosen (a small preview drawn in the view's own style), the
instrument (Guitar · Ukulele · Piano) for Diagrams, a box "Show this when opening a song", and "Start jamming". The
view chosen is the first item of the song screen's toolbar (`OVER LYRICS ▾`, `PIANO ▾`, `GRID ▾`), which opens this
sheet; the toolbar's other items are Transpose (−1), Capo and Simplify.

### 1.2 The three views

- **The beat strip.** One row of beat cells across the screen, a thick barline before each bar's first beat, a
  chord's name in the cell where it starts, the beat sounding filled dark (the chord's name white on it). It slides
  under a fixed point as the song plays: the beat sounding stays about a third in. Over lyrics keeps it at the top
  while the words scroll under it; Diagrams has it under the diagrams.
- **Over lyrics.** At the top the beat strip, then the song's chords as small keyboard diagrams in a row (its chord
  summary), then the song by section: each section's name in spaced capitals (INTRO, VERSE 2, INTERLUDE); each line
  of the words with the chords as small chips over the word where each starts (`F#m` over "sing" of "The people
  sing"); a section with no words its chords as chips, a line of chips for each line of music. The line playing is
  bold, its chord's chip filled dark; the others grey. A chip tapped opens a sheet: the chord's keyboard diagram as
  wide as the screen, "C♯m⁷ chord", **Close** and **Play** (it sounds).
- **Diagrams.** The chord playing as a large keyboard diagram (about half the width), its name under it; the next
  chord's diagram beside it, greyed. Under them the beat strip; under it the line being sung (bold) and the next
  (grey), a short bar between them showing the way through the line.
- **Grid.** The song's bars as rows of beat cells (two bars a row on a phone, four beats each), a thick barline
  before each bar, the chord's name in the cell where it starts (a size down where a cell is narrow), the beat
  sounding filled dark. The rows scroll to keep the beat sounding in sight.

The keyboard diagram: a little over an octave of keys (ten or eleven white keys) outlined, the chord's keys marked by
dots: a dark dot near the foot of a white key, a white dot on a black key. The next chord's diagram is the same,
greyed.

### 1.3 The transport and the song's menu

The transport (at the foot): ⏮ (to the start) and ▶; Tempo (100 %), Volume, a count-in (3, 2, 1…) and Loop. The
song's ⋮ menu: Add to setlist, Adjust view settings, Share chords…, Export to PDF, Export to MIDI, Add to Offline Mode,
Report inaccurate chords, **Song information** (a sheet: Chord summary as diagrams, Tempo 143 BPM, Song frequency 440
Hz). On Discover a song's card lists its chords under its title (`G Cm Fm E♭`).

### 1.4 Learn the song

- **The song's page.** A card: the song's picture, its title, "Ready to learn the song step by step? Let's start with
  the Intro!" and a progress bar. Three fact cards with icons (Capo None, Tuning E A D G B E, BPM 77). Then its
  sections as rows in one card: a coloured tile with a note (Intro yellow, Verse blue, Chorus green, Instrumental
  grey, Outro yellow, Bridge purple), the section's name, "10 Lessons", "0/10 completed" and a round arrow. At the
  foot: "Play along with Chordify — You have not completed the lesson yet, but you can try and play along", a row to
  the song itself.
- **A section's page** ("Learn the intro", "Learn the verse", "Learn the bridge"): the same card with "Intro summary"
  and the section's chords, `3⟲ C♯m⁷ · Emaj⁷ · F♯m⁷ · G♯sus4` (played three times round), its progress; the fact cards;
  then **Chords**: "Learn C♯m⁷" for each chord, two cards a row, each a tile in the section's colour with the
  instrument; **Transitions**: "Practice to the tempo — Chord transitions" (the section's chords in time; a section of
  several sequences has "1st chord sequence", "2nd chord sequence", "3rd chord sequence"), then **Individual
  transitions**: "From C♯m⁷ to Emaj⁷" for each change, the last back to the first; **Strumming**: "Practice the
  strumming pattern".

## 2. The Player's views (ADR 0099)

### 2.1 The view, and where it is chosen

The Player shows a piece in one of four **views**: **Sheet music** (the score, as now), **Chords over lyrics**,
**Diagrams** and **Grid**. The view is saved, the same for every piece, in `pt-settings`' `scoreView.music:
'sheet' | 'lyrics' | 'diagrams' | 'grid'` in place of the `notation` switch (the version goes up; ADR 0038: a save of
another version reads as the defaults). The default is Sheet music.

It is chosen at the top of the Player's View menu (the eye): four tiles, each a small picture of its view drawn in
the view's own style (a few bars of staff; a chip over a line of words; a diagram beside a greyed one over a strip of
beats; a grid of cells with one filled) over its name, the one shown pressed; the rest of the menu under them is
what that view has. The editor's View menu, which always shows the score, has no such choice: the tiles are the
Player's own part of the menu (`ScoreViewMenu`'s `views` slot, as `children` is its switches'). What each view
offers:

| Menu part | Sheet music | Chords over lyrics | Diagrams | Grid |
| --- | --- | --- | --- | --- |
| Layout (across · down · pages) | ✓ | — | — | — |
| Staves | ✓ | — | — | — |
| Chord symbols | ✓ | — (the chords are the view) | — | — |
| Lyrics | ✓ | — (the words are the view) | ✓ (the line sung) | — |
| Finger numbers | ✓ | — | — | — |
| Keys | ✓ | ✓ | ✓ | ✓ |
| Chord positions, Note names | ✓ | — | — | — |

There is no sheet on opening: Chordify asks every time until told not to; the Player opens in the view last chosen,
and the View is one tap away.

The views follow the Player as the sheet does: the beat sounding is the cursor's (Wait mode: the beat awaited;
stopped: where Play starts), moving with Listen's clock (`practice.clock`) as the playhead does; a place tapped takes
the cursor there (`practice.jumpToBeatGroup`, the beat group at or after the tapped beat's tick), which while nothing
plays sounds it and puts its chord on the keys, as a bar of the sheet does. The loop's bars are marked in each (a
band behind their cells, as the chart marks a bar). Every view keeps the music in sight above the transport floating
over its foot (`--float-room`), and the keys, the dock and Wait mode's line stand where they do for the sheet.

A piece of no chord symbol (ADR 0094) has nothing for the three chord views to show: each says so in one quiet line
("This song has no chord symbols") with a button to Sheet music; the choice stays saved.

### 2.2 Beats

A **beat cell** is one beat of a bar as the meter counts it (`beatsPerBar`: quarters in x/4, dotted quarters in 6/8 and
12/8); a bar shorter than its meter's (a pickup, a short bar) has the beats it lasts, a part beat rounded up. A
written bar's cells come from its first pass (`firstPlayedBar`), each with the chord starting in it (a chord starting
part-way through a beat is named in that beat's cell; two chords starting in one beat are both named, the later a
size down). Pure, in `widgets/chord-views/model/beats.ts` (or the chord chart's model, which the Grid shares):
`beatCells(performance): readonly CellBar[]`, each written bar with its section, line, cells and their chords; and
`beatAt(performance, tick)`: the played bar and beat a tick is in.

`useBeat(performance, practice)`: the played bar and beat sounding now. While Listen plays it reads `practice.clock`
each animation frame and sets state only when the beat changes (a few times a second at most); otherwise it is the
beat of `practice.state.beatGroup`'s tick. The views mark the written bar of that played bar (`writtenBarOf`).

### 2.3 The beat strip

`BeatStrip`: one row of all the song's beat cells as played (repeats taken, as the Player plays them), a thick
barline before each bar's first cell, a chord's symbol in its first cell, the cell sounding filled with the
foreground colour and its symbol in the background colour, the loop's cells on a band. It slides so the cell
sounding stands a third of the way in (no scroll bar, `transform` moved each beat with the motion setting's
transition; at once under reduced motion); a cell tapped takes the cursor there. Cells are square, about 3.5rem on a
phone (`size-14`) and a size larger from a tablet; a bar's cells sit a hairline apart, as Chordify's. It is
`aria-hidden` (the Player's transport and the bars' buttons of the other views are the accessible way through); its
cells are not in the tab order.

### 2.4 Grid

The Grid is the Player's chord chart (ADR 0098) in beats: the chart's sections, headed, and its lines as written,
each bar a group of beat cells (a bar's chord names in the cells where they start, its number small in its first
cell's corner, a thick barline before it), the beat sounding filled, the bar the cursor is in kept in sight as the
chart keeps it. A line wider than the screen's room for it (more than two 4-beat bars on a phone held upright, four
on a tablet, eight on a laptop) wraps to more rows. Each bar is a button (as the chart's are: named by its number
and chords, `useBarName`), a tap on a beat taking the cursor to that beat. `ChordChart` becomes this grid; the shared
song page's chart (`tap="play"`) shows the same cells, without a beat sounding.

### 2.5 Diagrams

`ChordDiagrams`: the chord sounding as a large keyboard diagram, its symbol under it in the display face, and the
next chord's (the next chord in played order, the loop's first where the loop goes round) beside it, greyed (on a
tablet and wider, the two after it too, each a size smaller and greyer). Under them the beat strip; under it, where
the piece has words and the View's Lyrics is on, the line being sung in the body face, bold, and the next line
muted, with a thin bar under the line playing that fills as the line goes. No chord yet (a pickup, an empty bar):
the next chord's diagram alone, greyed, its name saying "next". A diagram tapped opens the chord's sheet (§2.7).

### 2.6 Chords over lyrics

`ChordsOverLyrics`: the beat strip sticky at the top of the view's scroller, then the chord summary (§2.7) in a row
that scrolls sideways where it is wider than the screen, then the song by section as written (each bar once, as the
chart has them), each under its name in spaced small capitals (`tracking-[0.3em]`, semibold). Each line of the chart
(its bars as written) is one line:

- **With words** (the verse sung on its notes, verse 1; where the piece has more verses, each verse's line under the
  first, muted): the words as text, syllables of a word joined (a hyphen joins them, `_` holds are not printed), and
  over them the chords as chips, each over the syllable sung where the chord starts, else (it starts between
  syllables, or under a rest) at its place between them; chips never overlap: a chip pushed right by the one before
  it stands at the next room. Words come from the performance's notes (`lyrics` on the notes of the staff they are
  sung on, ADR 0093) in the line's bars.
- **Without words:** the line's chords as chips in a row, in order, one per chord change (a chord held over a bar
  line is not repeated).

The line playing is the foreground, bold; the others muted (they are read, not followed). The chip of the chord
sounding is filled with the foreground colour; the others are a muted wash. A chip tapped opens the chord's sheet; a
line tapped takes the cursor to its first beat. The line playing is kept in sight (scrolled to the top third, under
the strip). Chips are the chord's symbol in the display face (`ChordHeading`'s symbol rendering: `C♯m⁷`), never a
monospace code.

### 2.7 Chord diagrams, the summary and the chord's sheet

- **`KeyDiagram`** (`shared/ui`): a static SVG keyboard of `keys` marked by dots: white keys outlined, black keys
  filled with the foreground colour; a dot on each key held, dark on a white key, the background colour on a black
  key; the bass of the chord (its lowest key) a ring rather than a dot where `bass` is asked for. It spans the white
  keys from the C or F at or below the lowest key held to the E or B at or above the highest, at least ten white keys,
  so a chord sits with a key's room round it. `muted` greys it whole (the next chord). Sizes by its container's
  width; its keys keep a piano's proportion. Named by its chord's name and its notes for a screen reader
  (`role="img"`, `aria-label`: "C♯m7: C♯ E G♯ B").
- **The keys a diagram shows** (`diagramKeys(performance, chord)` in `features/practice` or the views' model): the
  right hand's chord as the Player voices it (`PerformedChord.hand`); where its figure plays no voiced chord (a tune,
  a figure of its own shapes), the chord's tones in close position from the root in the octave from middle C up
  (`placeChord`'s right hand). A slash chord's bass is said by its symbol.
- **The chord summary** (`ChordSummary`): the piece's chords in the order they first sound, each once (the same
  symbol once, the first voicing it has), each a small `KeyDiagram` over its symbol; each a button opening its sheet.
- **The chord's sheet** (`ChordSheet` in `widgets/chord-diagrams`, the kit's `Sheet`): the chord's diagram as wide as
  the sheet allows (at most 28rem), "C♯m⁷ chord" (`chordSheet.title`), then **Close** and **Play** (the chord's keys
  sounded together, `usePlay`). Opened from a chip, a summary diagram, a diagram of the Diagrams view, and the song
  overview's chords (§3).

### 2.8 What the views do not change

The transport, the loop button, Wait mode, the hands, the tempo and the Setup are the Player's own, the same in every
view. The editor keeps the sheet alone. The views read the performance the Player plays, so the Setup's key and
pattern choices show in them (a key changed: the chords and diagrams follow).

## 3. Learn the song (ADR 0100)

### 3.1 The song's page

The song's page (`PieceView`, a song's or a study's) becomes the way into learning it, Chordify's "Learn the song":

1. **The bar** as now: Back, the title, Edit, Learned, More.
2. **The learning card**: a line saying where to go next, and the song's lesson progress as a bar with "k of n"
   (`learnSong.progress`): none done, "Learn it step by step: start with the Intro." (its first section's name); some
   done, "Next: the Chorus." (the first section with a lesson not done); all done, "Every section learned. Play it
   through." The line is a link to that section's page (or the Player, all done). *Removed* (ADR 0100 amended,
   2026-10-26): the owner wanted no card on top; the sections' rows say what is done.
3. **Facts as cards**: Key, Time, Tempo, each a card with its icon over its name and value (`FactCard` in
   `shared/ui`, three across at every width, Chordify's Capo · Tuning · BPM); its second title and who wrote it under
   them as now (`PieceCredits`).
4. **Chords**: the chord summary (§2.7), headed "Chords", each opening its sheet. A piece of no chord symbol has
   none.
5. **Sections**: its sections in order as rows in one card (`RowLink`), each a tile in its section's paint with a
   note (`Music`), its name, "8 lessons · 3 done" and the chevron, opening the section's page. A section's paint
   is its kind's (§3.4).
6. **Play it through**: one row at the foot, "Play along" → the Player, the whole song ("Practise" stays the
   floating action as now).
7. Its note (`PieceAbout`) last.

A piece with one section has no sections list: its page is that section's page's lessons in place (the card, the
chords, the changes, the sequences, the pattern).

### 3.2 A section's page

`/songs/$pieceId/sections/$section` (and `/practice/accompaniment/studies/$pieceId/sections/$section` for a study),
`$section` the section's number from 1. Not found for a section the piece has not. Its bar: Back (to the song's
page), the title "Learn the Verse" (`learnSection.title`), Practise (the Player looping the section).

1. **Its card**: the song's title, the section's summary: its chords in the order they first sound, `·` between,
   and where the section is one run of chords played round several times, "3 ×" before them (`3 × C♯m⁷ · Emaj⁷ ·
   F♯m⁷ · G♯sus4`); its progress bar, "k of n".
2. **Chords**: "Learn C♯m⁷" for each chord of the section (each once), as `RowLink`s in a `RowGroup` (two a row
   from a tablet, one on a phone held upright), each a tile in the section's paint with the piano (`Piano`),
   opening the chord's sheet. In the
   sheet the chord is learned by playing it: on a MIDI keyboard or on the sheet's own keys (a `LiveKeyboard` under
   the diagram, its range round the chord), the chord's keys held together (its pitch classes, any octave, nothing
   else) mark it learned in this song, the sheet saying so ("That's it."), Play still sounding it. The sheet is the
   same everywhere it opens; outside a section's page (the Player's views) it does not record (no `learn` prop).
3. **Changes** ("Transitions"): **Play the chords in time** (one per chord sequence of the section: "1st sequence",
   "2nd sequence"… where it has several, else one row "The whole section") — the Player looping the sequence's
   bars; then **One change at a time** — "From C♯m⁷ to Emaj⁷" for each change between two chords of the section, in
   the order they first come, each once, the last back to the first where the section goes round — the Player
   looping the bar or two the change is in (its first time).
4. **The pattern** ("Strumming"): "Play the pattern on C♯m⁷" for each pattern the section's chords are played by
   (`PerformedChord.pattern`; a section written out note by note has none) — the Player looping the first bar it
   plays in the section. Its row names the pattern (`usePatternName`) in its detail.

Each lesson row shows its state: a check on its tile once done. Done: a chord is learned when played in its sheet
(above); a loop lesson when the Player finishes a pass over its bars in Wait mode (§3.3).

**Sequences.** A section's chord run is its chords in played order, the same chord held over a barline counted
once. Where the run is one shorter run played round k ≥ 2 times whole (`period`), the section has one sequence, that
shorter run's bars. Otherwise its sequences are its lines as written whose runs differ (a line whose run another line
before it has is the same sequence), each the bars of its first line.

### 3.3 Progress

`pt-progress` (its version up) keeps **lessons done**: `lessons: Partial<Record<LessonKey, string>>`, the date each
was first done, by key:

- `${pieceId}:chord:${symbol}` — a chord of the piece played in its sheet on a section's page;
- `${pieceId}:bars:${first}-${last}` — a Wait-mode pass finished over those bars as played (`loopParam`'s numbers,
  counted from 1).

The Player records a finished Wait-mode pass (`outcome === 'finished'`) over its loop, or over the whole piece with
no loop, as `bars:` of those bars (`features/record-lesson`: `recordPass`, `recordChord`). A section page's lessons
are computed from the performance (pure: `sectionLessons(performance, section)` in `features/learn-song` or
`widgets/song-lessons/model`), each with its key, and are done when the store has their key. The song's progress is
the union of its sections' lessons (the same key counted once). A version's music changed (the learner's) leaves the
keys as they are: a lesson's bars that no longer hold what they held are simply done or not by their key; Reset
keeps them.

### 3.4 Section paints

A section's tile paint by its name, in either language, as a learner names parts: intro, outro and ending → sand;
verse («куплет») → sky; chorus and refrain («припев») → grass; bridge («бридж», «связка») → lilac; anything else
(instrumental, interlude, a hymn's part) → yellow. Two sections of one kind wear the same paint.

## 4. The Player's More, and chords on a song's row (ADR 0099)

- The Player's bar gains **More** (⋮, the kit's `ActionMenu`) after the Setup: **Song information** (a sheet: the
  chord summary, then Key, Time, Tempo as the song page's fact cards), **Export to MIDI** (the piece as the Player
  plays it, both hands and every staff, at its tempo, `performanceMidi` beside `midiFile`, downloaded as
  `<title>.mid`) and, for an own song, **Share**. A walk, a progression or an exercise has Export to MIDI alone.
- A song's row (`EntryRow`) lists its chords under its title (its first four, in the order they first sound:
  `G Cm Fm E♭`), in the display face, muted, where it has chord symbols.

## 5. Out of scope

Guitar and ukulele, capo and tuning; Transpose as a toolbar item (the Setup's key is the Player's transpose);
Simplify (a chord size choice exists for progressions; a song's own chords stay as written); volume (the device's);
setlists; offline mode (the app is offline); reporting chords; the song frequency; the video beside the transport;
showing the view picker when a song opens.

## 6. Rounds

1. **Foundations**: `KeyDiagram`, `diagramKeys`, the `chord-diagrams` widget (`ChordSummary`, `ChordSheet` with Play),
   beat cells and `useBeat`, `scoreView.music` in place of `notation` (the Player's Sheet music switch becomes the
   view's choice: Sheet music or the chord chart, until round 2 adds the rest).
2. **The Player's views**: the view tiles in the View menu, the beat strip, Grid (the chart in beats), Diagrams,
   Chords over lyrics, chord sheets from each; tests through `renderApp`.
3. **Learn the song**: the song's page as §3.1, the section's page and route, `pt-progress` lessons, the Player
   recording passes, the chord sheet recording a chord learned.
4. **More and rows**: the Player's More (Song information, Export to MIDI, Share), chords on a song's row.
5. **Review**: screenshots of every view at a phone held upright, on its side and a laptop, in both themes and
   languages; fixes; CLAUDE.md, DESIGN.md, UBIQUITOUS_LANGUAGE.md.
