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
- **Two kinds of song** (`hasWrittenStaves`): a **score**, whose piano staves are written out in every bar, plays its
  staves as written; a **chord chart** (the piano played from its chords by a pattern, a tune staff over it or not)
  gets an accompaniment. `controlsFor(kind)` (`widgets/practice-player/model/controls.ts`) holds which controls each
  kind is offered (score, chart, lesson example, progression, exercise); a control that changes nothing for a kind is
  not shown (R30).
- **The Setup** (`PieceSetup`) holds how a piece is arranged and how it plays, plainly:
  - **Staves**, first: each staff by its name and clef (the single staves top down, the Upper and Lower staff),
    then a song's **recording** as a track of its own; each with **Play** and **Show** (the recording Play alone),
    all on until switched off, in the URL (`staves=u1s0,l0s1`, kept per piece). The last staff in sight keeps Show;
    the recording's Play is greyed, with why, in another key. Melody is gone: staves are staves (ADR 0097).
  - **Accompaniment from the chords**, a chart's alone: the pattern over its two hands, each hand's figure drawn as
    a small piano roll (changing a hand makes it the learner's mix, with Back to the pattern), the first chord's
    **Inversion** and **Smooth voice leading** (ADR 0047), and **Swing**, four feels as tiles. A score's Swing stands alone
    under How it plays (the schedule swings its written 8ths too).
  - The song's key is not in the Setup: it is Transpose.
  - **A scale run's practice** (the Scale exercise, `ScalePracticeFields`), as the reference app's Practice Scale
    sheet: Hands; the octave each hand playing starts on (C1–C7 as a strip, `rhOctave=`/`lhOctave=`; one whose run
    would leave the keyboard greyed with where it would go, never hidden; a hand left unchosen starts where the run
    fits, the left an octave or two below); the tempo; the metronome; and **Ticks between loops** (`rest=`, none to 4
    beats): each repeat of the loop after the first waits that many beats, a click on each where the click sounds,
    counted down as a count-in is (`LoopOptions.rest`).
- **Transpose** (ADR 0115) moves a piece −5 to +6 semitones, into its simplest key; the recording moves with it,
  stretched (ADR 0034). **Simplify**, a switch, plays and shows each chord as its plain triad on its root
  (`simplifyChart`): a slash chord's bass and added notes dropped, a chord held on where the next simplifies to it, a
  bar of no chord and written notes left as they are. It changes the music, so every view, Wait mode and the MIDI
  export follow; the song's page and its lessons read the piece as written. It is greyed where nothing would change.
  Both are kept per piece (`key`, `simple`). A progression's, a walk's or an exercise's key stays in its own Setup:
  there it chooses what is practised.
- **The metronome** in the transport is a quick toggle (pressed while the click sounds). The click and the count-in
  are the Metronome's engine (A39): its sound (click, beep, the drums' kick, snare and hat) at its levels, its beat
  squares where they were set for the music's meter, on the meter's counted beats (the dotted beat in 6/8) at the
  tempo the music keeps there (`ClickVoicing`, `voicedClick`).
- **The Player's settings page** (B7; `/settings/player` in Settings, and a song's gear in the bar opening the same
  page in the Player's place, `/play/$pieceId/settings`, Back to the song as played): **Audio playback**, a volume
  for each staff (by place, saved for every song, `sound.staves`), the recording and the metronome, and Only the
  chords; a row to the **Metronome's** sound and beats; **Playback speed** (speed training's step, 2 · 5 · 10%);
  the Count-in (None · Audible · Visual) with Playback; **Display** (Cursor None · Beats · Continuous, the
  layout, the keys, finger numbers); **One hand** (the other hand Show · Dim · Hide, and Play the other hand, Wait mode's accompaniment);
  **Pedal** As written · Off · Automatic (`withPedal`, A27). A volume is a gain of its share squared, asked as each
  sound renders; a staff's Play off is a gain of 0. The View's chips for the layout, the keys and finger numbers stay
  as quick toggles over the music, as the transport keeps the metronome's. Clef (the reference's "Original or
  chosen") is not offered yet: the notation has no re-clefing of a staff.
- **The pedal shown** (A27): the sheet draws the pedal as it plays; the Ped. mark the music plays under is lit in
  the playhead's ink while its pedal is down (an id selector, restyling that mark alone); the sustain on the piano's
  rail goes down while the score's pedal holds, keys sounding only under the pedal ringed, apart from a hand's, while
  playing alone.
- **More:** the library's acts (ADR 0106), Song information (the chord summary, the key as played, time, tempo and
  tuning as fact cards), Sections (each by name and its first bar, a tap taking the cursor there), Share, Print and
  Export to MIDI (ADR 0107).
