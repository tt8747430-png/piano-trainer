# ADR 0113 — The Metronome and How to use

- **Status:** accepted · **Date:** 2026-10-27 · **Amends:** ADR 0044 and 0052 (Practice's pages), ADR 0096
  (Settings) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §11

## Context

Chordify's toolkit has a Metronome (BPM by −10, −1, +1 and +10; 4/4, 3/4 or 1/1; Clicks, Beeps or a Drum Beat; a
row of squares, the first larger, the beat lit) and How to use, a short guide. The app had a click inside the
Player (ADR 0105) and the recorder (ADR 0028), but nothing to keep time by on its own, and no guide: every
explanation is an ⓘ beside its control, which a learner meets only once they find the control.

## Decision

- **The Metronome is a page of Practice,** `/practice/metronome`, listed with the training (Exercises, Quiz,
  Metronome), its tile the Metronome on grass. It holds, top to bottom, as the owner's example lays it out:
  - **the tempo,** large in the book serif, `BPM` under it, between −10 and −1 and +1 and +10 as round buttons;
  - **a slider** over 30–300 BPM and **Tap tempo:** the average gap between the last five taps, from the second
    tap; a pause of two seconds starts again (`tapTempo`);
  - **two pop-up buttons** side by side, each its picture and its value: the **sound** (Clicks, Beeps, Drum beat)
    and the **time signature** (4/4, 3/4, 2/4, 6/8, 1/4; a beat of 6/8 an eighth, each counted);
  - **one round honey Play** in the middle, Stop while it plays;
  - **the beat shown:** a square for each beat, the first larger, the one sounding filled in honey; the squares
    share the row, so six fit a 320px phone.
  - What it does and its keys are its bar's ⓘ. On a phone on its side the choices and the Play stand in two
    columns; the page fills the room the shell leaves it (`min-h-screen-free`), so the stage stands in the middle.
- **Accents and drums.** The bar's first beat is accented: a click higher (as the Player's), a beep a fifth higher.
  The drum beat is a hat on every beat under a kick on the first (and the third of 4/4) and a snare on the
  backbeat (a waltz's boom-chick-chick; 6/8's snare on its fourth), the kick accented on the first.
- **Synthesised, offline.** A `ClickSound` names its `voice` (`click`, `beep`, `kick`, `snare`, `hat`; a click
  where none is named). The audio port builds each from oscillators and a second of white noise made once per
  context: nothing is fetched, so the Metronome plays offline.
- **Timed by the audio clock.** The beats are planned on the audio clock (`plannedBeats`) a second and a half
  ahead and handed to the port's look-ahead, each at its time; a timer every quarter second only tops the queue
  up. A change of tempo, time signature or sound while it plays drops what was queued and goes on from the beat
  heard (`goOnFrom`): a beat at the new tempo after it, a new bar where the time signature changed. The beat lit
  is the last planned at or before the clock (`beatHeard`), read each frame.
- **Keys.** Space starts and stops it; ↑ ↓ change the tempo by 1, with Shift by 10 (ADR 0036). The screen stays
  on while it plays (`useWakeLock`).
- **Saved.** `metronome: { bpm, meter, sound }` in `pt-settings`, version 13, each read as saved where still
  valid (ADR 0038): 120 in 4/4 with a click at first.
- **How to use** is Settings' **Help** group, one row to `/settings/how-to-use`: six parts in the order a learner
  meets them (finding and organising songs, playing a song, learning a song, editing one, a MIDI keyboard, the
  Metronome), each a few plain steps beside the icon its control wears in the app, each part folding as the
  learner leaves it (`useFold`), two columns from a laptop's width. Its words name the controls as the app does,
  in both languages; no marketing tone.

## Consequences

- **`shared/lib/schedule`:** `metronome.ts` (`METRONOME_METERS`, `METRONOME_SOUNDS`, `BPM_RANGE`, `clampBpm`,
  `beatsOf`, `beatSounds`, `plannedBeats`, `beatHeard`, `goOnFrom`); `ClickSound.voice`.
- **`shared/lib`:** `tapTempo`. **`shared/api/audio`:** the beep, kick, snare and hat (`CLICK_VOICES`).
- **`entities/settings`:** `MetronomeSettings`, `DEFAULT_METRONOME`, `selectMetronome`; version 13.
  **`features/set-preference`:** `setMetronome`.
- **`pages/metronome`:** `useMetronome`, `TempoSteps`, `BeatSquares`. **`pages/how-to-use`:** `GUIDE`,
  `GuideSection`. **`widgets/practice-pages`:** `metronome` in the training; **`shared/ui`:** its `PAGE_TILES`.
- The Player's and the recorder's click keep their own switches; Settings › Recording's switch is the recorder's.
