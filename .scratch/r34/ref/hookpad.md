# Hookpad: the chord and melody editor, with its Band editor

Source: https://hookpad.hooktheory.com/?idOfSong=kygzWeWbxKB&enableYouTube=false&openBandEditorOnInit=true, loaded
fully in a headless browser 2026-11-06 (`hookpad-band-laptop.png`, script `.scratch/r34/hookpad.mjs`). Hookpad is
Hooktheory's paid app: ideas only.

## What it has

- **Top bar:** Play, Record (chords in time, with count-in), Loop (shift-click: the whole project), Click, Mixer
  (volume, solo, mute per lead, harmony, bass, drums); Meter, Key (any key and mode), Tempo; Band, Lyrics, Sections,
  Audio (a recording's track, synced); Aria (AI ideas by genre and mood); Guides (highlight the scale degrees in each
  chord), Metrics (the song's statistics); Lock, Nudge ¼ beat, Zoom, Zoom H.
- **Entry bar:** duration (¼, ½, 1, 2, 4 beats), Add, Split, Tie; **the seven chords of the key as coloured Roman
  numeral tiles** (I ii iii IV V vi vii°, with the letter names under), rest.
- **Six ways to choose a chord:** Magic (suggested next chord), Popular (the chords that most often follow, from their
  song data), Search (type a name like Cm7/G), Tone Sets (chords that contain chosen notes), Bass Sets (common chords
  over each bass note), Progressions (common progressions that fit here).
- **Chord Properties (the Inspector):** Type (triad, 7, 9, 11, 13), Inversion (none, 1st, 2nd, 3rd), Options (sus2, sus4,
  ∆-sub, add9, add11, add13, no3, no5, ♭5, ♯5, ♭9, ♯9, ♯11, ♭13), **Secondary** (V/, IV/, vii°/), **Borrow from**
  (another mode). The Roman numeral updates: IV(add9).
- **The staff:** a measure ruler, the audio track's waveform, a melody grid by scale degree (rows 1–7, each in its
  colour), the chord row as coloured blocks with numerals and letters.
- **Band editor:** tracks Lead 1, Harmony, Bass, Drums, each with a sound and a **playing pattern** (Piano: Sustain full
  chords, Sustain three notes, Rolled chords, 2 beats, 1 beat, 1 beat offbeat, 1 beat upbeat, ½ beats, ½ beats up and
  down…), volume, octave, MIDI clip export; Add track, Duplicate, Copy or paste a band; sound families Keys, Vocals,
  Orchestral, Synth pads, Percussive pads, Guitars.
- **Settings:** labels Relative (I, ii) or Absolute (C, dm); colour scheme diatonic-centric, major-centric or
  scale-centric; **degree colours for colour-vision deficiency** (two palettes) and Boomwhacker; section colours; line
  wrap; which staves show; a piano or guitar for entry; pickup measure; entry mode (table or text); snap; note height;
  smart octave; touch "peek under finger"; continuous scroll; auto-add measures; MIDI in.
- A library of about 12,000 songs' chords and melodies to paste in, transposed to the project's key.

## Against ours

Our progression editor (`pages/progression-editor`) is a form: a name, major or minor, a style, and lines of chords
typed as text. The Chord player plays chords by tapping; Accompaniment holds patterns.

## Worth porting, in order

1. **Roman-numeral chord tiles of the key** in the progression editor, the score editor's chord symbols and the Chord
   player: tap to add, coloured by degree (Hooktheory item 1), letters under.
2. **A chord's properties in place:** type (triad, 7, 9, 11, 13), inversion, sus and add options, alterations,
   **secondary (V/, IV/, vii°/)** and **borrowed from a mode**, the numeral and the name updating together.
3. **Choosing the next chord:** what usually follows (from our own progressions library and lessons' rules), chords
   containing chosen notes, chords over a bass note, a progression that fits; typing a name stays.
4. **Duration, split and tie** for chords on a beat grid, so a progression has rhythm, with record-in-time and count-in.
5. **Band for a progression:** our accompaniment patterns as the harmony's playing pattern, a bass track and a drum
   pattern, each with volume and octave; solo and mute.
6. **Degree palettes for colour-vision deficiency** in Hooktheory item 1's setting, and Relative or Absolute labels.

Left out: Aria (AI), the song library (their data), audio import.
