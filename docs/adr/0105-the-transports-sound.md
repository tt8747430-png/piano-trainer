# ADR 0105 — The transport's Sound: the count-in, the click and each part's volume

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0085 (the Setup's How it plays), ADR 0099 (the
  transport) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §1.4, §5

## Context

The Player had a metronome and a count-in, two tiles among the Setup's How it plays. The count-in was heard and
never seen. Nothing in the Player could turn a part down: a piece's recording, its staves over the piano and both
hands always played as loud as they are. The learner's speed ran from the presets and a slider of beats a minute,
at most the piece's own tempo for some pieces.

Chordify keeps these things by its transport. Its count-off counts a bar down in large numbers at the song's tempo,
a click on each beat, the first accented. Its volume sliders "create your perfect mix", with the tip "turn the Song
volume down and the chord volume up to only hear the chords". Its tempo runs from 50% to 200% of the song's, in 5%
steps.

## Decision

- **Sound, the transport's seventh control,** after the loop: a speaker, its popover holding, in this order:
  - **Count in**, a switch: the saved `countIn` toggle. While Listen counts its bar in, the beats left (4 3 2 1)
    stand large over the music, each as its click sounds, the first click accented; a screen reader hears each.
  - **Click**, a switch: the saved `metronome` toggle, the click while the music plays.
  - **Volume**, a slider each from 0 to 100% in 5% steps: the right hand, the left hand, the staves over the piano
    where the music has any, the recording where the piece has one, and the click (the count-in's and the
    metronome's).
  - **Only the chords**, where the piece has a recording: the recording to 0, both hands to 100%.
- **One place each.** The count-in and the click leave the Setup's How it plays, which keeps swing, the tune and
  the recording, and is not shown where it has none of them.
- **Saved.** The volumes are `sound: { rh, lh, staves, recording, click }` in `pt-settings`, version 11, whole
  percents, a field of any other value read as 100 (ADR 0038, no migration).
- **Heard as the ear hears.** A volume is a gain of its share squared, so half way down is about a quarter as loud.
- **Applied where a sound is rendered.**
  - The audio port's `play` takes a gain, asked as each sound is about to be rendered: a note's velocity and a
    click's loudness scale by it. A slider moved while the music plays is heard from the next sound rendered, at
    most a quarter of a second on, and starts nothing again.
  - A part at 0 is not scheduled at all, and one turned up from 0 joins from the beat group playing. The click at
    0 still counts its bar in, unheard and shown.
  - The recording's element takes its volume as it starts and follows it as it plays; at 0 it is not played.
  - Wait mode's accompaniment and a beat group stepped to play at the same volumes.
- **Tempo.** The learner's speed runs from 50% to 200% of the piece's tempo in 5% steps on the tempo popover's
  slider, beside its presets. `TEMPO_RANGE` runs to 320, twice the fastest a piece is written at. Speed training
  is unchanged.

## Consequences

- **`entities/settings`:** `sound`, `SOUND_PARTS`, `selectSound`; `PLAYING_TOGGLES` is gone.
- **`features/set-preference`:** `setSound` and `onlyTheChords`.
- **`shared/lib/schedule`:** a note scheduled from a piece names its `part`; a pass says when its count-in's
  beats sound (`counts`), and `countAt` counts them down; `clicks: false` counts a bar in unheard; `volumeGain`.
- **`shared/api/audio`:** `play` takes a `SoundGain`, `playRecording` a volume.
- **`features/practice`:** `Mix`, `mixGain`, `heardIn`; `usePractice` takes the mix and says `counting`.
- **`widgets/practice-player`:** `SoundButton`, `CountInBeat`; the transport has seven controls. Under 390px
  they are 40px and ‹ › 32px; under 360px ‹ › are 28px, Play 48px and the tempo's padding narrower, so the seven
  fit from 320px (`DOCK_BUTTON`, `DOCK_STEP`, the `small-phone` variant).

The score editor's transport and its recorder's click (ADR 0028, 0096) keep their own switches.
