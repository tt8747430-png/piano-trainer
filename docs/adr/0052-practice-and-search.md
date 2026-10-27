# ADR 0052 — Three places; Practice's pages hold their tools; the Metronome; Search finds everything

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

Practice was rebuilt several times: topics with Explore, Quiz and Play; seven places, a page for each thing; things,
tools and training; a tool as a tab of what it works on. piano.org, musictheory.net and musicca.com keep three kinds
of page apart (what teaches, what trains, what works something out) and link a thing to its tool with its state in the
URL. The owner asked for less jumping between pages, and then for a metronome to keep time by and a short guide.

## Decision

- **Three places**: Learn (ADR 0053), Songs (ADR 0106) and Practice. A bar docked at the foot on a phone, a rail down
  the left on a phone on its side, a sidebar from 1024px that collapses to its icons, Search and Settings at its foot.
  Alt with 1–3 goes to them. Every screen below a place has Back.
- **Practice lists its pages and remembers nothing**: the things (Chords, Scales and keys, Intervals, Progressions,
  Accompaniment) under no heading, then **At the keys** (the Chord finder), then **Training** (Exercises, Quiz,
  Metronome). A page's URL sits under its page's.
- **A thing's page shows it on the keys, read top to bottom**: the keys docked; what it is, with its one honey Play;
  its choices as labelled fields; its sections. **It holds the tools that work on it**, never a tab or a page of their
  own:
  - Chords: the builder (any chord from its parts, ADR 0046), its tensions under a 7th chord, its arpeggio and
    chromatic walk into the Player;
  - Scales and keys: Scale (a run from any start, the fingers under the keys, on a staff, its exercises), Chords (the
    scale's chords to 13ths, in an inversion, walked) and Key (the circle of fifths, its signature, facts, borrowed
    chords, the songs in it, and Harmonise: the chords that hold a melody note), as tabs;
  - Intervals: each interval over a root as a card, the simple ones and those a chord symbol names (♭9 to 13; no
    12th; the augmented 9th), played up, down and together;
  - Progressions: its typed line and Between (ADR 0112);
  - Accompaniment: a tab for each method book, Styles and Yours; a pattern's page and the editor of the learner's own;
    a study's page.
- **The Chord finder** (`/practice/chord-finder?keys=&key=`) is the one tool at the keys: the chord a MIDI keyboard
  plays (as its keys went down, read on once they are let go), else the keys tapped (kept in the URL, a link to send).
  One stage in the middle: the chord named as large as the page allows in every reading, over its grand staff, the
  chords played logged on it in turn, then the keys that hold it.
- **The Metronome** (`/practice/metronome`), the owner's example laid out: the BPM large between −10 −1 +1 +10, a
  slider (30–300) and Tap tempo (the average of the last five taps); the sound (Click, Beep, Drum beat) and the meter
  side by side; one honey Play; a square a beat, the first larger, the one sounding filled. The first beat is accented.
  Beats are planned on the audio clock a second and a half ahead and topped up by a timer; a change while it plays
  goes on from the beat heard. Space starts it, ↑ ↓ change the tempo; the screen stays on. Its sounds are synthesised,
  so it works offline.
- **How to use** is Settings' Help: six folding parts in the order a learner meets them, each step beside the icon
  its control wears.
- **Search** (`/search?q=`) lists every named thing by kind, each a row to its page: Practice's pages, songs and
  folders, lessons, chord qualities, scale kinds, progressions, patterns, exercises and trainers. It is one projection
  of the registries, held to each by a test. A chord symbol typed is read as the chord.
- **Words:** a Place is the nav's; Practice has pages in groups; a thing's page is an Explorer; a Tool works something
  out from what it is given.

## Consequences

A link to a tool opens the page that holds it, on what it names. A new page is a row in `PRACTICE_PAGES` and a tile in
`PAGE_TILES`.

## History

- 0012 — Four places, Learn and Practice (2026-09-27); its Choosing Rule is ADR 0061's.
- 0014, 0017 — A key is a page; the Intervals reference (2026-09-27 to 09-29); now Scales' Key view and Intervals.
- 0029, 0030 — Practice by topic; seven places, one page each (2026-10-05).
- 0044 — Things, tools and training; Search finds everything (2026-10-13), from the research note on piano.org,
  deleted.
- 0050 — A tool is a tab of what it works on (2026-10-14), superseded by 0052.
- 0052 — A Practice page holds the tools that work on its subject (2026-10-14).
- 0054 — The Chord finder is a tool of its own (2026-10-15); Free play and Mark went.
- 0113 — The Metronome and How to use (2026-10-27).
