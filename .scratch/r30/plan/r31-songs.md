# R31-S: Songs, finished

## Source

The owner, 2026-11-05 (`songs-player-editor-brief.md` › Songs):
- every menu and popup reviewed so it makes sense;
- the settings reviewed for duplicate actions, and their UI refactored across Songs;
- "I don't see which song has no folder, or other filters";
- the My songs / Explore switch leaves half its row empty;
- the card style editor reviewed: its cards hang over the controls when scrolling;
- ✎ always opens the score editor, and the song page's editor moves into Settings ("Edit song page");
- the song page's settings get a professional structure.

The owner's shots 1, 2, 4 and 6 (`owner-shots-compared.md`).

## Today

- `ScreenHeader`'s `switcher` (`Segmented compact`) is used by Songs (My songs · Explore, `SongsSwitch.tsx`) and Learn
  (Lessons · Courses). It sits under the bar on a phone and fills a third of the row.
- `FilterSheet.tsx` has Key, Level and Favourites only (`SongsFilter`: q, stage, key, favourites). The tree
  (`LibraryTree.tsx`) has All songs, Favourites, folders and Archive.
- `widgets/style-editor/StyleEditor.tsx` (used by Card style and a lesson block's style):
  - a sticky preview (`sticky top-[bar+0.5rem]`) covers the controls as they scroll;
  - presets are tiles that wrap (Night alone on a second row);
  - corners are a five-word `Segmented` that overflows;
  - border and shadow are `Stepper`s;
  - colours are swatch rows; padding and layout are `ChoiceCard`s.

  `CardStylePage.tsx` adds Shows (switches), Density, Apply to, Reset and Apply.
- `PieceView.tsx`: ✎ edits the song page in place (`?edit=true`). `SongSettingsPage.tsx`:
  - the song's title, then Library: Duplicate, Folder, Archive;
  - Share: Publish (its status wraps), Share link, Export (whose sheet repeats Share link);
  - Reset progress, alone, with its line outside the card;
  - a danger group (Delete or Reset to original).
- The song row's ⋯ (`row-actions.ts`): Favourite, Move to…, Archive, Export…, Delete. A folder's ⋯: Edit, Move to…,
  Archive, Delete.

## Will build

### 1. The view switch, everywhere it occurs (Songs, Learn)

The switch moves into the bar as **title tabs**. On a phone the bar's title is the two views side by side: "My songs"
and "Explore", the current one in ink and the other in soft ink, each a large-title-sized tab (`role="tab"`, 44px
tall). On a laptop they sit in the same place, beside the title's spot. There's no separate "Songs" word, because the
tab bar and sidebar already say where you are. Learn becomes "Lessons" and "Courses" the same way.
`ScreenHeader`'s `switcher` renders it; `Segmented compact` is no longer used for views.

### 2. Filters: what has no folder, and more

The Filter sheet groups, in order:
- **Folder:** Any · Not in a folder (`folder: 'any' | 'none'`);
- **Progress:** Any · Learned · Not learned yet (`learned: 'any' | 'yes' | 'no'`);
- **Level:** Any, Beginner … Professional;
- **Key:** Any key, then each key with its count;
- **Favourites only** (a switch).

Changed filters show as removable chips under the search ("Not in a folder ✕"). On a laptop the tree gains
**Not in a folder** with its count, under Favourites. The URL carries `folder` and `learned`.

### 3. Card style editor (`widgets/style-editor`, both users)

- **Phone:** the preview is a fixed pane at the top of the page, two cards tall, with its own frame. The controls
  scroll in their own region beneath it, so nothing hangs over them.
- **Laptop:** two columns, the preview on the left (sticky in its own column) and the controls on the right.
- The controls in order:
  - **Style:** presets as one row of equal tiles that scrolls sideways (Plain, Soft, Bold, Paper, Night, Custom).
  - **Corners:** five icon segments drawn as corner shapes, each named by its aria-label.
  - **Border:** None · Thin · Thick.
  - **Shadow:** None · Low · High.
  - **Fill** and **Text colour:** swatches.
  - **Spacing:** Compact · Normal · Roomy.
  - **Layout:** List · Cards, each with a picture.
- Card style adds **On each card** (switches) and **Apply to** (radio). Reset and Apply sit in a docked footer.
- Steppers for these three-step choices go.

### 4. The song page and its Settings

- ✎ beside the title opens **the score editor** (`/edit/$pieceId`) for every song that has a score. A listing (no
  score) has no ✎.
- The song page's own edit (cover, details, about, tags) is reached from Settings › **Edit song page**, which opens
  the page in Edit (`?edit=true`) with Done in the bar.
- The Settings page, in groups:
  1. The song: its cover, title and composer as the group's head; **Edit song page ›**; **Edit score ›**.
  2. **Library:** Folder (value ›); Favourite (switch); Duplicate; Archive (or Restore).
  3. **Share:** Publish (value: Published, Changed or Not published, one line ›); Share link; Export… (MusicXML, .mxl,
     MIDI only; Share link leaves the Export sheet).
  4. **Progress:** Reset progress, with its line under it in the group.
  5. Danger: Delete song, or Reset to original, asked first.

### 5. Menus and popups

- **A song's ⋯:**
  - Play; Edit score; Settings;
  - Favourite; Move to folder…; Duplicate;
  - Share link; Export…;
  - Archive; Delete (own songs).

  The swipe and the laptop table use the same list.
- **A folder's ⋯:**
  - Open; Rename and look (Edit); Card style;
  - Share with a group;
  - Move to…;
  - Archive; Delete.
- **New (+):** New song, Record, Import, New folder, New group, unchanged in order. Every menu shows its groups with
  separators.
- **The sheet backdrop:** it covers the whole screen behind every sheet, with no band left sharp (owner's shot 3; a
  `Sheet` fault, so it is fixed in `shared/ui/Sheet`).

## What goes

- The `Segmented compact` view switch.
- The style editor's sticky preview and its steppers.
- The song page's ✎ in-place edit.
- Share link inside the Export sheet.
- Reset progress outside a group.

## Left for the owner (drawn)

1. The view switch: A, title tabs (recommended); B, a full-width two-part switch under the bar.
