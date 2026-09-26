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

- Screens: Path (Continue + levels 1–4), Songs, Piece, Player (Listen · Step · Wait), Theory (Chords, Scales,
  Symbols, Quiz with My gaps), Settings. Full behaviour: `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md`.
- English and Russian, interface and content text alike. Note and chord names are international (B, `#`, `♭`).
- Terminology: `docs/UBIQUITOUS_LANGUAGE.md` ("Song", "Study" or "Progression" in the interface, never "Piece").
- No accounts, sync, backend, sheet-music rendering or audio recording.

## Brand Commitments

The name is **Piano Trainer**. The legacy look (navy on slate, Bricolage Grotesque) is evidence of the subject, free
to replace.

**Reference products (owner-pinned, 2026-09-25):** the app sits alongside **Clefs** (calm sage palette, round icon
buttons, a floating tab bar, full-width pill actions, the keyboard as the lower half of a practice screen),
**Flowkey**'s player (the keyboard as the hero, one big round Play, tempo and hands in small popovers from the toolbar,
chord symbols over numbered bars), a theory reference app (grouped reference cards with inline actions) and a chord
trainer (bottom sheets of toggles with "Select common · Clear all" and Apply). Their craft level is the bar. Not
taken from them: streaks as pressure, mascots, upsells, locked content, stock photos.

## Evidence on Hand

- 51 pieces, 7 listings, 39 accompaniment patterns and the path, as code under `src/entities/*/content/`.
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
