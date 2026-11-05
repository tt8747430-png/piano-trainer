# R32-B: the score editor's palette and settings, as Flat does them

## Source

The owner, 2026-11-05: "the editor on the flat doesnt work like that with these menus and such things, make a proper
refactor and implementation. and also the piano in the editor on mobile is hidden and can be shown only from the
settings which is not good. and the same with all other controls, show only the actions relevant at that time like the
write as common in the 5/4 is not relevant and is weird that it is shown but is disabled. and we can at the same time
edit the time signature from the settings and from the palette which is strange. make a proper implementation of the
palette and proper settings refactoring."

Their laptop screenshot: the palette's Time open at the left ("Time signature · The whole song", From this bar |
Whole song, the tiles, Current and Pickup wheels, "Write as common or cut time" greyed, ✗ ✓) and, at the same time, the
gear's Time signature page at the right ("From: The start", the same tiles and wheels).

Research: `editor-research.md` beside this file.

## Today (2026-11-05, `claude/keen-gates-q9bnit`)

- **Bar** (`EditorHeader.tsx`): Close · (title from 40rem) · Done | (Piano keys · MIDI from 40rem) · Play · Undo · Redo
  · ⚙. On a phone held upright Piano keys is only in ⚙ › View (`EditorGear.tsx` › `ViewPage`).
- **Printed signs** (`PrintedEdit.tsx`): the key, time and clef each open their own popover or sheet (`KeyPopover`,
  `TimePopover`, `ClefPopover` in `SignPicker`), the same pickers as the palette's categories: two ways to one thing.
- **The gear** (`EditorGear.tsx`, `ScoreSettingsPages.tsx`, `gear-pages.ts`): View, Transpose, Record a take, Takes;
  Settings › Title and credits, › Music (Staves, Key signature, Time signature, Tempo, Bars), › How the editor works
  (Layout, Note input, Recording); an original's Publish, Versions, Discard. Key, Time and Tempo repeat the score's
  printed signs and the palette; Bars repeats Measures' add and delete; Title repeats the printed title.
- **Palette** (`EditorPalette.tsx`, `palette-categories.ts`, `NoteKeys.tsx`, `MarkKeys.tsx`, `ScoreKeys.tsx`,
  `LineKeys.tsx`, `FieldKey.tsx`, `palette-keys.tsx`): a tool that cannot act is greyed with a tooltip saying why; a
  category whose tools need a note greys its whole grid; a category closed in the chord row is greyed in the strip.
- **Time signature** (`TimePicker.tsx`, `shared/ui/pickers/time-signature-field.tsx`): From this bar · Whole song always
  in the palette, even at the song's head where both mean the same; "Write as common or cut time" greyed for every
  meter but 4/4 and 2/2. **Key** (`KeyPicker.tsx`): "Change the key for the whole song" after the first section.

## Will build

### 1. One home for each thing on the score (Flat's)

| Thing                        | Its one home                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Time signature, key, clef    | the palette's category, on the bar chosen; a tap on the printed sign chooses its bar (its staff for a clef) and opens that category: the panel on a laptop, the palette unfolded on a phone |
| Tempo                        | the printed tempo mark's dial (as today); a change mid-song is Text › Tempo change     |
| Title and credits            | a tap on the printed title (or the credits under it) opens **Title and credits** in the gear's sheet, its first row the title (Flat's credits dialog); the title is no longer typed in place |
| Bars                         | Measures › Add bar after / before, Delete bars                                        |

- **What goes:** `KeyPopover`, `TimePopover`, `ClefPopover`; the gear's Music page and its Key signature, Time signature,
  Tempo and Bars pages; the gear's Title and credits row; the title's in-place field.
- A lesson's example keeps its printed title plain (it has no credits).

### 2. The gear: what the score does not print (Flat's document menu)

Its first page, in order:

1. **View** (Sheet music · …), **Transpose** (the key), **Record a take**, **Takes** (n) — as today.
2. **Settings**, each a row to its page, one line under its name saying what it does:
   - **Instruments** — "Add, remove and order the staves" (n)
   - **Layout** — "Staff size, bars per line, page size" (the summary as today)
   - **Note input** — "Hear notes as you write, palette side"
   - **Recording** — "Metronome, play the melody, count-in"
3. An original's **Publish…**, **Versions**, **Discard changes** — as today.

There is no Music or How the editor works page between: each setting is one tap from the first page. Back from Title and
credits (opened from the title) closes the sheet.

### 3. Only what applies is shown, never greyed

- **A key** that cannot act on what is chosen is not drawn (the tie where no note follows of the same key, Respell with
  nothing to respell, a dot that does not fit, a tuplet that does not fit, the field keys where the field cannot open,
  a line with nothing to draw over, Numeral, Tempo change and the expressions with no note chosen).
- **A category whose tools all need a note** (Pitch, Articulations, Ornaments, Dynamics) says **Choose a note to use
  these tools.** in place of its grid, and in the folded row.
- **The category strip** shows only the categories that act where the caret writes: in the chord row Measures, Key
  signature, Time signature and Barlines & repeats; a category chosen that leaves shows the first that stays.
- **Time:** **From this bar · Whole song** only where they differ (not at the song's head with one meter); **Write as
  common or cut time** only for 4/4 and 2/2 (everywhere the time signature control is, New song too).
- **Key:** **Change the key for the whole song** only after the first section (as today).

### 4. The palette, Flat's, on a phone and a laptop

As R31-E built it (folded row over the category strip with Show every tool; unfolded titled grids; a laptop's panel with
every category in rows), with no popover of its own for a printed sign: the printed sign opens the palette's category.

### 5. Piano keys in the phone's bar (Flat's keyboard button)

- The bar on a phone held upright: Close · Done | **Piano keys** · Play · Undo · Redo · ⚙ (7 buttons, 44px; 40px with no
  gaps under 360px, as today). MIDI stays a laptop's and the gear's.
- The gear's View loses its phone-only Piano keys chip.

### 6. Docs

ADR 0114 (the score's Settings, the palette's greying, the sign pickers), ADR 0115 (the bar), the feedback log's Score
editor.

## Left for the owner (drawn in `../mockups/editor.html`)

1. The title opens Title and credits (A, Flat's, recommended) or stays typed in place with credits from the gear (B).
