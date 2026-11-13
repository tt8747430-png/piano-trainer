# ADR 0105 — The Player: Pace and Hands, a plain Setup, Transpose and Simplify, the transport's Sound

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The Player takes Flowkey's shape: the music on a staff, a cursor on what sounds, a loop over bars, the app waiting
for the learner's notes. Chordify's song screen added a toolbar (Transpose, Simplify), a count-off seen in large
numbers, volume sliders for a mix and a tempo from 50% to 200%. The owner found the Setup's tiles said nothing of
what they changed.

## Decision

- **It plays any Performance** (`usePractice` over a pure practice machine) in three modes: **Listen**, the app
  playing passes queued on the audio clock at a speed the learner plays along at; **Wait mode**, the app waiting for
  the chosen hands' notes from MIDI or the keys and playing the other; **Interpret**, the music following the
  learner's tempo, the other hand sounding at each onset. Play in all; ‹ › step in any. A loop over bars, each lap
  played in Wait mode with nothing skipped; a Wait-mode pass finished is recorded (ADR 0111).
- **Pace** (R36, flowkey's Tempo menu), the transport's: **At your own pace**, Wait mode ("The music waits for the
  right notes.") and Interpret ("The music follows your tempo."), each saying "Connect a piano or show the
  Keyboard." where none is there to play; then **Listen and play along**, 50 % · 75 % · Original tempo and the
  slider (50 % to 200 % of the piece's tempo in 5 % steps, with the beats a minute), each choosing Listen at that
  speed; Speed training below the piece's tempo, in Listen. The button reads ♩ = 92 in Listen (the pass's tempo
  while speed training climbs), else the mode's picture, its name beside it from 640px; its name says the pace.
- **Hands** (R36, flowkey's hands menu): the foot's Hands, where the music has both, says the hands played (Both ·
  Right · Left) and opens "Which hands do you play?": `HandsSegmented`, and with one hand chosen **Hear the other
  hand**, its one home. The hands count in every mode: Wait mode waits for them, Interpret follows them, Listen plays
  them and the other only where it is heard; the keys mark them, the music shows the other hand as Settings › Hands
  says (Show · Dim · Hide), the hands at the keys fade it (ADR 0117).
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
- **The Player's settings** (B7) are its gear's Settings sheet (below), their one home; `/settings/player` and
  `/play/$pieceId/settings` are gone: **Audio playback**, a volume for each staff (by place, saved for every song,
  `sound.staves`), the recording and the metronome, and Only the chords; a row to the **Metronome's** sound and beats;
  **Playback speed** (speed training's step, 2 · 5 · 10%); the Count-in (None · Audible · Visual) with Playback;
  **Display** (Cursor None · Beats · Continuous, the layout, the keys, finger numbers); **Hands** (the hands at the
  keys' Skin, the other hand Show · Dim · Hide); **Pedal** As written · Off · Automatic (`withPedal`, A27). A volume is
  a gain of its share squared, asked as each sound renders; a staff's Play off is a gain of 0. The View's chips for the
  layout, the keys and finger numbers stay as quick toggles over the music, as the transport keeps the metronome's. Clef
  (the reference's "Original or chosen") is not offered yet: the notation has no re-clefing of a staff.
- **The pedal shown** (A27): the sheet draws the pedal as it plays; the Ped. mark the music plays under is lit in
  the playhead's ink while its pedal is down (an id selector, restyling that mark alone); the sustain on the piano's
  rail goes down while the score's pedal holds, keys sounding only under the pedal ringed, apart from a hand's, while
  playing alone.
- **More:** the music's acts, never the library's (those are the song's Settings, ADR 0111): Song information (the chord
  summary, the key as played, time, tempo and tuning as fact cards), Sections (each by name and its first bar, a tap
  taking the cursor there), Share, Print and Export… (ADR 0107).
- **The screen's frame (R31-P):** the bar (Close · title · Edit score | Keyboard · MIDI · Settings) over the score;
  nothing floats over the music. At the foot a docked transport (Loop · Restart · ‹ · Play · › · Pace · Metronome)
  over a foot bar of fixed order: the View, the song tools (Transpose, Version), **Hands** where the music has both,
  and **More**. More holds the music's acts only (Sections, Song information | My recordings, How did I play?,
  Annotate | Print, Tuner, Voice commands, the Rhythm game | Export, Share); every setting is the gear's. The
  customisable Tool bar is gone.
- **The Settings sheet (R31-P, R32, R36)** is one list of rows ranked by what matters, each opening a subpage with
  Back: **Score view** (Pick your view on opening, annotations, the cursor, following), **Playback** (a score's
  Swing, the pedal, the count-in, the Metronome's page and volume, speed training's step), **Hands** (the hands at
  the keys' Skin, the other hand Show · Dim · Hide), **Staves** (each track's Play, Show and volume together; Only
  the chords where a recording plays), a chart's **Accompaniment** (chord size, the pattern and its hands, Swing) and
  **On-screen piano** (the app's own fields). A pattern or figure list closes back to the page it was opened from.
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
