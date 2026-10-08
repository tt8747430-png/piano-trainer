# ADR 0033 — A method book has its own lessons, patterns and pieces, and Accompaniment is a page for each

- **Status:** accepted · **Date:** 2026-10-09 · **Amends:** ADR 0029 (Learn's modules), ADR 0030 (Accompaniment's
  Patterns · Studies)

## Context

The app's first users learn accompaniment from two books: _Called to Play for Him_ (its five ways, its right-hand
techniques, its lesson pieces) and Н. В. Боброва's _Семь основных видов аккомпанемента_ (seven types, shown on a
hymn). Learn mixed their lessons into Accompaniment with the subject's own; Practice's Accompaniment listed every
pattern group on one long page and the studies on another, and the hymns the seven types are practised on were only
on Songs. The owner asked for a section of each book's lessons on Learn, the same on Practice, Called to Play's
studies under it and the hymns under Боброва.

## Decision

- **A book is an entity of its own** (`entities/book`): the printed books a Source cites, and among them the **method
  books** (`METHOD_BOOK_IDS`: Called to Play, Боброва's seven types), each with the name its learners call it by
  (`METHOD_BOOK_NAMES`: the title, or the author). The same in both languages.
- **A method book is a module of Learn.** `LESSON_MODULES` holds Fundamentals, Accompaniment, each method book, then
  Gospel; a book's module is named by its book. _The five ways_ and _Right-hand techniques_ are Called to Play's,
  _The seven types_ and _Accompanying a hymn_ Боброва's. A lesson that teaches by subject and quotes the books
  (_Bass and chords_, _Broken chords_) stays in Accompaniment.
- **A pattern group says its book** (`PATTERN_GROUP_BOOK`; the rhythm styles are no book's). A group's name is its
  own; a list that mixes the books (the Setup's picker) says the book first (`useFullShelfName`).
- **Each method book names the pieces its patterns are practised on** (`METHOD_BOOK_PIECES`): Called to Play's
  studies, and the hymns for Боброва. The hymns stay songs, on Songs: listed under Боброва, they open their page
  there. Two lists, one home.
- **Accompaniment is one page, `/practice/accompaniment`, its parts as tabs** (`?show=`, remembered): Called to
  Play · Боброва · Styles · Yours (`REFERENCE_PARTS`). A book's part is its groups over its pieces; Styles the rhythm
  styles; Yours the favourites, the learner's own and the hidden. A part with nothing to show says why in one line.
  `/practice/patterns` and `/practice/studies` go, with no redirect; a pattern's, a study's and the editor's pages
  keep their paths, and Back from one opened directly leads to its part.

## Consequences

- The picker's and Practice's names change ("Called to Play · Боброва · Styles"); the old pattern-group names are
  gone from content.
- A remembered view needs no move: neither old list was remembered.
- A new method book is a book id, its module's lessons, its groups' book and its pieces: the tabs, Learn's sections
  and the picker follow.
