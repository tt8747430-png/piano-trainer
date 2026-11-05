# R32-B research: the palette and the settings, as Flat, MuseScore 4 and Dorico for iPad do them

Asked by the owner on 2026-11-05: "the editor on the flat doesnt work like that with these menus … the piano in the
editor on mobile is hidden and can be shown only from the settings … show only the actions relevant at that time …
we can at the same time edit the time signature from the settings and from the palette which is strange."

Sources: Flat's help centre (pages below, read 2026-11-05), the owner's own Flat screenshots
(`piano-data/reference-apps/flat-score-editor/01-…` to `05-…`), MuseScore 4's handbook (Palettes, Properties panel,
Project properties) and Dorico for iPad's manual (toolboxes, panels, Properties panel, Project Info).

## Flat

### Where each thing of the score is set

| Thing             | Flat's one way in                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Time signature    | Tap the time signature printed on the score, or the palette's **Time signature** section for the bar the cursor is in or the bars selected. "If you don't select a range, the new time signature will apply until the next time signature or the end of the score. If you only want to change it for certain measures, select those measures first." Customize gives any meter, the pickup and "a common time symbol instead of 4/4 and a cut time symbol instead of 2/2". On mobile: "tap a measure, drag the tool palette up, pick a meter under Time signature"; the pickup by sliding its numbers, then ✓. (help.flat.io/en/music-notation-software/timesig) |
| Key signature     | Tap the key printed (a grey placeholder where the score has none) or the palette's Key section; from the measure on. (…/tutorial-key-time-signature) |
| Clef              | Tap the clef printed, or the palette's Clef section, on the measure.                                  |
| Tempo             | The tempo mark printed over the first bar (♩ = 80 in shot 01), tapped; a tempo change is a Text tool. |
| Title and credits | "Click on the title of your score to access the credits": Title, Subtitle, Lyricist, Composer, Arranger, licence, in one dialog. (…/credits) |
| Instruments       | The document menu (≡) › Instruments, a sheet (shot 04).                                               |
| Layout            | The document menu's Layout: Staves (staff size, spacing), Pages (size, margins), measures per system. (…/layout-staves, …/layout-page) |
| Playback          | The speaker in the bar opens Playback options: Audio playback, Metronome, Playback speed (shot 05).   |

**None of the score's signs has a second home in a settings page.** The document menu holds only what the score does
not print: instruments, layout, playback, sharing, export, history.

### The palette (shots 01–03)

- Phone: a bottom sheet with a grabber. **Folded**, one row of the chosen tab's tools over a **strip of tab icons**
  (Note, Pitch, Articulation, Ornament, Dynamics, Measure, Clef, Key, Time…) and an expand button. **Unfolded**, the
  tab's tools in titled sections (Notation; Pitch and Representation) as a table of equal cells.
- Laptop: the same tabs as a left panel; the tool for a printed sign is the same section the sign opens.
- Every tool is a direct key. The tuplet and pickup are the only places a key opens more choice.
- Flat **greys** what does not apply (the tie and Respell in shot 02). The owner overrules this: hidden, not greyed.
- **The piano keys:** a keyboard icon in the bar (shot 03: the piano-and-note button lit), shown by default on touch
  screens and hidden with one tap; the score shrinks over it. Never only in a settings page.

## MuseScore 4

- **Palettes** apply to the selection; a time signature dropped on a bar changes it from there to the next change.
- **The Properties panel is context-sensitive:** it shows only the sections for what is selected (a note: Note, Beam,
  Stem…; a time signature: its appearance, where **common or cut appear only for 4/4 and 2/2**). Nothing unrelated is
  shown greyed.
- **Project properties** (title, composer…) are metadata; the title frame on the score is edited in place. Format ›
  Style holds layout (staff size, measures per system). The two never repeat each other.

## Dorico for iPad

- **Notes toolbox** at the left and **Notations toolbox** at the right; the Notations toolbox opens a panel per
  family (Key signatures, Time signatures, Clefs, Tempo…). The time signatures panel has the meter, a pick-up bar and
  the C / ¢ buttons together, applied at the caret or selection.
- **The Properties panel** at the foot shows the properties of what is selected alone.
- **Project Info** holds the title and credits; **Layout Options** the staff size and systems; **Playback options**
  playback. The key, time and clef are never a setting.

## What this asks of us

1. **One home each.** The time signature, key and clef: the printed sign and the palette's category are one place —
   a tap on the printed sign chooses its bar and opens the palette at that category (Flat). The tempo: the printed
   tempo mark's dial. The title and credits: a tap on the printed title opens Title and credits (Flat's credits
   dialog). The gear loses Music (Key signature, Time signature, Tempo, Bars) and Title and credits.
2. **The gear holds what the score does not print** (Flat's document menu): Instruments, Layout, Note input,
   Recording — plain names, ordered by how often a learner needs them, each with a one-line detail.
3. **Only what applies is shown** (MuseScore's Properties panel, the owner's ruling): a tool that cannot act on what is
   chosen is not drawn; "Write as common or cut time" only for 4/4 and 2/2; "From this bar · Whole song" only where they
   differ; a category whose tools need a note says "Choose a note" in place of a greyed grid; a category that cannot
   act in the chord row leaves the strip there.
4. **No menus where Flat has keys.** The printed signs no longer open a popover of their own beside the palette's.
5. **Piano keys in the phone's bar** (Flat's keyboard button), as on the laptop.
