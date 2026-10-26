# ADR 0106 — One library of songs: folders, the learner's and the app's, and an archive

- **Status:** accepted · **Date:** 2026-10-26 (second round the same day, below) · **Supersedes:** ADR 0103 ·
  **Amends:** ADR 0099 (the Player's More), ADR 0100 (the song's page's bar; in the second round, the page) ·
  **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §6

## Context

ADR 0103 laid the learner's library over Songs as tabs: All, Favourites, Setlists, then a tab for each collection.
A setlist had a page of its own and a song could be in many. The owner found this was not one library. They asked
for the songs as one library, as the memory-palaces repository (the owner's Mindscape) keeps its decks:

- the built-in songs already in a folder each;
- folders of the learner's own;
- songs moved between them;
- what the learner removes kept, and restored (from Settings, they first said; they then put the archive's way in
  Songs' own bar, as Mindscape's is).

Mindscape's library is a Home of folders and the decks that stand on their own, each folder a page of its decks.
A folder has a name, a picture and a colour. A deck is moved to a folder by a sheet of the places it can go, acted on
by a swipe or from its menu, chosen with others for one action, and arranged by an order. Its archive is a place
(its ADR 0003): what is archived leaves the library whole and comes back by Restore, or by the Undo in the toast that
said it went.

## Decision

- **Songs is one library.**
  - **Its Home** (`/songs`): the folders, then the songs that stand at Home.
  - **A folder:** a page of its songs (`/songs/folders/$folderId`), not found where the library has none of that id or
    it is archived.
  - **A song stands in one place:** Home or a folder; or it is in the archive.
- **The built-in collections are folders from the start**, in catalog order, each with its own picture and colour,
  its songs in catalog order. A built-in folder is renamed, restyled, moved and archived like the learner's own;
  its name is said in either language until the learner renames it.
- **The learner's own:**
  - **Folders** (`folder-<n>`, never given twice): a name, a picture of music and one of the theme's paints, in one
    sheet for New folder and Edit folder (a new one's name suggested: "New folder", "New folder 2").
  - **Songs:** made where the learner is, in the folder open or at Home.
- **The actions, at every size:**
  - **A song's row:** its More (⋯) holds Favourite, Move to…, Archive, and Delete (the learner's own song alone, asked
    first). A swipe does the same on a touch screen: to the right Favourite; to the left Move, then Archive at the
    edge. A long press starts Select with it chosen.
  - **A folder's row:** its tile (its picture on its paint), its name, its songs counted. Its More holds Edit folder,
    Archive folder and Delete folder; a swipe to the right Edit, to the left Archive.
  - **A folder's page:** Back, its name as the title, Select, the Archive button and More: Edit folder, New song here,
    Archive folder, Delete folder.
  - **The song's page and the Player's More:** the ♡, Move to… and Archive (Restore while it is archived). A study, on
    Practice, is in no library: none of them.
  - **Select** (the bar's Select, or a long press on a row): a check on each row, the count as the bar's title,
    Select all, Done, and a bar at the foot of Favourite · Move · Archive, and Delete where everything chosen can be
    deleted (the learner's own songs, and folders). Its slots stay put; one that cannot act on the choice is greyed.
    In the Manual sort with nothing hidden, each row has a handle that moves it, folders among folders and songs among
    songs, by a finger, a mouse or the keyboard, a screen reader told where it went.
- **Move to…** (Mindscape's `DestinationSheet`): Home, then every folder on its tile; the place the songs all stand
  in greyed; one chosen, the button says where ("Move to Hymns"); New folder at its foot makes a folder and moves them
  into it.
- **Every move, archive and favourite says so in a toast**, its Undo putting it back exactly where it stood (a
  `say` over Base UI's toast, the shadcn primitive): announced politely, gone in five seconds, standing over the
  screen's foot clear of the tab bar, the keys docked there and the floating actions.
- **Deleting a folder deletes its songs** (the owner's rule); the app's content is never destroyed:
  - **what the learner made** (their folder, their own songs in it with their takes) goes for good;
  - **what the app brought** goes to the archive: a built-in folder whole, with the app's songs in it; the app's songs
    in a learner's folder each on its own, Restore putting each in its collection's folder (at Home where that folder
    is not in the library).
  - The ask names the folder, counts its songs and says which happens.
- **Favourites is a filter**, beside Level, With chords and Chords I know.
- **The sort:** Manual, Name or Recently played (as Learn's songs played last; a song never played after them, as
  dragged), a pop-up beside the filters showing the sort chosen, kept in the library. Name sorts the folders too.
- **The search and filters** (in the URL, never remembered):
  - **At Home** they look through the whole library: the songs that match under their folders' names (Home's last),
    and the folders whose names match the search.
  - **In a folder** they narrow its songs.
  - **While they hide songs**, a line says how many are shown of how many, with Clear filters.
- **Empty states:** an empty folder offers New song and Move songs here (a sheet of every other song, each a check);
  an empty Home offers New song; filters that keep nothing say what found nothing, with Clear filters.
- **The archive is a place** (Mindscape's ADR 0003).
  - **Archiving** takes a song, or a folder with its songs, out of the library. An archived song still opens, by its
    link, from Learn and from Search, whose row says it is archived.
  - **Restore** puts a song back where it stood while that folder is in the library, else at Home, last; a folder
    back at Home, last, with its songs. The toast's Undo puts either back exactly where it was.
  - **Its way in** is the Archive button in Songs' bar, at Home and on a folder's page, at every size, named Archive
    with its tooltip, a small count on it while the archive holds anything (Mindscape's header).
  - **Its page** (`/songs/archive`): Back and Restore all in its bar; folders (tile, name, songs counted) and songs,
    the newest first, each with Restore; More's Delete, asked first, for the learner's own song or folder (a folder's
    app songs stay in the archive, each on its own); empty, a line on what it is for.
- **Saved:** `pt-library` holds only what the learner changed, read over the catalog, writing nothing as it reads:
  - a built-in folder the store does not hold (a collection added later) stands after the others;
  - a built-in song the store places nowhere stands last in its collection's folder, and in the archive with it while
    that folder is;
  - an own song placed nowhere stands at Home; a song the repertoire no longer has is left out.
- **Setlists go,** and Songs' tabs with them. A folder is the learner's list of songs in their order. A folder played
  song after song is a later round's.

### From the libraries studied

Mindscape, Apple Files, Notes and Music, Google Drive, forScore and MuseScore (the round's research):

- the bar's title says where the learner is;
- each folder shows its count;
- the Move sheet offers New folder;
- Select shows its count and offers Select all;
- every move and archive toasts with Undo;
- what is removed goes to a place it comes back from, a folder with its contents;
- the sort is in sight beside the list;
- an empty folder offers to make a song and to move songs in;
- every action is on the keyboard (rows, More, Move, the handles);
- a folder left and opened again keeps its scroll (the router's own restoration);
- a swipe and a long press are shortcuts to what the row's More holds.

Not taken: a sort for each folder (Files), a 30-day expiry (the app's songs never vanish), tags. (Nested folders,
first left out, came in the second round.)

### Second round: nesting, one search with its filters, Move at a tap, the phone's keyboard

The owner, from their phone: the Move sheet clipped the song's name, asked twice (a disabled "Choose where"), only
greyed the folder it stood in and painted Home as Called to Play; With chords and Chords I know were not wanted, a
Key filter was; the header should be one search with its sort, a filter button and chips (their examples); the
folder's bar was four round buttons over a huge title; rows jumped as Select started; a song's detail wrapped with
"· 16 chords" alone; toasts stayed or stacked; sheets with a field lifted the whole app over the keyboard; folders
should nest, as Mindscape's decks do.

- **Folders nest, to any depth** (Mindscape's `deck-tree`): a folder says the one it stands in (`parent`, Home
  `null`); the folders of one place stand in the order the store lists them. `entities/library`'s `tree.ts` holds the
  rules: `childFolders`, `subtreeIds`, `folderPath`, `canMoveFolder` (never into itself or a folder under it),
  `withoutDescendants` (a folder chosen under another moves with it), `reachableFolders` (a folder whose place is
  gone, archived or a loop stands at Home, read, never written).
  - **A folder's page:** its folders first, then its songs; Back goes up a level, named for where ("Back to Hymns").
    Its bar is Back, its name, Select and More (Edit folder, New song here, Move to…, Archive folder, Delete
    folder); the Archive button stands in Home's bar alone.
  - **A folder's row** counts its folders and songs ("1 folder · 4 songs", "Empty") and names its first three songs
    under them (Files' and Music's), hidden from a screen reader.
  - **New**, at Home and in a folder alike, is a dial of New song and New folder, each made where the learner is.
  - **Archive, delete and restore follow the subtree**: archiving a folder takes every folder under it into its one
    archive entry (`subfolders`); Restore puts it back in the folder it stood in while that is in the library, else at
    Home, last; the toast's Undo exactly where it stood. Deleting a folder deletes every folder under it, each by
    the first round's rule (the learner's go for good, a built-in one to the archive whole, at Home on its Restore).
- **Move to… moves at a tap** (Mindscape's `DestinationTree`): what moves on its own line under the title, whole
  (its body's rows keep their height, which had squeezed it); Home on a tile of its own (the muted neutral, no
  folder's paint), then the folders as they nest, a folder holding folders opening and closing by the toggle at its
  row's end; the place everything stands in marked **Here** (a check and the word); a folder moving greyed, saying
  why. A folder is moved as a song is, from its More, its swipe and Select (`moveTo` over songs and folders, its Undo
  `undoMove`).
- **The search and filters** (the owner's examples):
  - one search box, the **sort** joined to its end as a compact pop-up of a word or two (Manual · Name · Recent ·
    **Key**, the last new: by key, majors from C up, then minors, then by title);
  - beside it the **Filter** button, its count on it while filters are on, opening a sheet (a popover by it on a
    laptop) of folding groups: **Key** (each key the songs here are written in, as the app names keys, with how
    many), **Level**, **Favourites** (a switch); Clear filters and "Show N songs" at its foot, each change taken at
    once;
  - each filter on as a chip under the search ("Key: G major ×"), in a row that scrolls sideways;
  - **With chords and Chords I know go**, with `known`, `withChords`, `KnownChordsFilter`, `known-chords.ts`,
    `readChordList` and `chordListParam`;
  - filters that keep nothing say which, by the one filter's own words or "these filters".
  - At Home or in a folder they look through all the place holds, its folders' folders too, the songs found under
    their folders' paths from it ("Hymns › Advent").
- **Rows:** in Select the check stands where the row's More stood, fading in, so no tile or title moves (iOS
  Files'); a song's second title is cut on one line before its chord count (`RowFace`'s `count`), never leaving the
  count alone on a line.
- **Toasts:** one at a time, a new one taking the place of the one before (its Undo would act on what has since
  changed); its Undo closes it; it goes after five seconds, its Undo with it.
- **The phone's keyboard** (Mindscape's ADR 0002, its `keyboard-viewport` and its sheets): every sheet (the kit's
  `Sheet`) is wrapped in Base UI's `VirtualKeyboardProvider`, which focuses its fields without scrolling the page and
  stands the sheet on the keyboard (`--drawer-keyboard-inset`, `pb-sheet-keyboard`); a field starts empty with what
  it would answer as its placeholder (a selection in a sheet is what iOS reveals by lifting the whole app); the
  viewport stays `interactive-widget=resizes-visual`, installed too. `shared/lib/keyboard-viewport.ts`, started once
  by `RootLayout`, publishes `--app-height`, `--kb-inset` and `data-keyboard`: while typing, the tab bar, the
  floating actions and the toasts step aside, and a page's field scrolls clear of the keyboard. Mindscape's
  `useKeyboardReveal` and `useVirtualKeyboard` are not taken: its own rule is that one surface owns a reveal, and in
  a sheet that is Base UI's, while the app's pages scroll the document, which the browser reveals itself. The score
  editor's fields float on its sheet, not in a `Sheet`: they are untouched.
- **Chose, from the libraries studied:** a folder's first songs on its row, the folders before the songs on a
  folder's page, Here in Move to, the filters as chips. Not taken: Recently played at Home's top (Learn already
  shows the songs played last; the sort offers Recent), a shelf of keys.


## Consequences

- **`pt-library` is version 3** with no migration (ADR 0038): `folders` (each its id, `parent`, look, name and
  songs), `home`, `favourites`, `archive` (each entry a song with where it stood, or a folder with its `subfolders`
  and its place among the folders it stood with), `sort` (`manual`, `name`, `recent`, `key`) and `nextFolder`. A
  save of another version reads as the initial state. It stays in the backup.
- **`entities/library`:** the types (`FolderId`, `FolderLook`, `SongPlace`, `ArchiveEntry`), the store and its
  sanitiser (each folder and song once, the caps: 40 characters a name, 100 folders, 500 songs a list), the
  arrangement (`arrangeLibrary` over `libraryCatalog`, `placeIn`, `savedLayout`), `useLibraryLayout`, and its own
  UI: `FolderTile`, `useFolderName`, the pictures.
- **`features/manage-library`:** one pure command each over one snapshot (`editLibrary`): `moveTo` (songs and
  folders) and `undoMove`,
  `archiveSongs` and `restoreSongs`, `archiveFolder` and `restoreFolder`, `restoreAll`, `makeFolder`, `editFolder`,
  `deleteFolder` and `deleteOwnSongs` (through `features/edit-piece`'s `deleteSong`, with the takes),
  `orderFolders` and `orderSongs`, `setSort`, `toggleFavourite` and `setFavourites`; and the UI they share:
  `useLibraryActs` (each act's toast and Undo), `MoveSheet`, `FolderSheet`, `DeleteFolderAsk`, `useSongActions` (the
  song page's and the Player's), `FavouriteButton`, `useFavouriteAction`.
- **`widgets/song-library`:** `SongRow`, `FolderRow`, `SelectRow`, `SortableRows`, `FilteredNotice`.
- **`pages/songs`:** Home and a folder's page, one screen (`LibraryScreen`) over one hook (`useLibraryPage`).
- **`pages/song-archive`:** new, the archive's page.
- **`shared/ui`:** gains Mindscape's `SwipeRow` (with `shared/lib`'s `gestures`, `useGestureHold`, `impact` and
  `useLongPress`; `motion` and `@use-gesture/react` come with it), and the toast: `Toaster`, mounted once by `App`,
  and `say`. `EditableTitle` and `ScreenHeader`'s `heading` go with the setlist page.
- **Gone:** the setlist page and route, the Add to setlist sheet, Search's setlists (its folders in their place),
  Songs' tabs.
