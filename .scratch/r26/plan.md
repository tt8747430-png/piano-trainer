# Round 26 plan: pages, menus and editors

The owner's feedback, 27 screenshots (2026-11-01). Research: memory-palaces' deck detail and deck settings pages
and its menus (`FlyoutMenu` on Base UI's Menu), the reference apps in `piano-data/reference-apps` (new-app's
settings, Flat's editor on a phone, the course apps), and the platform rules for menus, sheets and pages.

## 1. The rule: menu, sheet or page

| What it is | Where it goes | Examples |
|---|---|---|
| A command that acts at once (with Undo, or a confirm if it destroys) | **a menu item** in the thing's ⋯ menu | Favourite, Archive, Duplicate, Delete, Print |
| One focused task: a few inputs and a Done/Create | **a sheet** | New song, Move to…, Export…, Rename & appearance, Filters |
| One value out of several | **a pop-up button** (shows the value, ⌃⌄) in place, or a segmented control when 2–4 fit | View, Key, Sort, Language |
| Content, or settings in more than one group | **a page** (pushed, Back to return) | A song, its Settings, a lesson, Settings › Keyboard |
| A switch | **a row with a switch**, never a menu item | Metronome, Ask each time |

Consequences:
- A ⋯ menu holds commands only, 7 at most, grouped, the destructive one last and red. No settings in it.
- Everything a thing can be set to lives on its **Settings page** (a gear in its bar), as memory-palaces' deck:
  grouped rows, a value at the row's end, a row opening a sheet or a subpage.
- A pop-up shows its current value in words, never an icon alone.

## 2. Real menus and dropdown buttons

- Add shadcn's `dropdown-menu` (Base UI Menu) with the CLI. `ActionMenu` becomes a real menu, ported from
  memory-palaces' `FlyoutMenu`:
  - `role="menu"` and menu items, arrow keys and typeahead;
  - group labels, separators, checked and radio items, a destructive variant.
  It is one component used by every ⋯ menu (song row, folder, song page, Player, lesson editor, takes, archive).
- `Dropdown` (the select) stays the pop-up button, and always shows its value in words.
- **Read · Edit and Practise · Edit stop being pop-ups.** They become the iOS pattern: an **Edit** button in the
  bar; in Edit, **Done** returns. For an editor, a song's original is edited from its Settings page
  (Edit the original), not from a third mode.

## 3. Songs: one kind, a real page, a Settings page

- **One New song.** "New built-in song" goes. New song in a collection's folder, for an editor, makes the
  collection's song; everywhere else, the learner's own. The sheet is the same.
- **The song page** (deck detail's shape):
  - **Bar:** Back, the title, Settings (gear), ⋯ (commands: Favourite, Move to…, Export…, Share, Archive).
  - **Body:**
    - the overview card: key, time, tempo, difficulty, Learned, and Practise as its main button;
    - the ways to practise: Player views, Learn by sections;
    - the content: sections, chords, progressions.
- **The song's Settings page** (`/songs/$id/settings`, deck settings' shape), grouped rows:
  - *Song:* Title & subtitle, Credits, Key · Time · Tempo (each a row that opens its picker), Staves.
  - *Practice:* Default view, Pattern, Count-in.
  - *Library:* Folder (Move to…), Favourite (switch), Export…, Share link.
  - *Public library:* Publish / Update / Unpublish with the description and the preview. This is the
    publish sheet, reached from here only.
  - *For editors* (a built-in song): Edit the original, Versions, Discard draft; the draft's status and Publish
    stand on this page, never over the score.
  - *Danger:* Archive, Delete (own) / Reset to the original (a changed built-in).
- The score editor's bar then holds no draft or publish controls.

## 4. The score editor and the Player: every setting in one place

Flat on a phone:
- **Header:** Back, playback, view, and one ≡ menu.
- **Second row:** the editing actions.
- **Foot:** the palette as a sheet, its tabs at the bottom.
- **Score-wide options:** sheets of rows.

Ours:
- **The bar:**
  - Close, the song's title, then Edit/Done.
  - In Edit, Undo and Redo.
  - ⋯ with Song settings (the page), Sections, Print, Export….
- **The tools row:**
  - What is shown: View (pop-up), Transpose, Simplify (Practise only).
  - In Edit, the editing modes join it.
- **The transport:**
  - Playback only: tempo, back and forward, play, loop.
  - **one Playback button** opening one sheet: Metronome, Count-in, Volume, Play melody, Hands. It replaces
    the editor's sliders popover and the Player's sound and hands buttons.
  - Record and Takes stay in Edit.
- **The palette:** unchanged in place (the foot sheet); its Editing mode is a pop-up showing the mode's name.
- Nothing else anywhere: no settings in the header, no settings in menus.

## 5. Lessons: one page

- A lesson reads as **one page with its sections** by default (the paged phone view goes). A reading setting
  (Settings › Lessons and the lesson's ⋯): One page / A section at a time, and the text size.
- The lesson's bar: Back, the title, the progress, ⋯ (Mark as learned, Reading: one page / sections, Text size),
  and Edit for an editor.
- Course page: the Continue button stops covering the last row (bottom padding equal to the floating action's
  room, the rule every page with a floating action keeps).

## 6. The lesson editor: a real embedded score editor

- An example's music is edited with the score editor itself, embedded in the lesson. Tap the example, then Edit
  music, and it opens as a full-height sheet over the lesson:
  - the example's staff or grand staff;
  - the palette and the keys;
  - Done, which writes the notes line back.
  The text field (`E4 D4 C4/2`) stays under the ⓘ "Edit as text" for whoever prefers it.
- The example's other settings (clef, key, time, hand, name) are its properties row, in the same sheet.
- The formatting toolbar:
  - With no keyboard: a floating capsule at the foot (as now).
  - **With the phone's keyboard up:** a bar flush on the keyboard's top edge, placed from `visualViewport`
    (its top plus its height, less the bar's height), never at a fixed bottom in the layout viewport. That is
    why it hangs mid-page now.
  - While a field inside a sheet has the focus, the toolbar hides.

## 7. Fields and the keyboard

- No field lifts itself. A page's fields are scrolled into view by the browser (`scroll-padding-bottom` from
  the keyboard's height, as now). Only a bar attached to the keyboard (the lesson toolbar, the score editor's
  text input) rides on it.
- Sheets keep Base UI's keyboard inset. The Admin forms are normal page fields.

## 8. Smaller fixes from the screenshots

- **New song sheet:** the "Title" label is cut by the sheet's header; the scroll area's top padding.
- **Filters:** keys read C♯ minor (the printed accidental), not C#.
- **Admin's tabs:** cut at both edges; the scroll fade and padding. The Groups and Switches forms get the
  page's padding and rows.
- **Segmented "Whole pi-ano":** no hyphenation in controls (`hyphens: manual`).
- **Course page:** the floating Continue covers the last lesson (§5).
- **Manage lessons:** a dragged row and its handle stay inside the card; handles in the card's gutter.
- **Lesson editor:**
  - a link block shows its field and its card twice: one card, its text edited in place;
  - an example's staff starts mid-bar: it shows from its first bar.
- **Days practised:** it goes from the Profile, as the owner asked in round 24; the Profile keeps
  Days in a row and Songs played.
- **Padding audit:** every control's padding against DESIGN.md's tokens (bars, pills, rows, sheets),
  screenshots at 390/320/844×390/1280.

## Order of work (each phase committed and checked, then screenshots)

1. **Menus:** `dropdown-menu`, `ActionMenu` on it, every ⋯ menu checked against §1 (commands only).
2. **Edit and Done** in place of the Read · Edit and Practise · Edit pop-ups.
3. **Songs:** one New song; the song page; the song's Settings page; publishing, export and the original's
   draft moved there.
4. **The score editor and the Player:** the bar, the tools row, the transport, one Playback sheet.
5. **Lessons:** one page, reading settings, the course page's padding.
6. **The lesson editor:**
   - the toolbar on the keyboard;
   - the embedded score editor for examples;
   - the link block fixed;
   - examples from bar 1.
7. **Keyboard and fields** (§7) and the smaller fixes (§8).
8. **Gate:**
   - the full suite and the build;
   - screenshots at every size, in both themes, as a learner and as an editor;
   - docs: ADRs, CLAUDE.md, DESIGN.md (the §1 rule in DESIGN.md);
   - push.

## Open: the owner's call

- None blocking. Interpretations taken:
  - "Customise the song page" means its Settings page and the reading/view choices.
  - "Customise the lesson page" means the reading settings (one page or sections, text size).
