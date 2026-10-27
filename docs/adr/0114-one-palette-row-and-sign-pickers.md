# ADR 0114 — The palette folds to one row of every tool; pickers for the key, time and clef

- **Status:** accepted · **Date:** 2026-10-27 · **Amends:** ADR 0089 (the palette's quick row and category
  bar), ADR 0094 (the signatures' popovers), ADR 0096 (the Chord symbol key), ADR 0110 (the sign tiles)

## Context

The owner, on an iPhone 16 Pro Max: the folded palette showed a quick row of note values and Dotted over a bar of
category pictures, so most tools were two taps away; switching sections in the opened palette jumped at the
bottom of the list; since the score became editable where it prints (ADR 0094, 0096) the palette repeated what a
tap on the sheet does; and the key and time signatures were plain grids. Notation apps' sheets were the model: a
time signature of two wheels (Beat, Beat type) beside a Pickup, a "use cut time symbol" switch, ✗ and ✓; a key
signature sheet of one to seven sharps over one to seven flats with "Switch to natural"; a clef sheet of signs.
The console also showed Verovio's "Requesting layout with encoded breaks but nothing provided in the data" for
every line drawn.

## Decision

1. **Folded, one row of every tool** (`ToolRow`, the toolbar "Every tool"), grouped by category in the opened
   palette's order, a hairline between groups, each key named with its group's name in its tooltip
   (`useKeyTip`) and its group's name to a screen reader. It scrolls sideways under a finger, a trackpad and the
   mouse wheel (a vertical wheel turned sideways), snaps to keys, fades at an edge with more beyond
   (`fade-scroll-x`) and brings the key pressed, or reached by the keyboard, into sight. It is one stop of the Tab
   key, ← → Home End along it (`useRovingFocus`). The fold and the Keys toggle stand pinned at its end. One set
   of tools serves both layouts (`PaletteForm`: `row` or `sections`); a key's face in the row is its picture at
   44px (40px on a phone on its side).
2. **Opened, the sections as before,** stacked and scrolling, with the bar of categories in the row's place.
   The bar's mark slides to the category tapped (`layoutId`) while the sections scroll smoothly to it, and
   follows the sections as the learner scrolls them; room after the last section lets it reach the top, so the
   list never jams at its foot. It opens at the category the row showed at its start. The values and Dotted are
   the Notes section's first keys; there is no quick row.
3. **Motion.** Opening and folding is one motion of the sections' height (280ms on the app's ease-out), the row
   and the category bar fading into each other's place; a key gives a little as it is pressed (80ms). Under
   reduced motion all of it is instant (`MotionConfig reducedMotion="user"`, `useReducedMotion`).
