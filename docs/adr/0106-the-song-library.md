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
  song, New folder and Import, and a file dropped on the library imports it (ADR 0107).
- **The actions**, at every size:
  - a song's row: More (Favourite, Move to…, Archive, and Delete for the learner's own song, asked first), a swipe
    (right Favourite; left Move, then Archive), a long press starting Select;
  - a folder's row counts its folders and songs and names its first songs; its More edits, moves, archives or deletes
    it;
  - **Select**: a check fading in where More stood so nothing moves, the count as the title, Select all, a bar of
    Favourite · Move · Archive · Delete where everything chosen allows it; in the Manual sort a handle moves each row,
    by finger, mouse or keyboard, a screen reader told where;
  - **Move to…**: Home, then the folders as they nest, the place it stands in marked Here; a tap moves at once;
    New folder at its foot;
  - the song's page and the Player's More: the ♡, Move to…, Archive or Restore.
- **Every move, archive and favourite toasts with Undo**, which puts it back exactly where it stood.
- **Deleting a folder deletes its songs and folders**, but the app's content is never destroyed: what the learner
  made goes for good (their songs with their takes); what the app brought goes to the archive (a built-in folder
  whole, an app song on its own). The ask names the folder, counts its songs and says which happens.
- **The archive is a place** (`/songs/archive`, its button with its count in Home's bar): archived songs and folders,
  newest first, each with Restore; Restore all; Delete for good of the learner's own. Restore puts a song back where
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
- **Not taken:** setlists, a sort per folder, a 30-day expiry (the app's songs never vanish), tags, Recently played at
  Home's top (Learn shows the songs played last).

## Consequences

A study, practised on Practice, is in no library. A folder played song after song is a later round's.

## History

- 0103 — The learner's library: Favourites, setlists, Chords I know (2026-10-26), superseded by 0106.
- 0106 — One library of songs (2026-10-26); its second round nested the folders, made one search with its filters,
  moved at a tap and stood sheets on the phone's keyboard (ADR 0061).
- New's Import and a file dropped on the library (2026-10-28, ADR 0107).
