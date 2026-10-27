# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **First:** church accompanists, adults and teens, learning to accompany worship songs at the piano from chord
  charts: the «Боже, спасибо» songbook (Надежда Боброва), _Called to Play for Him_ (A. Savchenko) and hymns. The
  owner first, then others in the same church and school circle. Russian and English speakers.
- **Also:** piano learners in general who want chords, scales and songs. The church songbooks are the first content,
  not the limit.

## Product Purpose

Piano Trainer teaches a learner to play songs at the piano. Success: a learner opens it, sees what to play next, and
is at the keys in one tap.

## Positioning

It is built around real songbooks and the accompaniment methods they teach (Боброва's accompaniment types, the ways of
_Called to Play_): a chart becomes a playable accompaniment in any key, spelled correctly. The gaps it finds come from
what the learner answered, not from a generic curriculum.

## Operating Context

- **At the piano:** a phone on the music stand, glanced at while both hands play; or a tablet or laptop beside a MIDI
  keyboard, where Wait mode listens to the keys.
- Glance and play: the learner reads a bar, a chord or a key colour, then looks back at the keys.
- Offline is normal (a church hall, a practice room). The app installs as a PWA.

## Capabilities

Three places, **Learn · Songs · Practice**, plus Search and Settings.

- **Learn:** the Lessons (journeys of chapters, from the first keys to mastery) and the Courses (shelves by level and
  by method book, each with its own lessons and guided songs). A lesson is a worksheet: examples that play in place,
  questions answered on the keys, links into Practice and the Player. Continue picks up where the learner left off.
- **Songs:** one library of folders, favourites and an archive, with search, sort and filters. A song's page has its
  key, chords as diagrams, the progressions it uses and its sections, each section with short lessons (its chords, in
  time, one change at a time, the pattern). Songs can be shared as a link, printed and exported to MIDI.
- **The Player:** the music as sheet music, chords over lyrics, animated chord diagrams or a grid. Listen or Wait
  mode, a loop, tempo, transpose, simplify, the sound mix, and a Setup for the accompaniment pattern, its inversions,
  swing and melody. It also plays a scale's chords walked through the keys, progressions and exercises.
- **The score editor:** the Player's score in Edit mode. Any song can be edited, and the learner can write songs of
  their own: notes, chords, lyrics, fingering, staves, key, time, clef and tempo, all edited where they print. Takes
  are recorded from a MIDI keyboard to a click and kept bar by bar.
- **Practice:** Chords (any chord from its parts, with its tensions), Scales and keys (runs with fingering, a
  scale's chords, a key's page with the circle of fifths and harmonisation), Intervals, Progressions (a library by
  style, or a line typed in numerals or chords, in any key, with passing chords and the songs that use it),
  Accompaniment (the patterns and the studies they are practised on), the Chord finder (any chord played, named),
  the Metronome, Exercises (five-finger position, Hanon, Barry Harris, Piano With Jonny) and Quiz (trainers with
  levels; My gaps across them).
- **Everywhere:** the keys a hand plays sound while held, under a pedal (the MIDI keyboard's, the rail's, or Space).
  The computer keyboard drives the app; `?` lists its shortcuts.

## Constraints

- English and Russian, interface and content alike. Note and chord names are international (B, `#`, `♭`).
- Words: [docs/UBIQUITOUS_LANGUAGE.md](docs/UBIQUITOUS_LANGUAGE.md) ("Song", "Study" or "Progression" in the
  interface, never "Piece").
- No accounts, sync or backend. Saved data stays on the device; Settings' Backup writes it to a file and reads it
  back. Recording is MIDI, not audio.

## Brand Commitments

The name is **Piano Trainer**. The world is a **labelled picture book**, printed quietly: paper, a soft line round
every shape, faded paints at one lightness, colour filling one control per screen, titles and chords in a book serif
(Literata) with Onest for reading and controls. No characters, animals or mascots. The keys follow The Ultimate
Piano's learn view: a mark pale at rest, full colour when its key is played. Tokens and components:
[DESIGN.md](DESIGN.md).

**Reference products,** for structure and craft (the owner's list, kept in `.claude/skills/owner-way`): Flat and
Dorico for the editor, Chordify for the Player's views and song lessons, Mindscape for the library, Clefs and
Flowkey for the practice screen. Their craft level is the bar. Not taken from them: streaks as pressure, mascots,
upsells, locked content, stock photos.

## Evidence on Hand

- The songbooks' songs and studies, listings, patterns, the progression library, lessons and courses, as code under
  `src/entities/*/content/`.
- No testimonials, users, metrics or screenshots of real use. Do not invent any.

## Product Principles

1. **To the keys in one tap.** Every screen's one primary action leads to playing.
2. **Readable at arm's length.** What matters while playing (the chord, the bar, the key colours) reads from the
   music stand.
3. **Calm screens.** Explanations sit behind an ⓘ, never in a paragraph under a control.
4. **Nothing locked.** Levels suggest an order; the learner may open anything.
5. **Evidence, not guesses.** Gaps come only from quiz answers.

## Accessibility & Inclusion

- Colour is never the only cue: every coloured key also carries its degree or finger label.
- 44px minimum targets, visible focus, `prefers-reduced-motion` honoured, WCAG AA contrast in both themes.
- Latin and Cyrillic must read equally well; Russian strings run about 20–30% longer.