4. **Nothing twice.** What the palette held that a tap on the sheet already does:
   - **Removed:** the Chord symbol key. A tap on the chord row (or a symbol printed) and Cmd or Ctrl with K open
     the same field.
   - **Kept, the only way to do it:** Clef, Key signature and Time signature change at a bar that prints none
     (a section starting mid-line, a clef mid-line); the Lyrics key starts the words of a song with none printed
     yet, where no syllable can be tapped; the Fingering key, since no tap opens the fingers' field; Bar's
     keys (bars added, deleted, broken, a new section, a bar's length), which nothing printed does. Every key on
     the sheet is a focusable button, and the shortcuts (Cmd/Ctrl+K, Cmd/Ctrl+L, Shift+F) reach the fields.
   - Bar length's first bar and the time signature's Pickup overlap; Bar length stays for every other bar, and its
     ⓘ says the pickup is the time signature's.
5. **The time signature picker** (`TimePicker`; the sheet's time signature and the palette's Time signature open
   it in a popover): Beat and Beat type as two wheels (`Wheel`: slid, stepped with ↑ ↓, typed into), the
   common meters as quick keys under them; a meter counted in another note (6/8 in a 4/4 song) greyed with its
   reason, since every note would change value (ADR 0095's rule). At the song's head, Pickup: None, then the
   first bar's lengths an eighth apart. For 4/4, **Show as C**. Nothing changes until **Apply**, one step Undo
   takes back (`time` action, `setTime`, `setPickup`); **Cancel** closes it. From a section on, or the whole
   song's at its head, said over it.
6. **Common time** is the song's (`timeSymbol: true` on the piece, its music, the chart, the Performance, the
   draft and the Score; MEI `meter.sym="common"` on every 4/4 printed). `pt-pieces` reads the field as one added
   later (ADR 0038). **Cut time is left out:** ¢ is 2/2, a meter the model has not.
7. **The key signature picker** (`KeyPicker`): Major · Minor, then No key signature (C major / A minor) as a tile
   of its own, then one to seven sharps over one to seven flats, each tile the signature drawn on a staff, named
   `E♭ / Cm` (its full names to a screen reader and in its tooltip), seven to a row where the popover has room.
   A tap changes the key from the section on, or the song's own at its head, as before. With one part in the
   editor, "all the parts" means nothing here and is left out.
8. **The clef picker** is the clefs the notation writes, treble and bass, as sign tiles. The sign tiles are one
   size for clefs, keys and barlines.
9. **Verovio's warning.** Each line's MEI starts its section with a system break (`<sb/>`), so the justified
   line's encoded breaks are in the data; the console is clean in every layout.

## Consequences

- **`shared/lib/notation`, `arrangement`, `entities/piece`, `widgets/score-sheet`:** `timeSymbol`; the line's
  `<sb/>`.
- **`features/score-editor`:** the `time` action (`TimeChoice`, `setTime`, `setPickup`) replaces `sectionMeter`
  and the settings action's meter.
- **`shared/ui`:** `Wheel`; `ToolKey` takes a `tip` and gives under the finger. **`shared/lib`:**
  `useRovingFocus`.
- **`pages/score-editor`:** `EditorTools` (row, category bar, sections), `palette-form`, `PaletteKey`,
  `SectionLine`, `TimePicker`, `KeyPicker`, `useSignatureFrom`; `SignPopover` controlled and as tall as the room;
  `QuickValues`, `ChordAndLyricsKeys` and the chord symbol's palette icon are gone.
- **A proposal not built:** cut time needs a 2/2 meter (and 2/2's beat, a half note) through the arrangement,
  the notation's beams and the Player's click.

## Amendment: the pickers as the owner's examples, every meter, clef and tempo unit

**Date:** 2026-10-27 · **Amends:** points 5, 6, 7 and 8 above, and ADR 0095's meters

### Context

The owner's examples (notation apps' sheets) and words: "try to make as close as possible to this, and add all
missing features using best practices", "and the same for the other ones", "and also the tempo". The time picker
read as form fields (its wheels' neighbours cut off, its Pickup lower than Beat and Beat type); only 2/4, 3/4,
4/4, 6/8 and 12/8 could be written, the beat type locked to the song's kind; a staff was treble or bass; a tempo
mark counted only the song's beat.

### Decision

1. **One frame** (`SignPicker`): a sheet from the foot on a phone (on its side too), a popover by the sign tapped
   on a laptop (64rem and up), titled by what it changes with its Close, what it changes from under the title, an ⓘ
   by the title where its tools need one. A picker that changes nothing until applied ends in ✗ (the warning
   colour) and ✓ (the accent) at its foot's right, each named by its tooltip and to a screen reader (`PickerActions`);
   Escape is ✗, Enter is ✓, one Undo step.
2. **Time.** Current and Pickup, each a time signature drawn as it prints: its two figures large in the serif on a
   staff's five faint lines, each figure a `Wheel`, Beat and Beat type named once at their left. A wheel now shows
   its neighbours on the side it reveals (`reveal`: the top figure's above the staff, the bottom one's below, never
   over each other, never cut), its rows any height. Current is any count of 1 to 12 over 2, 4 or 8; one the song
   cannot take there greyed (`meterBar`). Pickup is a count of a note (1/8, 1/4, 3/8 …), or none (–), under the
   bar's length. For 4/4 and 2/2, **Use common time symbol** or **Use cut time symbol** draws the C or ¢ over both
   figures in the accent. **The common meters' quick keys are gone:** the example has none, the wheels and typing
   reach every meter in two moves, and a row of five keys beside 36 meters said the others were second-class.
3. **Key.** One bordered grid of one to seven sharps over one to seven flats, the signs alone (no staff, no
   name), named `E♭ major / C minor` in its tooltip and to a screen reader, the one in force tinted in the accent;
   Switch to natural under it. **Major · Minor stays**: a cell is a signature, and the mode says which of its two
   keys it sets. **"All the parts"** means nothing with one part, so the switch is **Change the key for the whole
   song**, shown past the first section: on, the song's own key changes, its music moved (`setKey`); off, the key
   changes from that section on (`setSectionKey`). Four columns under 380px, seven from it, so each cell keeps 44px.
4. **Clef.** Every clef notation apps offer: treble and bass, each 8va, 8vb, 15ma and 15mb; the C clefs soprano,
   mezzo-soprano, alto, tenor and baritone; the F clef on the third line and the fifth (`CLEFS`, `CLEF_FORMS`: a
   sign, a line, the octaves its notes sound from where they are written). Written in the hands' and staves' text
   by name (`clef:alto`), in MEI by `clef.shape`, `clef.line` and `clef.dis`/`clef.dis.place` (Verovio draws a
   note's sounding pitch where the octave clef writes it, so the notes are not moved), and a tap on the staff reads
   the note it sounds (`topLineStep`). The picker draws each on a short staff in one grid, a family a row.
5. **Tempo.** The mark large in an accent circle, its tempo word under it (Larghetto added); held and swiped up or
   down it changes a beat a minute every 4px, the screen filled with the accent, the number large and a ruler of
   ticks down the left edge with the tempo words at their marks, until it is let go; a mouse drags it and its wheel
   turns it; a spin button for the keyboard and a screen reader (↑ ↓ one, Page Up/Down ten, Home/End, the number
   typed). Under it the notes the mark may count, the meter's beat first (♩ ♩. ♪ ♪. 𝅘𝅥𝅯; 𝅗𝅥 𝅗𝅥. ♩ in 2/2), the
   one chosen ringed with a caret; another keeps the number. The hint "Hold and swipe" is in the ⓘ by the title,
   not a line shown once: it is always there to find, and no flag needs saving. The accent circle is the one
   coloured fill besides honey on that screen: it is the owner's example, and it is a value, not an action.
6. **Every meter** (`Meter`: `${count}/${unit}`, count 1-12, unit 2, 4 or 8). A meter's **kind** stays what the
   song's ticks count: a quarter in every simple meter (2/2 and 3/2 too, a half 48 ticks), a dotted quarter in
   3/8, 6/8, 9/8 and 12/8. Its bar is `beatsPerBar` beats of its kind (2/2 four, 7/8 three and a half). Its
   **counted beats** (`meterBeats`: 2/2's two halves, 5/4's five quarters, 7/8's 2+2+3 eighths) are what the
   click, the count-in, the MIDI file's click and the metronome follow; their **groups** (`meterGroups`: 5/4 as
   3+2, 6/4 as 3+3, 7/4 as 4+3) are accented by the click, beamed by the notation (LilyPond's `beatStructure`:
   eighths by the half in x/2, by the group in 5/4 and 6/4, 2+2+3 in 7/8, the dotted quarter in 9/8) and each
   played a pattern's figure as a bar of its own (a figure of 4 beats plays 3 then 2 in 5/4, its 3/4 version in
   each half of 6/4); 2/2 plays a pattern as 4/4. The Metronome gains 2/2. Content sections still keep the
   piece's kind.
7. **The beat type changes how the bar is counted, never a note's length** (ADR 0095 revisited). Within the
   song's kind any section may take any meter. Across kinds, at the song's head the whole song changes: every
   tick is written anew (×2/3 into compound, ×3/2 back) so each note keeps its length, the tempo its speed and
   the mark its note (♩ = 120 stays ♩ = 120 in 6/8); where a note falls between the new ticks (a triplet in 6/8)
   the meter is greyed. Past the first section a meter of the other kind is greyed: its sections before it count
   their ticks the other way, and one song has one kind. Least surprise: what the learner hears and sees on the
   notes never changes when the time signature does.
8. **The tempo unit** (`tempoUnit`) is the note the mark counts where it is not the meter's beat. The tempo
   stays the song's beats a minute (a part of one where the mark asks, to a tick's), so playback and the MIDI
   export are unchanged; the mark prints in its unit on both sheets and in MEI (`mm`, `mm.unit`, `mm.dots`), and
   the facts say `♪ = 180` where it is not the beat.
9. **Saves.** `commonTime` is `timeSymbol` (C or ¢ by the meter): `pt-pieces` version 8 (ADR 0038, no reader of
   7). A note may last 24 beats, a bar of 12/2.

### Consequences

- **`shared/lib/music`:** `Meter` and its readers (`meterParts`, `meterOf`, `barTicks`, `meterBeats`,
  `meterGroups`, `groupTicks`, `beatStarts`, `meterSymbol`), the tempo unit (`TEMPO_UNITS`, `tempoUnitsFor`,
  `unitTicks`, `tempoMark`, `tempoOfMark`, `unitNote`), the clefs (`CLEF_FORMS`, `topLineStep`, `clefGlyph`).
- **`shared/lib/schedule`:** the grid's beats from `beatStarts`; the MIDI click from `meterBeats`; 2/2 in the
  Metronome. **`shared/lib/notation`:** beams by the groups; `meter.sym="cut"`; the tempo's unit; the clefs.
  **`shared/lib/arrangement`:** a figure once a group.
- **`features/score-editor`:** `meterBar`, `sameKind`, the whole song rescaled across kinds; the `tempo` action
  (`setTempoMark`). **`shared/ui`:** `Wheel` reveals one side, any row height; `SheetContent` takes an ⓘ.
- **`pages/score-editor`:** `SignPicker` (replaces `SignPopover`), `PickerGrid`, `KeyPicker`, `ClefPicker`,
  `TimePicker`, `TempoPopover`'s dial, `picker-pictures`.
