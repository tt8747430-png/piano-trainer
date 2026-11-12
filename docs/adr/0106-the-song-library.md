# ADR 0106 — Songs is one library: nested folders, the app's and the learner's, and an archive

- **Status:** accepted · **Date:** 2026-10-26 · consolidated 2026-10-27

## Context

The learner found songs by collection or search, and nothing kept the ones they cared about or the order they play
them in. Setlists over tabs (Chordify's) were not one library. The owner asked for the songs as one library, as their
Mindscape keeps its decks: folders, built-in and the learner's own, nesting; songs moved between them; what is removed
kept in an archive and restored. Apple Files, Notes and Music, Google Drive, forScore and MuseScore were read for the
details.

## Decision

- **One library.** Home (`/songs`) holds the folders, then the songs that stand at Home. A folder is a page
  (`/songs/folders/$folderId`, not found if unknown or archived): its folders first, then its songs; Back goes up a
  level. A song stands in one place: Home, a folder, or the archive. Folders nest to any depth (`parent`); a folder is
  never moved into itself or under itself.
- **The built-in collections are folders from the start**, each with its picture and paint, renamed, restyled, moved
  and archived like the learner's own. The learner's folders (`folder-<n>`, never given twice) have a name, one of 12
  pictures and one of 5 paints. A new song is made where the learner is, and so is an imported one: New offers New
  song, New folder and Import, and only these (it adds; the Public library is a place, Home's first row), and a
  file dropped on the library imports it (ADR 0107).
- **The laptop's table** (`SongTable`, from 64rem) fits its pane at every width: the title takes the room the other
  columns leave and is cut short, and a pane narrower than 48rem leaves the Chords out.
- **The actions**, at every size:
  - a song's row: More (Favourite, Move to…, Archive, and Delete for the learner's own song, to the Trash with Undo), a swipe
    (right Favourite; left Move, then Archive), a long press starting Select;
  - a folder's row counts its folders and songs and names its first songs; its More edits, moves, archives or deletes
    it;
  - **Select**: a check fading in where More stood so nothing moves, the count as the title, Select all (round, so
    the bar keeps its one row at 320px), a bar of Favourite · Move · Archive · Delete, each in its slot, greyed where
    what is chosen does not allow it (Delete: anything but the learner's own songs and folders); it counts and acts on
    the rows chosen that are in sight, a search or filter hiding the rest; its Archive is one toast whose Undo puts
    every song and folder back; in the Manual sort a handle moves each row, by finger, mouse or keyboard, a screen
    reader told where; in any sort a row's face carries it (a mouse after 8px, a finger after a quarter-second
    hold), with every row chosen where it is chosen, into a folder lit as the target, or onto the bar, which while
    carrying is Archive and, in a folder, Move to the place it stands in; each drop a toast with Undo, ending Select
    (`LibraryDnd`: one drag the sorted lists join);
  - **Move to…**: Home, then the folders as they nest, the place it stands in marked Here; a tap moves at once;
    New folder at its foot;
  - the song's Settings (ADR 0111): the ♡, Move to…, Archive or Restore; a song's row and page also
    Export…, one sheet of MusicXML, MIDI and Share link (ADR 0107).
- **Every move, archive and favourite toasts with Undo**, which puts it back exactly where it stood.
- **Deleting a folder deletes its songs and folders**, but the app's content is never destroyed: what the learner
  made goes (an own folder for good, their songs to the Trash); what the app brought goes to the archive (a built-in
  folder whole, an app song on its own). The ask names the folder, counts its songs and says which happens.
- **The Trash** (`/songs/trash`, R34, StemDeck's): Delete on the learner's own song moves it there with no ask and a
  toast with Undo, as nothing is lost yet; it is gone, with its recordings, only once deleted permanently from the
  Trash or the Trash emptied, each asked first. Restore puts it back where it stood (`trash`, `pt-library` version 6;
  `trashSongs`, `restoreTrashed`, `emptyTrash`). Home's bar holds one button for both, a menu of Archive · Trash, its
  count both; the laptop tree lists Trash under Archive.
- **The archive is a place** (`/songs/archive`, from the bar's Archive · Trash menu): archived songs and folders,
  newest first, each with Restore; Restore all; Delete of the learner's own (a song to the Trash, a folder asked). Restore puts a song back where
  it stood while that folder is in the library, else at Home, last; a folder back with everything under it. An
  archived song still opens by its link, from Learn and from Search, which says it is archived.
- **One search with its sort and filters** (in the URL, never remembered): the sort joined to the search's end
  (Manual · Name · Recently played · Key, kept in the library); Filter with its count (a sheet on a phone, a popover
  on a laptop): Key with its counts, Level, Favourites; the filters on as removable chips. At Home they look through
  the whole library, the songs found under their folders' paths; in a folder they narrow it. While they hide songs a
  line says how many are shown, with Clear filters.
- **Empty states:** an empty folder offers New song and Move songs here; an empty Home New song; filters that keep
  nothing say which.
- **Saved: `pt-library` holds only what the learner changed**, read over the catalog and writing nothing as it reads.
  A built-in folder the store does not hold stands after the others; a built-in song placed nowhere stands last in
  its collection's folder; an own song placed nowhere, or whose folder is gone, stands at Home.
- **A song's cover** (`widgets/piece-cover`, R34): the picture and paint the learner chose; else the song's first two
  bars engraved on the soft yellow (`incipitScore`: the tune's staff alone, plain, no tempo mark), so a song is known by
  its music; a listing with no chart its key letter. The song page, its Settings and Continue draw it. Its ♡ is the
  page's bar's, beside Learned, never over the cover.
- **Your practice** on a song's page, once played: the day played last and the takes; with a take, the last and best
  take's share right as meters in ink, the last take bar by bar, and one next step as a quiet button into the Player
  (`nextStep`: the weakest bar or pair under 80 % looped at 70 % speed, else the tempo climbed 50 → 75 → 100 %). Play
  stays the page's one honey control.
- **Not taken:** setlists, a sort per folder, a 30-day expiry (the app's songs never vanish), tags.

## Consequences

A study, practised on Practice, is in no library. A folder played song after song is a later round's.

## History

- 0103 — The learner's library: Favourites, setlists, Chords I know (2026-10-26), superseded by 0106.
- 0106 — One library of songs (2026-10-26); its second round nested the folders, made one search with its filters,
  moved at a tap and stood sheets on the phone's keyboard (ADR 0061).
- r13 — New's Import and a file dropped on the library (2026-10-28, ADR 0107).
- r14 — Select acts on the rows in sight, its bar's slots stay put and its Archive has one Undo (2026-10-28).
- r24 — New only adds (the Public library out of it); a row's face carries it into a folder, out, or onto Archive;
  Export… on a song's row (2026-10-30).
- r26 — A song's page keeps Edit and Settings in its bar and Practise, Learned and ♡ on its overview card; its place in the library (Favourite, Folder, Archive or Restore) is its Settings page's, Noji's deck settings (2026-11-01).
- r29 (ST17) — A folder's ⋯ menu became its Settings page from a gear in its bar: Name and look, Move to folder…, Archive folder, Delete folder (2026-11-04).
- r30 — A folder is edited in place: its ✎ beside its name (or a folder row's Edit folder) opens its name, picture and
  paint under the bar (`?edit=true`, `FolderEditPanel`), Done saving them; the Edit folder sheet and Settings' Name and
  look go. Songs' bar: Select, Archive with its count, and More holding Card style (2026-11-05).
- r30 (S2) — From 64rem the library is two panes: the tree on the left (All songs, Favourites, the folders nested and
  folded, the Archive; `LibraryTree`), the place's songs on the right as a table (`SongTable`) whose headings sort
  (Title, Key, Last played; again, the learner's order) and whose columns follow the place's Card style. Home lists
  every song there (`libraryView`'s `tree`), a folder its own; the folders are the tree's. A phone keeps the list
  (2026-11-05).
- r30 (S3) — A phone's Home: Continue (the last two songs played, whole cards), Folders, then All songs (Home's own
  first, then every folder's), folded after ten with Show all n; Select keeps the library's own places (2026-11-05).
- r30 (S6) — Groups: with an account a learner makes a group, invites by a link (on or off), and shares any folder with
  it, each group Can view or Can edit (folder ⚙ › Share with a group). Members find it in Shared with me (the tree; a
  phone's Home) and open its songs: the app's by id, an own song as a shared song is (Save to my songs). The owner's
  device keeps each share following its folder. Server: `learner_groups`, `learner_group_members`, `shared_folders`
  under RLS (members read; owner or editor writes), `join_learner_group` and `learner_group_invite`; the `GroupsPort`
  (`shared/api/groups`, a fake with the same rules), `features/share-folder`, `pages/groups` (2026-11-05).
- r31 (R31-S) — A song's ✎ opens the score editor; its page is edited from Settings › Edit song page. Settings: the
  song at its head, Library, Share (Publish, Share link, Export…), Delete apart; a song has no Reset progress (its
  Learned is the bar's). Export holds the files alone; Share link is its own act. Row menus in parts (open, library,
  share, away), a folder's with Card style. Filter adds Folder (Not in a folder) and Progress. My songs · Explore are
  the bar's title. Card style: the preview pinned, presets a grid, Corners, Border and Shadow as choices, text in its
  ink, Reset and Apply docked (2026-11-05).
- r32 (R32-C) — Card style is memory-palaces': presets first in one strip of drawn tiles (Custom while the style is
  none of them), the preview a pinned pane of fixed height that never covers a control, a Phone · Laptop switch in
  it; Layout, Spacing (the rows' height: Density goes), Card (Corner radius, Border and Shadow in three steps),
  Colours, Card contents; Reset to default in the bar, Apply to… (a menu, every folder asked first) and Apply at the
  foot. The default layout is List; Paper is the sand paint, so it follows the theme. The laptop's pane follows the
  place's style: List is the table inside a card in the style, its rows as tall as Spacing says; Cards and Grid draw
  the cards (2026-11-05).
- r32 (R32-C) — Groups could not be made: the insert returned its row under a SELECT policy of membership alone,
  checked before the trigger made the maker a member; `learner_groups`' policy now lets its owner read it
  (`20261105150000_learner_groups_owner_reads.sql`), and the list counts members' ids (an embedded count is an
  aggregate PostgREST refuses). The pages wait for the session before saying Sign in. Groups are rows with their
  picture and paint, members and folders counted; Join with a link (a pasted invite link or its code); a group's
  page holds its invite link, its shared folders with Share a folder…, and its members (Member for one without a
  name, a failure with Try again); a shared folder of the learner's own has Stop sharing (2026-11-05).
- r34 (R34) — Covers engraved from the song's first bars; Your practice says the last and best take, the bars one by one and one next step; the ♡ moves into the bar (2026-11-06).
- r34 (R34-4) — The Trash beside the archive; Delete of an own song to it with Undo; a folder row opens on a tap anywhere with no chevron beside its More (2026-11-06).
- r36 (R36-3) — The songs table fits its pane: the title cut short, the Chords only from 48rem (2026-11-06).
- Instructions audit: a song's library acts on its Settings, not a More; the archive reached from Archive · Trash;
  Recently played left out of Not taken, as Home's Continue has it (2026-11-12).
