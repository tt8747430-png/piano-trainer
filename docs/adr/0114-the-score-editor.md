# ADR 0114 — The score editor edits a score as notation software does, on what is chosen and where it is printed

- **Status:** accepted · **Date:** 2026-10-01 · consolidated 2026-10-27 · amended 2026-11-05

## Context

The editor grew out of the chord chart: a bar played the pattern or was "written out", a hand at a time; sections
carried patterns; voices could be added on instruments; a Song sheet and an Insert menu repeated each other. The owner
could not read it as an editor ("this strange hand separations or patterns adding or verses adding"). Flat and Dorico
(the research round of 2026-10-23, and Flat's help pages) were the model: a score is staves; a note is written where
the caret is; the tools that write a note edit the notes chosen; what is printed is edited where it is printed; the
phone has the laptop's tools; signs are chosen in sheets of pictures.

## Decision

- **It edits a score.** Every bar of both hands is written: a piece whose bars a pattern played is written out as the
  editor opens it, as the Player plays it. There are no hands, patterns or parts in the editor: staves, chord symbols
  as text over the music, words and fingers. What is heard is what is written. Sections are the song's form (Intro,
  Verse, Chorus…), started and joined in the editor, and carry no pattern.
- **A pure draft and reducer** (`features/score-editor`) with undo and redo; each step brings back what was chosen with
  the music (the notes chosen, a chord's one note, the grace notes), so the next edit acts where the undone one did.
  Every change is saved as it is made. A
  change its music cannot be written with is said in a notice, the music last saved kept.
- **The caret and the selection.** The staff written is the one the caret is on (a click, or Alt ↑ ↓). Writing past
  the last bar adds one. A double click writes the note there in its bar's key. ↑ ↓ move a step in the key, with
  Shift a semitone, with Cmd or Ctrl an octave. The selection is notes, two tick spans: Shift ← → a note, with Alt to
  the bar's end, Home or End to an end; Alt ↑ ↓ step through a chord's notes. Escape lets go.
- **Every tool acts on what is chosen.** With only a caret, a value sets the next note's value; with notes chosen it
  makes them that long (`setDuration`). ♯ ♭ ♮ are toggles; a rest makes a range's notes rests.
- **Only what applies is shown** (R32-B, MuseScore's Properties panel; the owner: "show only the actions relevant at
  that time"): a key that cannot act on what is chosen is not drawn, never greyed (the tie where no note of the same
  key follows, `canTie`; a dot or tuplet the value cannot take; the accidentals, Respell, the expressions, Roman
  numeral and Tempo change with no note chosen; a line with nothing to draw over; a field that cannot open there).
  Pitch, Articulations, Ornaments and Dynamics, whose every tool changes notes, say "Select a note to use these
  tools." in place of their grid. The strip holds only the categories that act where the caret writes: in the chord
  row Note (the values), Measures, Key signature, Time signature, Barlines and repeats.
- **Three editing modes**, Flat's: **Replace** writes over what is at the caret; **Insert** writes there and pushes the
  staff's later notes right, adding bars at the end to hold them, and Delete or Cut close the gap; **Chord** adds the
  key to the chord at the caret. I cycles them.
- **The clipboard acts on what is chosen**: bars in the chord row, notes on a staff (`Clip`). Paste writes from the
  caret on its staff and leaves what it pasted chosen; it is greyed where the clip cannot go, saying why.
- **Edited where it is printed**, as Flat and Dorico do; there is no Song sheet, and nothing printed has a second
  home in the gear (R32-B):
  - the title and the credits under it, each opening Title and credits (Flat's credits dialog), the one place they
    are typed; a lesson's example prints its title alone;
  - the tempo mark, a dial: the beats a minute large in a circle with its tempo word, held and swiped along a ruler of
    tempo words, the note it counts chosen under it;
  - a key signature, the time signature, a clef, and a key's place where it prints none, each choosing its bar (a
    clef's on its staff) and opening the palette at its category (`useOpenCategory`): the panel on a laptop, the
    palette unfolded on a phone, the keys folding for it. On touch the signs at a line's start, too close to tell
    apart, are one target at least 44 px a side (`headTargets`), opening a menu of Clef · Key signature · Time
    signature; a fine pointer keeps one target a sign;
  - the tempo mark and a section's name each reach at least 44 px for a finger, their print unchanged;
  - a section's name, opening its menu (named as a song's part, or joined to the one before);
  - a staff's name, opening its menu: Rename, Add a staff over or under, Remove (its notes with it; Undo brings them
    back), Hide or Show the piano. The last staff in sight is never removed or hidden;
  - chord symbols, words and fingers, typed in one field floating where they print (`SheetField`): a chord symbol over
    the staff at the caret's beat (Cmd or Ctrl with K, Text's key, or a tap on the chord row), the key's chords
    suggested as one types, or built in the chord wizard beside the field (Flat's: the root's letter and accidental,
    the kind of chord and the chord, the bass as the root or a chord tone), Enter, Add or → writing it and moving a
    beat on; a syllable under the note (Cmd or Ctrl with L), Space or Enter
    going on, `-` and `_` their marks, ↓ ↑ the verses; the fingers over the note (Shift with F), a chord's bottom up.
    A field is greyed while the View hides what it writes.
