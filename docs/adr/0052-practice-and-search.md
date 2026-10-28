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
- **Practice lists its pages and remembers nothing**, in three headed groups as the reference app and memory-palaces
  list theirs: **Theory** (Chords, Scales and keys, Intervals, Progressions: the things a page shows on the keys),
  **Playing** (Accompaniment, the Chord finder: what the hands play) and **Training** (Exercises, Quiz, Metronome).
  Each row is its tile, its name and one short line of its own, the same in Search. A page's URL sits under its
  page's.
- **Choosing a root, a quality or a scale** is a strip (`StepStrip`) with ‹ › to step along it, the chosen option a
  card kept in sight, one greyed never hidden: a root's strip holds its 17 spellings (C C♯ D♭ D … B), a key's the
  keys a signature writes. Every root and key in the app (`NoteChoice`, `KeyChoice`) is that strip.
- **A chord or a scale chosen plays as it is chosen** (a scale up its octave), unless Settings › Keyboard › Play
  what you choose is off.
- **A thing's page shows it on the keys, read top to bottom**: the keys docked; what it is, with its one honey Play;
  its choices as labelled fields; its sections. **It holds the tools that work on it**, never a tab or a page of their
  own:
  - Chords: the builder (any chord from its parts, ADR 0046; its quality a strip, the power chord on it; a size or
    inversion the chord cannot take greyed with why), its voicing (a strip of the eight, ADR 0046, `voicing=`, one
    the chord cannot take greyed with why, the chosen one's ⓘ saying what it is with its spelling in C and on this
    chord; a voicing other than close sets the hands, and the inversion where it is not made from a close chord),
    its Fingering (each hand drawn as Scales draws it, beside a row an inversion of each hand's block fingering, the
    keys' own marked; a voicing or a chord of five notes one row of what each hand holds), the fingers on the keys,
    its tensions under a 7th chord, its arpeggio and chromatic walk into the Player;
  - Scales and keys: Scale (a run from any start; what its keys carry, Notes · Left hand · Right hand, `onKeys=`;
    on a staff; its fingering hand by hand, each hand drawn with its fingers numbered beside the run's notes and
    fingers; its exercises), Chords (the scale's chords to 13ths, in an inversion, walked, each a tap to play and a
    link to open it in Chords) and Key (the circle of fifths, its signature, facts: notes, relative and parallel
    keys, the keys beside it on the circle, its other spelling where the circle's ends meet, modes; its degrees by
    name with their notes and triads; borrowed chords, the songs in it, and Harmonise: the chords that hold a melody
    note), as tabs;
  - Intervals: a row an interval over a root, as the reference lists them: its short name, its name over its size in
    semitones, a small keyboard with both keys; the simple ones (the tritone twice, A4 and d5) and those a chord
    symbol names (♭9 to 13; no 12th; the augmented 9th). A tap plays it the way the switch above says, At once · Up
    · Down (`way=`). Within the octave each row's ⓘ names songs that open with it, rising and falling (the unison
    once, the tritone under both spellings), each language its own list of titles. The cards with a staff are the
    lessons';
  - Progressions: its typed line and Between (ADR 0112);
  - Accompaniment: a tab for each method book, Styles and Yours; a pattern's page and the editor of the learner's own;
    a study's page.
- **The Chord finder** (`/practice/chord-finder?keys=&key=`) is the one tool at the keys: the chord a MIDI keyboard
  plays (as its keys went down, read on once they are let go), else the keys tapped (kept in the URL, a link to send).
  One stage in the middle: the chord named as large as the page allows in every reading, over its grand staff, the
  chords played logged on it in turn, then the keys that hold it. Its settings can paint the key's scale on every
  octave of the keys, each with its note (`scale=true`).
- **A key size chosen** says on the keys' rail for a moment what it shows ("Showing 36 keys (C3–B5)").
- **The Metronome** (`/practice/metronome`), the owner's example laid out: the BPM large between −10 −1 +1 +10, a
  slider (30–300) and Tap tempo (the average of the last five taps); the sound (Click, Beep, Drum beat) and the meter
  side by side; one honey Play; a square a beat, the first larger, the one sounding filled. The first beat is accented.
  Beats are planned on the audio clock a second and a half ahead and topped up by a timer; a change while it plays
  goes on from the beat heard. Space starts it, ↑ ↓ change the tempo; the screen stays on. Its sounds are synthesised,
  so it works offline. Its tempo is named by its Italian tempo word (`tempoWord`, the editor's dial's ladder), the
  word's meaning and range in its ⓘ. The **bar trainer** plays N bars, then mutes N bars (1–8 each, saved with the
  Metronome): each beat carries its bar since the start, a muted bar's beats are not queued but still shown.
- **Musical terms** are one list each in the kernel: the tempo words with their ranges (`TEMPO_TERMS`, larghissimo
  to prestissimo; ten name a tempo, the shades between only describe), the editor's expression text in three groups
  (`EXPRESSION_GROUPS`: character, tempo changes, technique), each meaning in both languages.
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
- r13 — Theory · Playing · Training; strips with ‹ ›; interval rows; fingering by hand; autoplay; the scale on the
  Chord finder's keys; the key size's caption (2026-10-28), from the reference app's tool screens.
- r14 — Chords' voicing and fingering; interval songs; the Key view's parallel, neighbours, other spelling and degrees; the bar trainer and tempo
  words; the Italian terms (2026-10-28), from Musicca, piano.org and Vita Piano.
