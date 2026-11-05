# R30 Practice: spec

## Source

The owner, 2026-11-05: "continuing with the practices completely … refactor … improve them, fix all the bugs"; "don't
need drone, tap tempo as we already have in metronome, and why the recorder is here and not embedded in score editor";
"exercises accompaniments maybe also progressions as the song real libraries"; "more and greater ui refactoring". Standing
rulings: feedback-log › Practice, Navigation and bars, Actions and menus.

## Today

- **Practice** (`pages/practice`, `widgets/practice-pages`): four groups of rows (Tools 7, Theory 4, Playing 2, Training 2)
  in three columns on a laptop, leaving the right two thirds under Playing empty.
- **Exercises** (`/practice/exercises`): fixed grids under their books (Finger technique, Barry Harris, Piano With Jonny);
  no search, favourites, sort or level filter.
- **Accompaniment** (`/practice/accompaniment`): a Source menu (the book), grids of patterns under their lessons, Studies
  as song rows; + makes a pattern.
- **Progressions** (`/practice/progressions`): a full-width three-tab switch (Progression · Library · Passing chords)
  under the bar; the Library a list with style chips.
- Drone, Tap tempo and the Recorder are Practice tools (removed by the owner's word, done in R30-4's first commit).

## Will build

### 1. Practice, the place

- Bar: "Practice" (large), Search (phone). Groups: **Tools** (Metronome, Chord finder, Circle of fifths, Tuner),
  **Theory** (Chords, Scales and keys, Intervals, Progressions), **Playing** (Chord player, Accompaniment), **Training**
  (Exercises, Quiz).
- Laptop: two columns of groups, Tools and Playing left, Theory and Training right (six rows each), so no column stands
  alone; rows keep their picture, name and line. (Built, R30-4.)
- Continue: the last two Practice pages opened, as on Songs, above the groups. (Built, R30-4: `practiceRecent`.)

### 2. One library for Exercises, Accompaniment and Progressions (`widgets/practice-library`)

The Songs library's shape, shared: the same search field with Sort, the same Filter (level; for Accompaniment and
Progressions, the style), Favourites, and **the books as built-in folders** (Barry Harris, Piano With Jonny, Called to
Play, Gorshkov, …), with **Mine** for what the learner made (own patterns, own progressions).

- **Phone:** the search; Favourites (if any); then each book as a section of rows, folded after five with "Show all n";
  Mine last. A row: picture, name, line, level (bars and its number), ♡ in its ⋯ and on a swipe.
- **Laptop:** two panes as Songs: the tree (All, Favourites, each book, Mine) and the table (Name, Book, Level, and for
  Accompaniment the hands, for Progressions the numerals), sorted by its headings.
- **Accompaniment:** the Source menu goes (the books are the tree and the sections); Studies are their book's rows.
- **Progressions:** Library becomes the page's own view: the page opens on the library; a progression opens its own page
  (`/practice/progressions/$id`), where Passing chords is its section. No three-tab switch.
- Favourites are kept per kind in a saved store (`pt-practice-library`, version 1).

## What goes

The Source menu; Progressions' three tabs; the fixed grids; Drone, Tap tempo and Recorder.

## Left for the owner (drawn)

Learner-made folders inside Practice's libraries (as Songs' folders): the books and Mine cover what is built in and what
is made; folders would add moving and nesting. Recommended: not now.