- **The bar** (R31-E, R32-B, Flat's): Close · Done | Piano keys · Play · Undo · Redo · ⚙ at every size (Flat's
  keyboard button); from 40rem the title after Close and MIDI before Play. Play plays from the caret's bar (Stop while it sounds); no floating transport, no tools
  capsule. Every button is round, inside the bar; below 360px only the icon buttons narrow.
- **One gear** (`EditorGear`, Flat's document menu, the Player's shape: a sheet on a phone, a panel at the right on
  a laptop, a page at a time with Back): View, Transpose, Record a take, Takes; Settings, each one tap away with a
  one-line description: Instruments, Layout, Note input, Recording; an original's Publish…, Versions and Discard
  changes, its saved state beside the title. It holds nothing the score prints (R32-B). The editor opens in the mode it was left in (`editorMode`).
- **One palette** on the selection (`EditorPalette`, one tree for every size), as Flat's (R32-C, help.flat.io and
  the owner's captures of Flat's app and web editor): every category a titled section, all of them in one scroll;
  the category chosen (`paletteCategory`, kept) is the section kept in sight:
  - **A panel** at the sheet's side from 48rem (`usePalettePanel`), left or right as Note input says, as Flat's web
    panel: every section stacked, each folding by its title (`foldedSections`); no strip. A sign tapped on the score
    unfolds its section and scrolls to it. It reaches the screen's edge under the bar's hairline, its tools clear of
    the safe area (the notch of a phone on its side).
  - **Docked** under the sheet on a phone held upright, edge to edge above the keys, the sheet scrolling above it
    (Flat's and forScore's input bar); never over the music.
    Folded (`paletteFolded`, as it opens): the chosen category's tools in one row over the strip of categories;
    unfolded: every section in one scroll, up to half the screen, the strip lighting the section in sight and
    scrolling to the one tapped; Flat's **Show as list** (`paletteList`) turns the cells into named rows, two to a
    line. The keys fold away for it. A field typed in swaps it for a slim bar over the phone's own keyboard
    (`FieldDocked`).
  - **Categories in Flat's order:** Note (Input mode: Replace, Insert, Chord; Notation: Add note, whole to 64th,
    dot, double dot, tie, Tuplets ⌄, rest, ♮ ♯ ♭, respell) · Pitch · Articulations · Ornaments · Dynamics ·
    Measures (bars added and deleted, line and page breaks, a new section; rests and repeats; Tempo and the tempo
    words, accel., rit., a tempo…, as Flat's Measure; swing) · Clef · Key signature · Time signature · Barlines &
    repeats · Text (lyrics, chord symbols, Roman numerals, free text, the character and technique words). In the
    row, a picker's signs alone (`PickerLayoutContext`: `row`; the sections' `palette`).
  - **Keys** are Flat's: equal cells of a bordered table, 44px at the least; pressed, a sky glyph on a sky wash. A
    tooltip is the key's name then its shortcut, as Flat's. A key that cannot act is not drawn (R32-B).
