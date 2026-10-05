# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **First:** church accompanists, adults and teens, learning to accompany worship songs at the piano from chord
  charts: the «Боже, спасибо» songbook (Надежда Боброва), _Called to Play for Him_ (A. Savchenko) and hymns. The
  owner first, then others in the same church and school circle. Russian and English speakers.
- **Also:** piano learners in general who want chords, scales and songs; the church songbooks are the first
  content, not the limit.

## Product Purpose

Piano Trainer teaches a learner to play songs at the piano. It gives an easy-to-hard path of studies, chord topics
and songs, a practice player that plays along, steps through or waits for the learner's notes, and theory that finds
the learner's gaps from quiz answers and routes practice to them. Success: a learner opens it, sees what to play
next, and gets to the keyboard in one tap; nothing they had in the old app is lost.

## Positioning

It is built around real songbooks and the accompaniment methods taught in them (Боброва's seven accompaniment types,
the five ways of _Called to Play_'s lesson 3): a chart becomes a playable accompaniment in any key, with correct note
spelling, and the gaps it finds come from what the learner answered, not from a generic curriculum.

## Operating Context

- **At the piano:** a phone propped on the music stand of an acoustic or digital piano, glanced at while both hands
  play; or a tablet or laptop beside a MIDI keyboard, where Wait mode listens to the keys.
- Practice is glance-and-play: the learner reads a bar, a chord or a key colour and looks back at the keys.
- Offline is normal (a church hall, a practice room); the app installs as a PWA.

## Capabilities and Constraints

- Screens, in four places (Path · Songs · Learn · Practice): Path (Continue + levels 1–4; Settings behind its gear on
  a phone, at the sidebar's foot on a laptop), Songs (the songs by collection, chosen from tabs, and the learner's own
  songs, made from New song), a Piece (its facts, Practise, the chords it plays to tap and hear, its chart), the Player
  (sheet music as it plays; Listen or Wait mode, a loop, speed training, swing; a piece, or a scale's chords walked
  with a song's patterns; its Setup a key picker, the pattern with its two hands, drawn inversions and toggle tiles),
  Learn (the lessons only, as worksheets, module by module in the order taught: the Fundamentals module's fourteen,
  from finding your way on the keys to key signatures; Accompaniment's eleven, from bass and chords through the five
  ways, the right-hand techniques and Боброва's seven types to hymns, common progressions, passing chords and
  reharmonising; Gospel's three; each with examples that play in place (a pattern over its piece, a progression in
  any key) and quizzes answered on the keys), Practice (seven places, each one page for a thing practised. **Chords:** Build makes any chord from its
  root (letter and accidental), quality, size, 7th, suspension, added tones (several at once, a 7th chord the one its stack skipped) and alterations, each
  in sight, on the keys and a staff, with a 7th chord's available tensions
  (weak, strong, tensions, avoid) and its arpeggio and chromatic walk in the Player; Find names the keys played.
  **Scales and keys:** thirteen scale kinds with the modes and both blues; its Scale view starts the run on any note,
  fingered from the thumb or as the scale, on a staff, and opens the scale's exercises in the Player (over one to four
  octaves, in 3rds, 6ths and groups, in contrary motion); its Chords view stacks the scale's chords to 13ths in any
  inversion and walks them; its Key view (a major or minor scale) is the circle of fifths with the key's signature,
  relative, modes, borrowed chords and songs. **Progressions:** one library by style, or a line typed in numerals or
  chords, in any key and chord size, played and opened in the Player in the key or through the keys; Passing chords,
  the ways between two chords; Reharmonise, the chords that hold a melody note. **Intervals:** every interval over a
  root on a staff, heard up, down and together. **Accompaniment:** Patterns, each pattern's page explaining and
  playing it, with favourites, hiding from the Player's list, and the learner's own made from any two figures; and
  the Studies they are practised on. **Exercises:** the five-finger position and Hanon No. 1; Barry Harris's
  6th-diminished scale and its chords, the dominant scale down, arpeggios from the 3rd and drop-2 7ths; Piano With
  Jonny's 2-5-1 scale, inner voice, modes, rapid switch and pattern shifting. **Quiz:** every trainer, each a ladder
  of levels or Custom, runs of rounds summed up and recorded per level: Build chord, Name chord, A chord's role, Build
  scale, key signatures, a key's degrees, reading notes, and intervals, chords and scales by ear; My gaps, across
  them, in its bar),
  the score editor (the learner's version of any song or study, or the chart of a
  listing, and songs of their own: a click on the sheet chooses where the keys write (the chord row, the treble
  staff's melody or right hand, the bass staff), chords typed, tapped or played under a Chord names toggle, the melody
  and any bar of either hand written note by note from the keys, the computer keyboard or MIDI, the clef and
  signatures opening the song's key, tempo and meter, undo and redo, every change saved, played in the Player in any
  key), Settings. Full behaviour: `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` and ADRs
  0012–0030.
- English and Russian, interface and content text alike. Note and chord names are international (B, `#`, `♭`).
- Terminology: `docs/UBIQUITOUS_LANGUAGE.md` ("Song", "Study" or "Progression" in the interface, never "Piece").
- No accounts, sync, backend or audio recording.

## Brand Commitments

The name is **Piano Trainer**. The legacy look (navy on slate, Bricolage Grotesque) is evidence of the subject, free
to replace.

**The world (owner-chosen, 2026-09-27, ADR 0010):** a **labelled picture book**, Richard Scarry's Busytown
cross-sections: paper, a line round every shape, seven paints at one lightness and a small printed label on
everything. Its colour, line and labelling only: no characters, animals or mascots. **Printed quietly (owner,
2026-09-27, ADR 0011):** faded paints, a soft 1px line, colour filling one control per screen, a neutral "chosen",
titles and chords typeset in a book serif (Literata) with Onest for reading and controls. The keys follow **The Ultimate Piano**'s learn view (owner-sent): a mark pale at rest, full colour when its
key is played.

**Reference guides (owner-sent, 2026-09-27), for colour and type:** Apple's Human Interface Guidelines on Color
and Typography, and Material's colour system: one meaning per colour, colour on one control's background, a
monochrome tab bar, light, dark and increased-contrast variants, few typefaces as a sans and serif pair, fixed text
styles that follow the reader's text size, "on" colours for what sits on a fill.

**Reference products (owner-pinned, 2026-09-25), for structure and craft:** **Clefs** (round icon buttons, the
keyboard as the lower half of a practice screen), **Flowkey**'s player (the keyboard as the hero, one big round Play,
tempo and hands in small popovers from the toolbar, chord symbols over numbered bars), a theory reference app
(grouped reference cards with inline actions) and a chord trainer (bottom sheets of toggles with "Select common ·
Clear all" and Apply). Their craft level is the bar; their sage palette and floating tab bar are no longer ours. Not
taken from them: streaks as pressure, mascots, upsells, locked content, stock photos.

## Evidence on Hand

- 42 pieces, 7 listings, 39 accompaniment patterns, the progression library and the path, as code under `src/entities/*/content/`.
- No testimonials, users, metrics or screenshots of real use. Do not invent any.

## Product Principles

1. **To the keys in one tap.** Every screen's one primary action leads to playing.
2. **Readable at arm's length.** What matters while playing (the chord, the bar, the key colours) reads from the
   music stand.
3. **Never explain the obvious.** No how-to paragraphs; labels, layout and the labelled keyboard do the teaching.
4. **Nothing locked.** Levels suggest an order; the learner may open anything.
5. **Evidence, not guesses.** Gaps come only from quiz answers.

## Accessibility & Inclusion

- Colour is never the only cue: every coloured key also carries its degree or finger label.
- 44px minimum targets, visible focus, `prefers-reduced-motion` honoured, WCAG AA contrast in both themes.
- Two scripts (Latin and Cyrillic) must read equally well; Russian strings run about 20–30% longer.
