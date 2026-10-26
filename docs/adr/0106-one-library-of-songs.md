# ADR 0106 — One library of songs: folders, the learner's and the app's, and an archive

- **Status:** accepted · **Date:** 2026-10-26 · **Supersedes:** ADR 0103 · **Amends:** ADR 0099 (the Player's
  More), ADR 0100 (the song's page's bar) · **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §6

## Context

ADR 0103 laid the learner's library over Songs as tabs: All, Favourites, Setlists, then a tab for each collection.
A setlist had a page of its own and a song could be in many. The owner found this was not one library. They asked
for the songs as one library, as the memory-palaces repository (the owner's Mindscape) keeps its decks:

- the built-in songs already in a folder each;
- folders of the learner's own;
- songs moved between them;
- what the learner removes kept, and restored from Settings.

Mindscape's library is a Home of folders and the decks that stand on their own, each folder a page of its decks.
A folder has a name, a picture and a colour. A deck is moved to a folder by a sheet of the places it can go, acted on
by a swipe or from its menu, chosen with others for one action, and arranged by an order. Its archive is a place
(its ADR 0003): what is archived leaves the library whole and comes back by Restore, or by the Undo in the toast that
said it went.

## Decision

- **Songs is one library.**
  - **Its Home:** the folders, then the songs that stand at Home.
  - **A folder:** a page of its songs (`/songs/folders/$folderId`).
  - **A song stands in one place:** Home or a folder.
- **The built-in collections are folders from the start**, in catalog order, each with its own picture and colour.
  Each song stands in its collection's folder, in catalog order. A built-in folder can be renamed, restyled, moved
  and archived like the learner's own. It is never deleted, since its songs are the app's.
- **The learner's own:**
  - **Folders:** a name, a picture of music and one of the theme's paints, in one sheet for New folder and Edit
    folder.
  - **Songs:** made at Home or in the folder open.
- **The actions, at every size:**
  - **A song's row:** its More (⋯) holds Favourite, Move to…, Archive, and Delete (the learner's own song alone,
    asked first). A swipe on a touch screen does the same: to the right Favourite, to the left Move and Archive.
  - **The song's page and the Player's More:** Move to… and Archive.
  - **A folder's:** Edit, Archive, and Delete (the learner's own folder alone, asked first).
  - **Select** chooses rows for Favourite, Move and Archive together, Delete too where every song chosen is the
    learner's own. In the Manual order a row is moved by its handle.
- **A deleted folder never takes a song with it.** Its songs stand where it stood: at Home, or in the archive.
- **Favourites is a filter**, beside Stage, With chords and Chords I know, not a list of its own. The ♡ on the song's
  page and in the Player's More stays.
- **The sort:** Manual, Name, or Recently played, kept in the library.
- **The search and filters:**
  - **At Home** they look through the whole library: the songs that match, under their folders' names.
  - **In a folder** they narrow its songs.
- **The archive is a place.**
  - **Archiving** takes a song, or a folder with its songs, out of the library.
  - **Restore** puts a song back where it stood while that place is still in the library, else at Home, last. A
    folder comes back at Home, last, with its songs. The toast's Undo puts either back exactly where it was.
  - **Its page** (`/songs/archive`) is reached from Settings › Library, and from the last row of Songs' Home while
    it holds anything. Each row has Restore, and the page has Restore all. Delete, asked first, is there for the
    learner's own song and folder.
- **Saved:** `pt-library` holds only what the learner changed. It is read over the catalog, and nothing is written
  by a read:
  - a built-in folder the store does not hold (a collection added later) stands after the others;
  - a built-in song the store places nowhere stands last in its collection's folder, and is archived with it while
    that folder is;
  - an own song placed nowhere, or a song whose folder is gone, stands at Home.
- **Setlists go.** A folder is the learner's list of songs in their order. A folder played song after song is a
  later round's.

## Consequences

- **`pt-library` goes to version 2** with no migration (ADR 0038): the folders with their looks, names and songs; the
  songs at Home; the favourites; the archive; the sort. It stays in the backup.
- **`entities/library`:**
  - **Types:** a folder, a place and an archived entry.
  - **The arrangement:** read over the repertoire and the collections. It is Mindscape's `library-arrangement`, cut
    to one level of folders.
- **`features/manage-library`:** one pure command each (favourite, move, archive, restore, delete, make or edit a
  folder, order), and the sheets and menus that call them.
- **`pages/songs`:** becomes the library's Home and a folder's page.
- **`pages/song-archive`:** new; Settings › Library links to it.
- **Gone:** the setlist page, the Add to setlist sheet and Search's setlists.
- **`shared/ui`:** gains Mindscape's `SwipeRow` and a toast with an action. `motion` and `@use-gesture/react` come
  with the swipe.