- **Flat's shortcuts** where the typing keys leave them free (`TOOL_SHORTCUTS`, one table for the keys, the tooltips
  and the `?` sheet): 1–6 the values, 8 a rest, 9 a grace note, 0 = − ♮ ♯ ♭, the full stop a dot, the comma a tie,
  a letter alone plays the piano, so Flat's J, S, T and P take Shift (Respell, a slur, a trill,
  the pedal); Shift with < > the hairpins, Cmd or Ctrl with Shift and 8 or 9 the octave lines; Cmd or Ctrl with Shift
  and Enter a bar after, with Backspace the bars deleted, with Enter a new line; [ ] the repeats; 7 the 64th, Shift
  with 2 to 8 a tuplet (9 by its key: Shift with 9 is the acciaccatura's); Cmd or Ctrl with E free text, with Shift
  and K the Roman numeral. Bar repeats, multi-bar rests, the page break, swing and the new marks have no key of
  their own, as in Flat.
- **Grace notes**, Flat's two kinds: the appoggiatura (9, unslashed) and the acciaccatura (Shift with 9, slashed), a
  step above in the key before each note chosen on any staff; the other kind's key switches it, its pitch kept; the
  same key again takes it off. Put there, it is chosen (`grace`): ↑ ↓, Shift a semitone, the accidentals, Respell, a
  key played, the drag and Delete edit it as a note; Escape or any other action goes back to its note.
- **The palette's signs** (R32-C, Flat's; the time signature, key and clef set in their section alone, which their
  printed signs open; the tempo mark keeps its own dial, `SignPicker`):
  - **Time:** Flat's tiles 2/4 · 3/4 · 4/4 · C · ¢ · 6/8, a tap writing it at once from the first bar chosen's
    section on (the song's own in its first), one Undo step; a meter the song cannot take there has no tile. Then
    **Customize** (a wide button; its own cell in the folded row) opens the meter as it prints, its figures wheels
    (any count of 1–16 over 1 to 16), and at the song's head the Pickup wheel, ✗ and ✓ at the foot: a sheet on a
    phone, a popover on a laptop. Within the song's kind any section takes any meter; across kinds the song's own
    meter at its head rewrites every tick so each note keeps its length.
  - **Key:** Flat's table, one to seven sharps over one to seven flats, bare, each named in its tooltip (A major /
    F♯ minor), in the song's mode; **Switch to natural** under it while the key has any. From the first bar chosen's
    section on, the song's own key in its first section.
  - **Clef:** Flat's table, a family a row; no question: on a piano staff a range of bars chosen takes the clef
    alone, the one before it back after it, else it holds until the next clef; a single staff is written in it
    whole.
- **The score's Settings** (R32-B, Flat's document menu): pages of the gear's sheet, on the editor's draft, so each
  change is one Undo step back on the score; while the gear is open the editor's keys and MIDI write nothing. Precise
  names, most used first, each with a one-line description:
  - **Instruments:** New song's families with − n + (`widgets/instrument-list`, one widget for both): a voice is
    added under the last of its kind, else over the next voice down (a choir's order), named and clefed as New song
    names it; a staff of no voice is Other's **Staff**; one fewer takes the last away with its notes (Undo brings
    them back); the piano hides (its music kept), never the last staff in sight; eight single staves at most. A staff
    is renamed on the score.
  - **Layout:** **Staff size**, five sizes from 75% to 130% (Flat's staff size, Dorico's space size), over the size
    the screen gives; a phone on its side still fits a whole system. **Measures per system**, Auto or 1 to 8 at most
    (Flat's measures per system): fewer where they do not fit. Both are the song's (`layout`), so the Player lays it
    out the same; one line across fits its height and keeps neither.
  - **Note input:** **Play notes while editing** (`pt-settings.editing.hearNotes`, on): a note selected on the score,
    a note or chord stepped, shifted or given an accidental, a chord's one note stepped to, sounds, never over Play
    (MuseScore's and Dorico's play notes when editing); **Palette position**, left or right, from 48rem.
  - **Recording:** the metronome, the melody under a take, the count-in.
  - **Title and credits** (opened from the title on the score alone): the title, **Subtitle**, **Composer**,
    **Lyricist** and **Arranger**, each typed in its row (`header`, saved with the music line by line), the others
    by Add credit. They print under the title in lines and on pages, in the Player and the editor alike: the subtitle
    centred, the lyricist at the left, the composer over the arranger at the right, nothing the learner did not
    write. One line across prints the title alone.
  - Not here, as the score prints them: the key, time signature, clef, tempo and bars (the palette and the printed
    marks). Left out, as a piano learner rarely needs them: page size and margins in Settings (we print A4),
    bar-number policies, instruments without their own sound (ADR 0097), and turning off the caret's advance.
- **Tie acts on what is chosen:** each note chosen joins the same key's note after it, a run of one key
  chosen whole becoming one note; with only a caret, the caret's notes.
- **A key or a meter changes at a section, never mid-bar; a clef at a bar.**
- **Play** plays the bars as written, at the learner's speed, never changing the song's tempo.
- **New song** chooses its instruments by family (the score's Settings' list) and starts with four bars of no
  chord symbol.

## Consequences

`docs/CONTENT.md` holds the text the editor writes. The editor's shortcuts are listed by the `?` sheet. A screen
reader hears the caret's place in a polite live line (`CaretLine`).
