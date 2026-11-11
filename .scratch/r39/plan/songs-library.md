# R39-1: the Songs library

## Premium, for this area

It should stand beside **forScore's library** and **Apple Music's Library**, with Mindscape's folders. What makes those
feel finished: (1) the music is the picture: every score has a cover you recognise at a glance; (2) what you are working
on comes first, before any filing; (3) one quiet row shape, with search, sort and filter in one place.

## The rulings as they stand (carried over; feedback-log "Library, adding, publishing" and "Song page")

- "A real library" like Mindscape: built-in and own folders nested to any depth; a real archive in the header; deleting a
  folder deletes its songs; Move at any depth. Swipe actions on rows; drag into folders and onto the Archive.
- Filter by key. No "Chords I know" or "With chords" chips.
- The + adds: New song, Record, Import, New folder. The Public library (Explore) is a place, never an add option.
- Noji's way: search, chips, shelves, the full list; one Export… sheet.
- A collection is a library in the app's library shape (redesign skill, from the Player's Pattern page): search; place
  chips on top; a Sort and filter page with its count on the button, removable chips and Show n; folders with counts;
  Recently used and Favourites first; a heart, not a star.
- Undo, not a question, for a loss that can be undone (R38). Shadows on cards (2026-11-07).
- Card style (R29 B9) stays: a place's rows' look and contents.
- Every page behind the library drawn (canvas 133, from "still not all of the screens have all the functions … you
  missed so many features"): Explore is the title beside My songs and its own place, shelves New, Most saved, Top
  rated with See all; a public song shows who shared it, a five-star rating of your own (stars here are a rating, not a
  favourite) and Report. The Archive icon opens Archive, with the Trash inside it; a folder's gear opens its Settings,
  with Card style one level down. A song's ··· Settings opens its Settings page; the old "Song settings" sheet (Version,
  Hands, Count-in) went, as each has its home in the Player. A song's Sections open a section's page.

## Today (main b98aea88; shots `.scratch/r39/drawings/today-songs-*.png`)

- Phone: My songs · Explore as large tabs, then three round buttons (Select, Archive, ···); Search with the sort's
  button (Manual ⇅) and a Filter button; **Folders** as tall cards (icon, name, count, a preview line of titles, ···);
  the + floats in the middle and covers the last folder's text (`COVERED` in the harness). Nothing of the songs
  themselves shows until a folder is opened; no Continue.
- Laptop: the app's sidebar; a library tree (All songs 92, Favourites, Folders…, Groups, Archive, Trash); a search and a
  Filter button; a table: Title, Key, Chords, Level, Learned, Last played, ···, most cells "–"; the + over the table.
- Files: `src/pages/songs/ui/LibraryScreen.tsx`, `LibraryHeader.tsx`, `LibraryFilters.tsx`, `FilterSheet.tsx`,
  `ContinueShelf.tsx`, `LibraryTree.tsx`, `NewActions.tsx`, `widgets/song-library/ui/SongRow.tsx`, `FolderRow.tsx`.

## Research

- forScore: each menu has search at its top; scores sort by title, newest, rating, difficulty, time or key; setlists
  sort manually, alphabetically or "fresh" (not played in a while) ([forscore.co/?p=1014](https://forscore.co/?p=1014),
  [?p=1016](https://forscore.co/?p=1016), [menu search and filters](https://forscore.co/kb/using-menu-search-and-filters/)).
- MuseScore's app: Library tab › Scores, with Favourites for quick access
  ([help](https://intercom.help/musescore/en/articles/8535960)).
- Flat for Education: folders or list view ([help.flat.io](https://help.flat.io/en/education/resource-library)).
- Noji (`piano-data/reference-apps/new_app_2`): a Continue card first, then My decks; Recently Deleted at the top of the
  library; Edit mode with drag handles; Explore with category chips and shelves with counts and See all.
- Chordify (`reference-apps/chordify`): Discover's "Get right into it" shelf of big pictures, then the lists.
- Lessons from the videos (UX Peak, list and filters): pictures big enough to want; one shape language; chips plus one
  Filter and Sort; counts per option; Show n.

## Will build (canvas)

**Phone** (`/songs`):

1. Bar: **My songs · Explore** (the two places, as today), and at the right **Archive** (the ruling's header archive) and
   **···** (Select, Card style, Trash). Three round buttons become two.
2. **Search songs** with **Sort and filter** beside it, showing its count when anything is on (one button replaces
   Manual ⇅ and Filter).
3. Place chips, one row that scrolls sideways: **All · Favourites · Recently played · Learning · Learned**.
4. **Continue**: a shelf of the last songs played, each a big engraved cover (the first bars), its name, "Bar 9 of 16"
   and a thin progress line. Tap opens the Player where it stopped.
5. **Folders**: compact rows (the folder's tile, name, count, ›), not tall cards; a **New folder** row last.
6. **All songs** (or the place's name), with its count: rows with a small engraved cover, the title, "Composer · Key ·
   Level", the heart. Swipe left: Archive (Undo); swipe right: Favourite.
7. The **+** floats bottom right, above the tab bar, and the list ends with room under it, so it never covers a row.
   It opens **New song · Record · Import · New folder**.
8. Sort and filter is a page with Back: **Sort by** Manual · Name · Recently played · Key · Level; **Level** All ·
   Beginner · Intermediate · Advanced, each with its count; **Key** chips with counts; **Show n songs** and **Reset**.

**Laptop**: the app's sidebar; the library tree (All songs, Favourites, Recently played, Folders with counts, Groups,
Archive, Trash) with **New folder**; the page: the same bar, search and Sort and filter; **Continue** as four big
covers; then the list as a table whose columns are only those that hold something: cover + Title (composer under it),
Key, Level, Progress, Last played, heart. The **+** floats bottom right, as on the phone (one layout logic), clear of
the table's last row.

## Drawn (canvas [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), v4)

- Phone (`Main`) and laptop (`Laptop`), in the Player canvas's frames, both working: place chips or the tree filter the
  list, search narrows it, Sort and filter changes order, level and key with counts and Show n, the heart favourites, the
  ··· and Add menus open, an empty result says why and offers Show all songs.
- Changed from the plan on looking: on the laptop the **+ became an Add button in the bar**, beside ···, because a floating
  - sat on the hearts column (the fault today's phone has over the last folder). The phone keeps the floating +, above
    the tab bar, with the list ending clear of it. The laptop drops the bar's Archive, since the tree holds it.
- Drawings: `.scratch/r39/drawings/songs-*.png`, beside `today-songs-*.png`.

## Canvas 124 (2026-11-11): every row shows its music; one library shape, 44 targets

Owner: "all the pages … all components … fully functional designs"; scan-first: "a picture where a thing is
referenced". The one library shape (Songs, Progressions, Accompaniment, Exercises) changed for all four.

- **A song's row shows its first notes** on a white page (its incipit), in place of a coloured key letter; the key is
  already in "Composer · Key".
- **A folder shows a stack of pages** on its colour, and its line says what it holds ("23 songs · 4 learned"); the
  repeated count on the right goes.
- **Open all / Close all** goes: each section folds by its own heading.
- **Laptop:** Places are quiet rows, only the chosen one tinted; the second list is the folders (a swatch, name, count),
  not a repeat of the table's sections.
- **Targets:** place chips, search, Sort and filter and section headings 44 high; Back sits 12 from the edge.
