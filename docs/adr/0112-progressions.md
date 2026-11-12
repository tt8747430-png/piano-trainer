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
- **Progressions is a place of the practice library** (`/practice/progressions`, ADR 0052): each style a place, Mine
  the learner's own, a row a progression with its chords as tiles tinted by role. A progression has its page
  (`/practice/progressions/$id`, the library's or `mine-n`): the row on a staff, voiced as its Settings say, why it
  works drawn on its chords, its chords as the Player's diagrams, its key, chord size and approach chords, then
  Practise in all 12 keys and its songs. It holds the tools that work on it:
  - **a typed line**, numerals or a song's chords, read in its key (`/practice/progressions/line?key=&p=`). Chords
    typed have their key found from the chords alone (`keysOfChords`); a chord out of the key is named, not refused
    (`V/iv`, `♭VII`); playing them in another key keeps their letters and basses;
  - **Passing chords**, a section of its page (`between=&inKey=`): the chords that lead from one chord of its row to
    the next.
- **Why it works is drawn on the chords** (layout B, Decided 14), always, no switch: each chord a chip over its
  role in one word, **home · away · tension**, and the colour a chord brings (**sad** for the relative minor, **soft**
  for ii and iii, **bright** for a major chord in a minor key), in DESIGN.md's Harmony paints; between each two an
  arrow with the root movement (`↓5 ↓3 ↑2`, the strong moves bold, the ones that step back soft), its meaning in its
  name, a tap playing the two chords. One legend line, the terms (tonic, subdominant, dominant, relative minor, each
  move) behind its ⓘ, and Test yourself to the Quiz's Chord roles. The kernel reads both (`chordRole` over
  `harmonicFunction`, `rootMove`): a chord's role by its degree in the key (borrowed and applied chords as their
  family), a move by letters; every library line has its roles (a test). The same row stands under a lesson's
  progression (`RowRoles`).
- **A lead-in is a way to play any progression** (`lead`: `v` or `ii-v`): each chord after its own V or ii–V. The
  secondary dominants and the ii–V–I to every chord of a key are its lines, not the library's.
- **Practise in all 12 keys**: each sequence is a chart transformation (`walk`), named as teachers name it
  (Chromatically, rising; In whole steps, falling; Around the circle of fifths, falling a fifth …), always back
  home, a section per key written in C. Each is a row with an icon by its direction, naming the chords of its first
  two keys, so the sheet's step 2 (each I the next key's ii) reads as written; a line of one chord has none. While it walks there is no one
  key: no pattern plays the key's triads, no tune or recording plays.
- **A progression is heard in a song by its numerals** (`findNumerals`), never by its symbols, so a song in any key
  is found. Each chord is read in the key it is written in (a section's own where it has one); an applied dominant is
  read both as applied and as its own degree. A song's chord stands for a numeral where it holds every tone the
  numeral writes (a triad's 7th, 6th, 9th or sus added still stands for it; the bass is never asked). A place never
  runs over a bar of no chord or a key change, and only a key of the line's mode is searched.
- **How it is read and played.** Mode stays with the line (`mode=`), offered only for a typed line, since a library
  line's numerals say their mode. Written as and Voicing, with the first chord's inversion, are how every
  progression is shown, so they live on Progressions' Settings (`pt-settings.progressions`, A24), not the URL:
  - **Mode** (`mode=`): the line read in a church mode on the key's tonic (`readInMode`): each plain degree becomes
    the mode's own chord, written against the major key of the tonic for Lydian and Mixolydian, the minor for
    Dorian, Phrygian and Locrian (I IV V in Dorian is i IV v; Mixolydian's VII is ♭VII); chromatic, applied and
    written-out chords stay as written. A chord grows by the mode's scale (Mixolydian's I to a dominant 7th). A
    mode chosen stands the key on its major or minor; the key turned to the other leaves the mode; the mode is
    named under the line, and the typed line's major/minor hint says nothing while in one. The Player gets the
    re-read numerals in the key (it grows them by the key, not the mode).
  - **Written as**: Numerals · Nashville · Chords, on the row's staff, its chips and every library row.
    Nashville counts from the tonic's major scale in a minor key too (`1m ♭3 4m 5`), its figures raised.
  - **Voicing**: Voice-led (from the first chord's inversion, each after it to the nearest position) or Block (every
    chord in root position, the hand leaping); the inversion offered only while voice-led; the Player opens as shown.
- **On the page only what changes the music shown** (R30): the chord size drawn only where a chord grows, Approach
  chords None · Secondary dominants · ii–V, Songs with this progression only where a song uses it.
- **The library's breadth** follows the common named progressions of the reference sites, checked as chords, with a
  **Modal** style of vamps that open in their mode (`mode` on an entry; its lines still written against major or
  minor). A rotation of a loop already there (vi–IV–I–V, the Aeolian shuttle, I–♭VII–IV beside I–♭VII–IV–I) stays
  out, as the loop test holds. A modal vamp is heard in a song only where it comes back to its first chord
  (`heardLine`: I–II–I, never Aura Lee's I–II⁷ on to V), on the song page and in its songs alike.
- **Both ways:** a progression's page lists **Songs with this progression**, each at the bars it is first heard on,
  opening the Player there looped; a song's page names the library's progressions it uses as chips, each opening
  Progressions in the song's key, one heard only inside a longer one left out.

- **The Chord player** (`/practice/chord-player`, R29 CP1–CP6, Decided 22): two pages, one engine. Progressions
  is the page to learn a progression; the Chord player plays a **chord sheet** along with a band, and each opens the
  other with the same chords. A chord sheet (`shared/lib/arrangement/chord-sheet.ts`) is sections (Intro, Verse,
  Pre-chorus, Chorus, Bridge, Solo, Outro), each played ×1–8 in one of its style's variations, of chords lasting 1
  to 8 beats laid end to end across the bar lines; its text (`sheetToText`) is a Share link's and a saved sheet's
  form. A **style** (`entities/pattern/content/styles`, Pop 1 first and the default) is the piano's two hands, the
  bass's line of degrees and the drums' 16-step grid a bar, a fill on a section's last bar its last time round and
  a crash on its first beat, swing as triplets (`arrangeStyle`); Accompaniment's patterns are its piano-only
  styles. The transport queues each chord 0.1 s ahead from the sheet as it stands, so an edit lands at the next
  chord. **My chord sheets** are `pt-chord-sheets` (version 1, synced as `chord_sheets`): the sheet in hand and
  the learner's own, each its text, style, tempo and how it plays (instruments, count-in, repeat, volume,
  transpose, set on the Chord player's Settings); Written as and Voicing are `pt-settings.chordPlayer`.

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
- r14 — Modes, Numerals · Nashville · Chords, voice-led or block; 17 more named progressions and a Modal style
  (2026-10-28), from Musicca's and piano.org's progression pages.
- r29 — Three tabs; the roles and moves drawn on the chords; the library a list; Written as and Voicing on
  Progressions' Settings (2026-11-03).
- r29 — The Chord player: chord sheets of sections, styles with a band, My chord sheets synced (2026-11-04).
- r34 — The musician's terms: arrows name the root movement, not the bass; in Russian Отклонения with Побочные доминанты (2026-11-06).
- Instructions audit: the three tabs replaced in the decision by the library's place and a progression's own page
  (R30-4, ADR 0052) (2026-11-12).
