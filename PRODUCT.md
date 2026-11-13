# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **First:** piano learners in general, adults and teens, who want to learn songs, chords and scales, and to write
  down or change the music they play. Russian and English speakers.
- **Also:** church accompanists learning to accompany worship songs from chord charts. The app's method books and
  songbooks come from this world; they are one shelf of its content, not its limit.

## Product Purpose

Piano Trainer teaches a learner to play songs at the piano. Success: a learner opens it, sees what to play next, and
is at the keys in one tap, and comes back to practise every day because the app holds them to it.

## Positioning

Learning and writing happen in one app, on one score. The score a learner plays along with in the Player is the score
they edit, and the lessons, chords and practice around it come from that same music. A song the learner writes or
changes can be practised, shared and published at once, with no export between a notation tool and a learning tool.

## Operating Context

- **At the piano:** a phone on the music stand, glanced at while both hands play; or a tablet or laptop beside a MIDI
  keyboard, where Wait mode listens to the keys.
- **Glance and play:** the learner reads a bar, a chord or a key colour, then looks back at the keys.
- **Writing:** the same score on a phone, a tablet or a laptop, edited where it prints.
- **Offline is normal** (a hall, a practice room). The app installs as a PWA.

## Capabilities and Constraints

Four places, **Learn · Songs · Practice · Profile**, plus Search and Settings.

- **Learn:** the Lessons (journeys of chapters, from the first keys to mastery) and the Courses (by level and by method
  book, each with its own lessons and guided songs). A lesson is a worksheet: examples that play in place, questions
  answered on the keys, links into Practice and the Player. Continue picks up where the learner left off.
- **Songs:** one library of nested folders, favourites and an archive, with search, sort and filters. A song's page
  has its key, chords as diagrams, its progressions and its sections, each with short lessons. Songs can be shared as a
  link, printed, and exported or imported as MusicXML and MIDI. With an account, any folder can be shared with a
  group (a class, a choir, a band) the learner invites by a link, each group able to view or to edit.
- **The Player:** the music as sheet music, chords over lyrics, animated chord diagrams or a grid, with two 3D hands
  playing it at the keys. Its Pace: Listen and play along at a speed, Wait mode or Interpret; the hands the learner
  plays, in every mode; three versions (Original, Simple, Easy), a loop, transpose and the sound mix. It also plays
  scales, progressions and exercises.
- **The score editor:** the Player's score in Edit mode. Any song can be edited and the learner can write their own:
  notes, chords, lyrics, fingering, staves, key, time, clef and tempo, all edited where they print. Takes are recorded
  from a MIDI keyboard and keep what was played: each key's timing and velocity, and the pedals.
- **Practice:** Up next, then Chords, Scales and keys, Intervals, Progressions, Accompaniment, the Chord player,
  Exercises and Quiz (trainers with levels; My gaps across them), the Tools last (Metronome, Tuner, Chord finder,
  Circle of fifths).
- **Public library:** Explore, in Songs, holds what learners publish. A learner's own song is private until they publish
  it.
- **Profile and accounts:** accounts are optional. The app does everything without one; an account adds sync, backup
  and the profile on every device, by email and password or Google (Apple is shown as Coming soon). Deleting an account
  has a 30-day grace period. Editors manage content in an admin area.

Constraints:

- **Free:** every feature and all content stay open. No paid tier, upsells or locked content.
- **Two languages:** English and Russian, interface and content alike. Every interface string exists in both. Note and
  chord names are international (B, `#`, `♭`).
- **Offline first:** the app carries its content as an offline starter. An action waits on the network only when the
  server must answer for it to be right (signing in, publishing); every other write is the device's and syncs later.
- **Web MIDI** doesn't exist on Safari or iOS, so everything that listens to a MIDI keyboard has to say so there.
- **Words:** "Song", "Study" or "Progression" in the interface, never "Piece"; the person using the app is "the
  learner". Real musical language throughout.

## Brand Commitments

The name is **Piano Trainer**. The app has no characters, animals or mascots and no stock photos. It does push: a
learner who stops practising is told so, by the streak, by name, every day. The look is recorded in
[DESIGN.md](DESIGN.md).

**Reference products,** for structure and craft (the owner's list, kept in `.claude/skills/owner-way`): Flat and Dorico
for the editor, Chordify for the Player's views and song lessons, Mindscape and memory-palaces for the library and
Profile, Noji for publishing and the Public library. Their craft level is the bar.

## Evidence on Hand

- Songs, studies, patterns, the progression library, lessons and courses, as code under `src/entities/*/content/`.
- The owner's source material in `piano-data/`: method books, scores and reference apps' screens. None of it ships.
  Material from Надежда Боброва and A. Savchenko is credited to them, and sound and font credits are in About.
- No testimonials, users, metrics or screenshots of real use. Do not invent any.

## Product Principles

1. **To the keys in one tap.** Every screen's one primary action leads to playing.
2. **One score, two modes.** What the learner plays is what they edit: the same score, selection and controls in the
   Player and the editor.
3. **Readable at arm's length.** What matters while playing (the chord, the bar, the key colours) reads from the music
   stand.
4. **Calm screens.** Explanations sit behind an ⓘ, never in a paragraph under a control.
5. **Nothing locked.** Levels suggest an order; the learner may open anything, and it costs nothing.
6. **Practice every day, and feel it when you don't.** Daily practice is what makes a pianist, so the app puts
   pressure on it (the owner's ruling, 2026-11-12): the streak is the Profile's first figure and names what is at
   stake ("Keep the flame alive: practise today to extend your streak"); a day not yet practised says so wherever the
   learner looks; a streak about to break warns before it does, and a broken one is shown as lost. The pressure is
   always true: it counts real practice, never invents urgency, never locks or charges, and the learner can turn its
   reminders off.

## Accessibility & Inclusion

- Colour is never the only cue: every coloured key also carries its degree or finger label.
- 44px minimum targets, visible focus, `prefers-reduced-motion` honoured, WCAG AA contrast in both themes.
- Latin and Cyrillic must read equally well; Russian strings run about 20–30% longer.
