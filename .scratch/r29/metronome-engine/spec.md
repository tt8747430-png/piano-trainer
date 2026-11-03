# Spec: one metronome engine (A39, D16, A35, B11)

> **2026-11-03:** where this spec and [`../plan.md`](../plan.md) differ, the plan is newer and wins (prompt D20). Map of round 29's files: [`../README.md`](../README.md).

## Problem
The Metronome page (`schedule/metronome.ts`: six meters, three synthesised sounds, accent on beat 1 only, no
subdivision), the Player's click and count-in (`schedule.ts`'s `click` sounds) and the recorder's clicks
(`recorder-clicks.ts`) are three implementations. 6/8 clicks eighths at the tempo; the Player's click doesn't
use the Metronome's sound.

## Decision
1. **Model** (`shared/lib/schedule/metronome.ts`, pure):
   ```ts
   interface Meter { beats: number; unit: 1|2|4|8|16; groups?: readonly number[] }  // 7/8 as [2,2,3]
   type BeatLevel = 'accent' | 'normal' | 'silent'
   type Subdivision = 'none' | '8ths' | 'triplets' | '16ths' | 'swing'
   interface Click { at: number /*s*/; level: BeatLevel | 'sub'; beat: number; bar: number }
   function clicks(meter, levels, subdivision, tempo: Tempo, from: number, to: number): Click[]
   ```
   The tempo counts the meter's beat: a dotted quarter in compound meters (6/8, 9/8, 12/8), a half in 2/2;
   odd meters by their groups, the accent on each group's first beat (stronger on the bar's first). `levels`
   is the beat squares' cycle (accent · normal · silent), defaulting to accent on each group's start.
   Tempo changes: `clicks` takes a tempo map (the Performance's tempo marks), so the Player's click follows
   the score and the slider.
2. **Trainers.** The bar trainer (play n, mute m) and the speed trainer (from A to B BPM by n every m bars)
   are pure transforms of the click stream (`metronome-trainers.ts`).
3. **Sounds** (D16): CC0 one-shots in `public/samples/metronome/` (woodblock, clave, rimshot, cowbell, click,
   and a kit: kick, snare, closed and open hat, ride), each an accent and a normal stroke, under 300 KB
   together, `SOURCES.md` with each file's source and licence, cached by the `/samples/` route. The Drums
   sound is a groove per meter (4/4 kick 1 & 3, snare 2 & 4, hat on 8ths; 3/4 kick 1, snare 2 & 3; 6/8 kick
   1, snare 4, hat each 8th), the hat on the subdivision. Synthesised click is the fallback until loaded.
   The spoken count is not offered until the owner's recording exists.
4. **One engine** (`shared/lib/services/use-metronome.ts` over the audio port): schedules `Click`s ahead on
   the audio clock (the existing lookahead), and exposes `beatAt(audioTime)` so the beat squares and the
   optional full-screen flash draw from the same clock. Used by the Metronome page, the Player's click and
   count-in, the recorder's clicks and the quick metronome (B11). `recorder-clicks.ts` and the Player's own
   click code are removed.
5. **Settings** (one set, home `metronome` in the registry): sound, accent pattern per meter, subdivision,
   volume, flash, count-in bars, trainers, saved tempos (`metronome.tempos`, max 20). `pt-settings`'
   `metronome` widens: `meter: string` (any signature the shared time control writes, sanitised),
   `levels`, `subdivision`, `volume`, `flash`, `speedTrainer`, `tempos`; the version bumps.

## Tests
- Each meter's clicks over two bars: 4/4, 3/4, 2/2, 6/8 (two beats a bar at the dotted quarter), 9/8,
  12/8, 5/8 (3+2 and 2+3), 7/8 (2+2+3); accents and silent beats; each subdivision's times; swing ratio.
- A tempo change mid-bar moves the following clicks; the slider's factor scales them.
- Drum pattern per meter; bar and speed trainers.
- The page's beat square lights at the click's audio time (fake clock).

## ADR
0052 (the Metronome) and 0105 (the Player's click): one engine.
