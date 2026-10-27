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
6. **Common time** is the song's (`commonTime: true` on the piece, its music, the chart, the Performance, the
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

- **`shared/lib/notation`, `arrangement`, `entities/piece`, `widgets/score-sheet`:** `commonTime`; the line's
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
