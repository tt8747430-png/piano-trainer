# R39-12 · The Tools, redesigned: Metronome, Tuner, Chord finder, Circle of fifths

Premium here means each tool is one instrument on one screen, its reading large enough to see from the piano bench, its
settings behind its own gear, as Soundbrenner's metronome and a hardware tuner are.

## The rulings as they stand

- "Metronome: BPM large with −10 −1 +1 +10, a slider, Tap tempo, sound and meter, one Play, beats as squares; beats you
  set (accent, normal, silent), any meter, subdivisions, recorded sounds; one engine for the page, the Player and the
  quick metronome."
- Every Practice page has its own settings (a gear); a key is the root grid; a choice with its own list opens a page
  (Speed trainer ›, Silent bars ›); no explanation line under a control (an ⓘ at most).
- The Tools menu in the bar stays (`widgets/tools-sheet`); these are the tools' own pages.

## Today

`src/pages/metronome`, `tuner`, `chord-finder`, `circle-of-fifths`; strings `practice.ts` `metronome`, `tools`,
`chordFinder`. Metronome: the tempo between round buttons, squares, a slider, Rhythm selects, Practice aids as toggles
with ⓘ, a floating Play over them. Tuner: one line saying the microphone is unavailable, the reference pitch below.
Chord finder: four icons in the bar, a card with Try a chord. Circle: the wheel with tiny labels, a line under it
.

## Will build (canvas rows 11 to 14)

Metronome: the tempo large with −10 −1 +1 +10 and its mark (Allegro); slider and Tap tempo; the beats as squares, each
tapped round Accent · Beat · Silent and lit as it plays; Rhythm (Time signature ›, a sheet of 2/4 … 12/8 and Other…;
Sound ›), Subdivision None · 8ths · Triplets · 16ths · Swing; Practice aids Speed trainer › and Silent bars ›, each
with its state; one Start/Stop at the foot. Settings: Click sound, Volume, Count-in, Flash the screen on the beat.
Tuner: a gauge −50 to +50 cents with the in-tune band, the note large (A4), In tune · Flat · Sharp, cents · Hz; the
keys show the note heard; without the microphone, The Tuner listens and Allow the microphone; Reference pitch A4 = 440
Hz − + (its settings on a phone, beside the gauge on a laptop).
Chord finder: Spelled in C major ▾ (root grid); the chord large (Cmaj7/E) with Play, its name in words and its numeral;
its notes with degrees, the bass marked; Also read as; Played (the last chords with numerals); In these keys; Clear the
keys and Open in Chords above the keys. Empty: Play or tap a chord with Try a chord. Settings: Connect a piano,
Remember the chords played, All piano settings.
Circle of fifths: majors outside with their signatures, minors inside; a tap chooses a key, its neighbours lit; the
key, its signature, relative minor, its neighbours, the diatonic chords marked by role, Open in Scales and keys.

## History

- 2026-11-08: drawn (canvas v10); waiting for the owner.

Sources: Soundbrenner Metronome (beats you set, subdivisions), Chordify's metronome; a chromatic tuner's cents gauge
(Peterson, TonalEnergy); the app's chord finder strings; `circle-of-fifths` in `practice.ts`.
