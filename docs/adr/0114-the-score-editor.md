# ADR 0114 — The score editor edits a score as notation software does, on what is chosen and where it is printed

- **Status:** accepted · **Date:** 2026-10-01 · consolidated 2026-10-27 · amended 2026-10-28

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
  makes them that long (`setDuration`). ♯ ♭ ♮ are toggles; a rest makes a range's notes rests; a tool that needs notes
  is greyed, saying why.
- **Three editing modes**, Flat's: **Replace** writes over what is at the caret; **Insert** writes there and pushes the
  staff's later notes right, adding bars at the end to hold them, and Delete or Cut close the gap; **Chord** adds the
  key to the chord at the caret. I cycles them.
- **The clipboard acts on what is chosen**: bars in the chord row, notes on a staff (`Clip`). Paste writes from the
  caret on its staff and leaves what it pasted chosen; it is greyed where the clip cannot go, saying why.
- **Edited where it is printed**, as Flat and Dorico do; there is no Song sheet:
  - the title, typed in place at its printed size;
  - the tempo mark, a dial: the beats a minute large in a circle with its tempo word, held and swiped along a ruler of
    tempo words, the note it counts chosen under it;
  - a key signature, the time signature, a clef, and a key's place where it prints none, each opening its sign
    picker;
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
- **One palette** on the selection, docked as Flat's and never floating over the music (`EditorPalette`, one tree
  for every size):
  - **A panel** at the sheet's left where the screen is 48rem across (`usePalettePanel`: a laptop at any window size,
    a tablet, a phone on its side, whose height is too short for a sheet at the foot; width decides, not the pointer).
    Its sections fold as an accordion, several open at once, the Notes and Pitch open first; « hides it whole, the
    sheet taking its room, and the toolbar's first key shows it again.
  - **The note-entry toolbar** over the sheet beside it, Flat's quick toolbar: ♮ ♯ ♭ and Respell, the values whole to
    64th, Dotted, Double dotted, Tie, the triplet (the duplet in compound time) and Rest, in a sand pill; the Keys toggle at its end. It scrolls sideways
    where the room is short.
  - **A sheet** docked at the foot on a phone held upright, shrinking the sheet rather than covering it. Compact, as it
    opens: the same everyday tools as a quick row over the bar of categories. Expanded (its ⏏, a category tapped, or
    its grab handle dragged up): every section stacked and scrolling, the bar following them; its keys a table, or a
    list naming each (list mode). The keys stand where the sections would: expanded, it folds them; with them shown,
    it stays compact. While it is expanded the transport steps aside. A field typed in (a chord symbol, the lyrics,
    the fingering) swaps the sheet for a slim bar over the phone's own keyboard (`FieldDocked`).
  - **Sections in Flat's order:** Notes (the editing modes and the tuplets of 2 to 9; on the sheet the everyday
    tools too) · Pitch (steps, semitones, octaves, the grace notes, 8va, 8vb, 15ma and 15mb) · Articulations (with
    portato, the breath mark, the caesura, the slur and the fingering) · Ornaments (with the inverted turn, the
    tremolos of 1 to 3 strokes, the glissando, and Tremolo between notes on the first of a pair) · Dynamics (every one of Flat's, with the hairpins and the pedal) ·
    Bar (with the page break; Tempo & swing: a tempo change typed over the note, the swing marks; Bar repeats &
    rests) · Clef · Key signature · Time signature (the common meters as tiles, C and ¢ among them, then Another
    opening the picker) · Barlines & repeats (with repeat ×N, once more each tap up to nine, and the 3rd and 4th
    endings) · Text (the Lyrics and the chord symbol's keys, free text typed over the note, the Roman numeral of the
    chord there, then the expression words).
  - **Keys** are Flat's: square cells of a bordered table, 44px at the least, empty cells left blank; pressed, a sky
    glyph on a sky wash (as the pickers' cells); greyed, faded, the tooltip saying why. A tooltip is the key's name
    then its shortcut in brackets, as Flat's (`TOOL_SHORTCUTS`).
  - Whether the panel is hidden and the sheet compact is kept by place (`paletteFolded`: `panel`, `sheet`); the panel
    shown and the sheet compact until the learner chooses; the panel's open sections by name (`paletteSections`),
    the Notes and Pitch until the learner opens or folds one.
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
- **Sign pickers** (`SignPicker`): a sheet from the foot on a phone, a popover by the sign on a laptop, ✗ and ✓ at its
  foot (Escape and Enter), one Undo step.
  - **Time:** Current and Pickup, each drawn as it prints on faint staff lines, each figure a wheel. Within the
    song's kind any section takes any meter; across kinds the song's own meter at its head rewrites every tick so each
    note keeps its length (a meter that would split a note is greyed). For 4/4 and 2/2, the C or ¢ symbol.
  - **Key:** one to seven sharps over one to seven flats, Major · Minor, Switch to natural; Change the key for the
    whole song moves the music, else the key changes from that section on and the notes stay where they are.
  - **Clef:** every clef the notation writes, a family a row.
- **A key or a meter changes at a section, never mid-bar; a clef at a bar.**
- **Play** plays the bars as written, at the learner's speed, never changing the song's tempo.
- **New song** chooses Piano, A staff and piano, or A staff, and starts with four bars of no chord symbol.

## Consequences

`docs/CONTENT.md` holds the text the editor writes. The editor's shortcuts are listed by the `?` sheet. A screen
reader hears the caret's place in a polite live line (`CaretLine`).

## History

- 0027 — The editor edits a piece's music, not a Score (2026-10-01). Its model is ADR 0097's.
- 0063, 0065, 0071, 0073 — The palette's tabs, its one screen, its side and its caret moves (2026-10-20 to 10-21);
  the side went with 0094.
- 0072, 0083 — Rows hidden keep their music; every part listed, the piano hidden on a lead sheet (2026-10-21 to
  10-23); the parts went with 0091.
- 0080 — Each option in one menu: Insert and the Song sheet (2026-10-22), superseded by 0089 and 0094.
- 0089 — One palette acts on what is chosen (2026-10-23).
- 0091 — The editor edits a score as notation software does (2026-10-23).
- 0092 — Editing modes and a clipboard on what is chosen (2026-10-24).
- 0094 — The score edited where it is printed (2026-10-24). Its bar is ADR 0115's.
- 0114 — One row of every tool; sign pickers; every meter, clef and tempo unit (2026-10-27).
- r13 — The palette docked as Flat's: a left panel, a note-entry toolbar and a phone sheet in place of the floating
  card and its folded row; Flat's sections, keys and shortcuts; the chord wizard; the grace note (2026-10-28).
- r13 — Flat's notation in its sections: the 64th, tuplets of 2 to 9, the new articulations, ornaments, lines and
  dynamics, tempo changes, swing, free text, Roman numerals, repeat ×N, the 3rd and 4th endings, the page break, bar
  repeats and multi-bar rests (2026-10-28).
- r14 — Undo and redo bring back what was chosen (the notes, a chord's one note, the grace notes) (2026-10-28).
- The research note comparing Flat and Dorico (2026-10-23) and the editor's three design specs, deleted.
