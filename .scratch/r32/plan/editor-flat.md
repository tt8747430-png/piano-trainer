# R32-C research: Flat's palette, category by category

Asked by the owner on 2026-11-05, after R32-B: "but this menu in the palette doesn't follow how the flat editor does
this, you should make it as close as possible as the flat editor and its ui and its management and features."

## Sources

Help centre (read 2026-11-05):

- Time signature: https://help.flat.io/en/music-notation-software/timesig
- Key signature: https://help.flat.io/en/music-notation-software/keysig
- Clef: https://help.flat.io/en/music-notation-software/clef
- Tempo marks: https://help.flat.io/en/music-notation-software/addtempo/
- Add or remove measures: https://help.flat.io/en/music-notation-software/addmeasure
- Tuplets: https://help.flat.io/en/music-notation-software/tuplet
- Set time and key signatures: https://help.flat.io/en/music-notation-software/tutorial-key-time-signature/
- The interface: https://help.flat.io/en/music-notation-software/discover-the-interface/
- Credits: https://help.flat.io/en/music-notation-software/credits
- Staff size and spacing: https://help.flat.io/en/music-notation-software/layout-staves

Blog:

- The new mobile editor: https://blog.flat.io/amplifying-creativity-on-the-go/
- The web mobile editor (July 2024): https://blog.flat.io/flat-for-education-updates-july2024-web-mobile-editor/
- A tempo: https://blog.flat.io/a-tempo-marking-return-to-previous-tempo/

Screenshots: the owner's own captures of Flat's iOS app and web editor in
`piano-data/reference-apps/flat-score-editor/`:

- `01`–`05`: the folded palette, the unfolded palette, the keyboard input, the instruments sheet, the playback sheet.
- `IMG_4449`–`IMG_4523`: every palette section, the list view, the chord and Roman-numeral sheets, and new-score
  setup.
- `Screenshot 2026-10-23 at 16.5x`: the web editor's left panel, its sections and Document settings.

## The palette as a whole

| | Phone (iOS app) | Web (laptop) |
| --- | --- | --- |
| Where | A sheet at the foot with a grabber (shot 01). | The left panel; its tabs are **Notation**, **Instruments** and **Layout**, then a keyboard icon and «. |
| Folded | One row of the chosen tab's tools over a **strip of tab icons**. The strip holds Note, Pitch, Articulation, Ornament, Dynamics, Measure, Clef, Key, Time, Barlines, Text. At the strip's end are the **list/grid toggle** (≡ / ⊞) and the **expand** button (shots 01, 4480). | — |
| Unfolded | **Every section in one continuous scroll**, each a titled table of equal bordered cells: Notation, Pitch and Representation, Articulations, Ornament, Dynamics, Measure, Clef, Key signature, Time signature, Barlines and repeats, Text. The strip stays under it, and the tab of the section in view is lit; a tab tapped scrolls to its section (shots 02, 4449–4458). | **Every section stacked in one scroll**, each titled with a ⌃ chevron that folds it; several can be open at once. There is no tab strip inside Notation (16.53.58–16.54.15). |
| List view | ≡ turns the cells into two columns of bordered rows, each an icon and its name: "Insert Measure Before", "Remove Measure", "Double Barline", "Repeat X times"… (shots 4470–4489). | Tooltips name each cell: "Set A Major/F# Minor key signature (3#)", "Set clef F4 (15ma)". |
| Not applicable | Greyed (shot 02's tie and respell). The owner overrules this: hidden. | Greyed. |

## Each section

| Section | Flat | Applies to |
| --- | --- | --- |
| **Time signature** | One row of tiles **2/4 · 3/4 · 4/4 · C · ¢ · 6/8** (common and cut time are tiles of their own), then **Customize**: a wide button with a pencil on the phone (4457), a pencil cell at the row's end on the web (16.54.12). Customize gives any meter and the pickup: "slide the **Pickup** numbers to the desired length, and tap ✓" on mobile. New score shows "4 / 4" fields under the tiles (4523). | The measure at the cursor until the next time signature; a selected range alone. A tap on the printed signature opens the same section. |
| **Key signature** | A table of signatures with no names in the cells: 1–7 sharps over 1–7 flats. The phone puts the natural sign first in the sharps row (4456). The web adds the link "**Switch to natural**" under the table and the switch "Change the key for all the parts" (16.54.12). The tooltip is "Set A Major/F# Minor key signature (3#)". There is no Major · Minor choice; transposing moves notes, a key change does not. | From the measure until the next key; a selected range alone. |
| **Clef** | A table, a family a row: G clefs (treble, 8va, 8vb, 15ma, 15mb), C clefs (soprano to baritone), F clefs (bass and its octaves, baritone, sub-bass) (4453, 16.54.04). There is no scope choice. | "With no selection the new clef will be applied until the next clef or the end of the score"; a selected range alone. |
| **Tempo** | **Tempo** is a tool in the Measure section (4480: "Tempo", "A tempo", "Accelerando", "Ritardando"). The web opens a popover with BPM, the beat unit, and an audio button that shows the tempo words and previews them. The phone opens a full-screen dial: hold and swipe, the Italian marking shown, ✓ / ✕. | The measure selected. |
| **Measure** | Insert Measure Before, Insert Measure After, Remove Measure, System break, Page break, Add multimeasure rest, 1-Measure Repeat, 2-Measure Repeat, Accelerando, Ritardando, A tempo, Tempo, Swing Eighths, Swing Sixteenths, rehearsal marks (4480). | The measure at the cursor or the range. |
| **Barlines and repeats** | Double Barline, Left Repeat, Right Repeat, Repeat X times, Slash and Rhythmic notation, Segno, Coda, Fine, D.S., D.C., To Coda, 1st–4th endings (4457, 4484). | The measure. |
| **Notation** | Add note, whole to 64th, dot, double dot, tie, tuplet ⌐3⌝, natural, sharp, flat, respell (02). | The selection or the next note. |
| **Text** | Lyrics, Chord, Roman numerals, Figured bass, Annotation (4488). | The note at the cursor. |

## What R32-B got wrong against this

1. **One category at a time.** Flat shows every section in one scroll (phone unfolded, web panel); the tab strip
   jumps within it.
2. **Time signature as a form.** We drew the tiles, Current and Pickup wheels, a symbol switch, From this bar · Whole
   song and ✗ ✓ all inline. Flat has one row of tiles (C and ¢ among them) and Customize, which opens the wheels with
   ✓.
3. **Key signature.** Ours has Major · Minor, names in the cells, natural as a cell, a "whole song" switch and a "from
   section" line. Flat has the bare signatures, 7♯ over 7♭, and Switch to natural.
4. **Clef.** Ours asks This bar · Until the end · Entire staff. Flat has no question: a range selected, else to the
   next clef.
5. **Tempo** belongs in Measure as Flat's Tempo tool, with the tempo words (accel., rit., a tempo).
6. **List view** is missing: Flat's ≡ shows every tool by name.
7. **Panel sections** cannot be folded; Flat's fold with ⌃.

## Kept, and why

- **Hidden, not greyed:** the owner's standing rule overrides Flat's greying.
- **Section-based key and meter:** a time or key signature chosen applies from the start of the caret's section, our
  model's unit; Flat's measure-level change is the same at a section's first bar.
- **Tuplets ⌄** stays as the one tuplet key with its tuplets, as in Flat's help ("open the tuplet tool … and choose
  the tuplet you want").
