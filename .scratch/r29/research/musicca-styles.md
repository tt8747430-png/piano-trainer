# How Musicca's chord player builds its styles (facts only)

Source: the saved `piano-data/musica/presets.json` (25 presets), read for structure only; no licence is
stated, so none of its patterns, words or sounds ship. Read 2026-11-04 for R29 CP3.

## The preset

- 25 presets in 10 families: Pop 1–5, Rock 1–2, Melodic 1–4, Hip hop 1–2, Disco 1–2, Reggae 1–2,
  Jazz 1–4, Blues 1–2, Classical 1–2 (the UI also lists Funk 1–2).
- Each preset: a family (`type`), a time signature (all `4/4`), a `swing` flag (Jazz 1–4, Blues 1–2,
  Reggae 2), which instruments it uses (piano, guitar, bass, drums; Classical: piano and guitar only),
  and four variations.
- A variation is shown in the section's Variation choice only where the preset marks it shown: Pop 5,
  Melodic 1–4, Disco and the Jazz and Blues presets show 3 or 4; most show only variation 1 by default.

## A variation

- Per instrument, two bars of **16 steps** (a 4/4 bar in 16ths): `main` (every bar) and `last` (the
  section's last bar on its last repeat: the fill).
- **Piano and guitar:** which steps strike (`1` = strike and ring to the next strike, a number above 1
  a short note), a playing style (`chord` block, `arpeggio-up`, `arpeggio-up-down`, `broken-chord`),
  and a per-step **velocity** array (e.g. 100 on beat 1, 70–80 on the beats, 50 on the off-16ths): the
  feel comes from the accents, not from the rhythm alone.
- **Bass:** a step rhythm on the chord's root (a marked step plays the root an octave up), with its own
  per-step velocity. No written melodic line: the bass follows the chord's root.
- **Drums:** 11 voices, each 16 steps on/off: kick, snare, cross-stick, closed hi-hat, open hi-hat,
  pedal hi-hat, ride, crash, high tom, mid tom, floor tom. The `last` bar is the fill (toms on steps
  12 and 14, snare runs on 8–15, a crash on the next downbeat).
- A variation may ask for a **crash on the section's first beat** (the hi-hat and ride left out on that
  step so it is heard).

## How the variations differ (Pop 1 as the typical case)

1. the groove: closed hi-hat in 8ths, snare on 2 and 4, kick on 1, the "and" of 2, and 3;
2. the same with the ride for the hi-hat (a bigger sound for a chorus) and a tom fill;
3. a busier one (16th hi-hat or more kicks);
4. **half time**: the hi-hat only on 2 and 4 (an intro or a breakdown), piano once a bar.

Rock: piano and bass in 8ths, open hi-hat in 8ths, a crash at the fill's start. Disco: four on the
floor, open hi-hat on the off-beats, the bass in octaves. Reggae: the piano on the off-beats (the
skank), the kick on beat 3 (one drop). Jazz: ride "ding, ding-a-ding", pedal hi-hat on 2 and 4, the
piano comping once or twice a bar, the bass on every beat. Blues: shuffle in triplets, ride and
snare on 2 and 4.

## Time, swing and length

- Every step grid is one 4/4 bar; another time signature takes its own step count (beats × 4).
- **Swing** is a triplet grid, not a delayed 8th: the fourth 16th of each beat is dropped, the other
  three fall on the beat's triplets, the tempo kept.
- A chord lasts 1 to 6 beats in their editor; a pattern restarts at each bar, and a chord change
  inside a bar re-strikes the piano and the bass on the next marked step at or after it.
- Count-in: one bar on the hi-hat. Stop: a fade over two beats; the last chord rings 3 s.

## What ours take from this (CP3)

The structure: a style is a family and a number, parts per instrument (piano, bass, drums), up to four
variations chosen per section, a 16-step grid per 4/4 bar with velocities as the feel, a fill on the
section's last bar on its last repeat, a crash on a section's first beat, swing as a triplet grid. Our
patterns are written by us (`src/entities/pattern/content/styles/`); our piano parts are our own
accompaniment patterns (`entities/pattern`), and our bass lines name degrees (root, fifth, octave,
third, an approach to the next chord) where Musicca's play the root alone.