- **The screen's frame (R31-P):** the bar (Close · title · Edit score | Piano keys · MIDI · Settings) over the score;
  nothing floats over the music. At the foot a docked transport (Loop · ‹ · Play · › · Tempo · Sound) over a foot bar
  of fixed order: the View, the song tools (Transpose, Version), Mode and **More**. More holds the music's acts only
  (Sections, Song information | My recordings, How did I play?, Annotate | Print, Tuner, Voice commands, the Rhythm
  game | Export, Share); every setting is the gear's. The customisable Tool bar is gone.
- **The Settings sheet (R31-P)** is a page of rows, each opening a subpage with Back: the music's own first —
  **Staves** (each track's Play, Show and volume together; Only the chords where a recording plays) and, for a chart,
  **Accompaniment** (chord size, the pattern and its hands, Swing) — then While you play: **Playback** (a score's
  Swing, the pedal, the count-in, the Metronome's page and volume, speed training's step, the other hand),
  **On-screen piano** (the app's own fields) and **Display** (Pick your view on opening, annotations, the cursor,
  following). A pattern or figure list closes back to the page it was opened from.
- **Version (R31-P):** titled Version; the Arrangement (Your version · Piano solo · Piano and voice) a segmented
  switch at its head, changed at once; then Original, Simplified, Easy, each with its difficulty and a plain line.
  Where Simplified changes nothing, its line says "Its chords are already simple" and it cannot be chosen.
- **Transpose with a preview (R31-P):** − + and Reset change only what the popover shows, the key it lands in and the
  first line in that key (`PreviewLine`, `widgets/transpose`, the editor's too); **Transpose** applies it.
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
- r26 — One Sound in both modes: the editor's transport ends with the Player's Sound (its icon, name and place), a take's Metronome and Play melody over each part's volume; the click is called Metronome in both; the tools row's room over the score fits the capsule (2026-11-01).
- r29 — A score plays its staves (Play and Show per staff, the recording a track); only a chart gets an accompaniment; Melody gone; the Player's settings page; the click from the one metronome engine; the pedal shown (2026-11-03).
- r29 (Player plan) — One gear: the bar is Close · title · Edit | Piano keys · MIDI · Settings, no Setup and no More. The Player's Settings is one sheet (Flat's one menu; a panel at the right on a laptop): in the owner's order: the music's own choices; While you play (Audio playback, Playback, Display as pages inside it, Metronome); This song (Sections, Song information); Share (Export…, Print, for any music). The library's acts are the song page's, Score settings the editor's gear. On a laptop the panel stays open beside the music; a one-hand song plays both hands, a hand chosen before forgotten. `/play/$pieceId/settings` is gone. Hear the other hand sits in the transport's hands popover; music of one hand has no hands button (2026-11-03).
- r29 (T) — Transpose is one control in the Player and the editor: − key +, Reset, Transpose key signature, Transpose chord symbols. The Player keeps an offset from the written key (`transpose`, −5 to +6; `tkey`, `tchords` when off), so a song the editor rewrites in another key still plays moved by the learner's choice; it never writes the song. Shared links carry the offset (2026-11-04).
- r31 (P) — The docked transport over a foot bar with More; the Tool bar setting gone; the Settings sheet as subpages (Staves with each track's volume, Accompaniment, Playback, On-screen piano, Display); Version with Arrangement and plain lines; Transpose with a preview applied by its button (2026-11-05).
- r32 (R32-A) — Performance: the sheet's lines memoised (`SheetLine`), a line rendering only as the music enters or
  leaves it, lines out of sight skipped by the browser (`drawn-in-sight`); the keys' looks memoised; the lookahead
  reads only its due head (Fantaisie-Impromptu, 10 s: 2.25 s blocked → 0.6 s). Nothing reserved: the Player's rows
  meet, the status row only while it speaks, the tip a capsule over the music's foot. Settings one ranked list —
  Score view, Playback, Staves, Accompaniment, then a link to the On-screen piano's page, the one home of every
  keyboard's settings — each row with its line and value, each option with its line. `/settings/player` is gone: the
  Player's gear is its settings' home. MIDI shows only while connected; the tempo reads ♩ = 92; a laptop's dock is one
  row from 80rem (2026-11-05).
- r34 — The recording plays in any key, shifted with Transpose; its own-key ⓘ and the Staves row's reason gone.
- r34 — Staves › Recording has Sync under its volume: Earlier and Later in 10 ms steps, kept with the song.
- r34 — The switch is Smooth voice leading, the term for the nearest inversion (2026-11-06).
- r35 — Count-in, the noun, names the Player's row and the calibration's count, as it does the editor's (2026-11-06).
