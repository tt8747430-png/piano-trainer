# ADR 0105 — The Player: Listen and Wait mode, a plain Setup, Transpose and Simplify, the transport's Sound

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The Player takes Flowkey's shape: the music on a staff, a cursor on what sounds, a loop over bars, the app waiting
for the learner's notes. Chordify's song screen added a toolbar (Transpose, Simplify), a count-off seen in large
numbers, volume sliders for a mix and a tempo from 50% to 200%. The owner found the Setup's tiles said nothing of
what they changed.

## Decision

- **It plays any Performance** (`usePractice` over a pure practice machine): **Listen**, the app playing passes
  queued on the audio clock, and **Wait mode**, the app waiting for the practised hand's notes from MIDI or the keys
  and playing the other. Play in both; ‹ › step in either. A loop over bars, each lap played in Wait mode with nothing
  skipped; a Wait-mode pass finished is recorded (ADR 0111). Speed training. The tempo runs from 50% to 200% of the
  piece's, in 5% steps, beside its presets.
- **Keys** (`PLAYER_KEYS`): Space Play, the arrows, R the loop, Home; Shift with ← → Home End the loop's far end;
  Escape lets go of the loop, then closes.
- **The Setup** (`PieceSetup`) holds how a piece is arranged and how it plays, plainly:
  - **Accompaniment:** the pattern over its two hands, each hand's figure drawn as a small piano roll. Changing a
    hand makes the pattern the learner's mix, with Back to the pattern. Then **Starting position** and **Move
    smoothly** (ADR 0047), each explained in its ⓘ.
  - **How it plays:** **Swing**, four feels as tiles drawing a beat's two 8ths; **Melody**, the source the tune
    plays from: None, the top single staff by its name, or the Recording. A source the song lacks is greyed with why;
    a lead sheet always plays its staff.
  - The song's key is not in the Setup: it is Transpose.
  - **A scale run's practice** (the Scale exercise, `ScalePracticeFields`), as the reference app's Practice Scale
    sheet: Hands; the octave each hand playing starts on (C1–C7 as a strip, `rhOctave=`/`lhOctave=`; one whose run
    would leave the keyboard greyed with where it would go, never hidden; a hand left unchosen starts where the run
    fits, the left an octave or two below); the tempo; the metronome; and **Ticks between loops** (`rest=`, none to 4
    beats): each repeat of the loop after the first waits that many beats, a click on each where the click sounds,
    counted down as a count-in is (`LoopOptions.rest`).
- **Transpose** (ADR 0115) moves a piece −5 to +6 semitones, into its simplest key; the recording falls silent outside
  its own key, an ⓘ saying so. **Simplify**, a switch, plays and shows each chord as its plain triad on its root
  (`simplifyChart`): a slash chord's bass and added notes dropped, a chord held on where the next simplifies to it, a
  bar of no chord and written notes left as they are. It changes the music, so every view, Wait mode and the MIDI
  export follow; the song's page and its lessons read the piece as written. It is greyed where nothing would change.
  Both are kept per piece (`key`, `simple`). A progression's, a walk's or an exercise's key stays in its own Setup:
  there it chooses what is practised.
- **Sound**, in the transport: **Count in** (the bar's beats counted down large over the music as each click
  sounds), **Click**, a **volume** for each part (the right hand, the left hand, the staves over the piano, the
  recording, the click), and **Only the chords** where there is a recording. A volume is a gain of its share squared,
  asked as each sound renders, so a slider moved while the music plays is heard at once and nothing starts again. A
  part at 0 is not scheduled. The mix is saved (`sound`).
- **More:** the library's acts (ADR 0106), Song information (the chord summary, the key as played, time, tempo and
  tuning as fact cards), Sections (each by name and its first bar, a tap taking the cursor there), Share, Print and
  Export to MIDI (ADR 0107).
- **A visit's own params** (`bar`, `click`, `keys`) are never remembered; a link naming `click` or `keys` opens in
  Listen.
- **Its keys** are drawn by the Player itself and never folded on a phone on its side.

## Consequences

The score editor's Play and its recorder's click keep their own switches. A recording plays in Listen only (ADR 0034).

## History

- 0013 — The Player in Flowkey's shape (2026-09-27). Its engraver is ADR 0087's.
- 0104 — Transpose and Simplify in the tools row (2026-10-26).
- 0105 — The transport's Sound: the count-in, the click and each part's volume (2026-10-26).
- 0115 — A plain Setup: Starting position, Move smoothly, swing feels, the Melody's source (2026-10-27).
- r13 — A scale run's practice: hands, each hand's start octave, tempo, metronome, ticks between loops (2026-10-28).
