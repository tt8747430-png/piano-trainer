# ADR 0112 — A progression is one idea in both modes, read and played in any key, and found in the songs

- **Status:** accepted · **Date:** 2026-09-29 · consolidated 2026-10-27

## Context

Progressions were first pieces, then a tool with its own library beside a list of pieces, a Transpose tool and
"through the keys" exercises: the same idea three times, a major and a minor version as two entries, lines a rule
could write written out. The owner's 2-5-1 sheet walks a cadence through the keys; Gorshkov's lesson 3 reads a song's
chords as degrees so it can be played in any key; Chordify's "chord progression of the month" lists the songs that
use one.

## Decision

- **The library is the one model of a progression practised** (`entities/progression-library`): one entry for each
  idea, named, by style, with a line of numerals in each mode it has (`major`, `minor`), its note, the pattern its
  Player opens with and its chord size. The key's Major · Minor shows that mode's line. No two lines are the same loop
  in the same key or the relative one (a test holds it). No progression is a piece.
- **The Progressions page** (`/practice/progressions`) shows a progression in any key as a row on a staff, voiced
  smoothly, its chords as the Player's diagrams, and the ways into the Player. It holds the tools that work on it:
  - **a typed line**, numerals or a song's chords, read in its key (`?key=&p=`). Chords typed have their key found
    from the chords alone (`keysOfChords`); a chord out of the key is named, not refused (`V/iv`, `♭VII`); playing
    them in another key keeps their letters and basses;
  - **Between** (`?between=&inKey=`): the passing chords between two chords of its row.
- **The library is a list of cards** under the key's strip and Major · Minor, style by style, as the reference app
  lists its progressions: a card's title its numerals, then its name and chord count, how it sounds in one line
  (`character`, both languages), and a chip a chord, the numeral over the chord in the key shown, so the key
  re-spells every card. Its Play plays it in place, the sounding chip lit; a tap elsewhere on it shows it at the
  top of the page, named over its character. No pop-up chooses a progression.
- **The row's chips** name each chord's harmonic function (T S D, coloured as DESIGN.md's Harmony says) or, with
  `?harmony=motion`, how each root moves to the next (`↓5 ↓3 ↑2`, the strong moves coloured, with their legend). The
  kernel reads both (`harmonicFunction`, `rootMove`): a chord's function by its degree in the key (borrowed and applied
  chords as their family, a ♭VII7 and a ♭II7 dominants), a move by letters. The chip sounding follows the row as
  it plays; a tap plays its chord. The same chips stand under a lesson's progression.
- **A lead-in is a way to play any progression** (`lead`: `v` or `ii-v`): each chord after its own V or ii–V. The
  secondary dominants and the ii–V–I to every chord of a key are its lines, not the library's.
- **A walk through the keys** is a chart transformation (`walk`): up or down by semitones or whole tones, or round the
  circle of fifths, always back home, a section per key written in C. Each walk is a row naming the chords of its
  first two keys, so the sheet's step 2 (each I the next key's ii) reads as written. While it walks there is no one
  key: no pattern plays the key's triads, no tune or recording plays.
- **A progression is heard in a song by its numerals** (`findNumerals`), never by its symbols, so a song in any key
  is found. Each chord is read in the key it is written in (a section's own where it has one); an applied dominant is
  read both as applied and as its own degree. A song's chord stands for a numeral where it holds every tone the
  numeral writes (a triad's 7th, 6th, 9th or sus added still stands for it; the bass is never asked). A place never
  runs over a bar of no chord or a key change, and only a key of the line's mode is searched.
- **Both ways:** the page lists **Songs with this progression**, each at the bars it is first heard on, opening the
  Player there looped; a song's page names the library's progressions it uses as chips, each opening Progressions in
  the song's key, one heard only inside a longer one left out.

## Consequences

A new progression is one entry with its lines; its other mode is never a second entry. Nothing about a progression
is saved: views remember numerals, and the Player's `bar` and `loop` open a piece at its bars.

## History

- 0020 — Numerals in any key; a progression is a Player source (2026-09-29). Its numerals are ADR 0046's.
- 0031 — A cadence's version in the other mode (2026-10-08), superseded by 0041.
- 0041 — One idea in both modes; a lead-in is a way to play it (2026-10-13).
- 0045 — Transpose reads a song's chords in their key (2026-10-14), now the page's typed line.
- 0112 — A progression's songs, and a song's progressions (2026-10-27).
- r13 — The library as cards that play in place, each with its character (2026-10-28).
- r13 — Function and root-motion chips under the row (2026-10-28).
