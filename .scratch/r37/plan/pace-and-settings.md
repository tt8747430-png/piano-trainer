# R37 — Pace and Settings, simplified (canvas)

## Source
- Owner, 2026-11-07: "research and look at all the resources and app examples and improve the other settings like
  the pace and the main player settings. what order should be how they are made, how should they be simplified and
  all other best practices … also the apple guidelines of making simple practical ui".

## Research
- Flowkey's tempo menu (`flowkey/09`): two short groups, "Learn at your own pace" (Wait Mode) and "Listen and play
  along" (50 % · 75 % · Original); nothing else.
- Chordify (IMG_4552–4573): Transpose · Capo · Simplify in a strip over the music, tempo · volume · loop in the
  transport, everything rarer under ⋯ (setlist, view settings, share, export, song information).
- Flat's Playback options (`flat-score-editor/05`): three rows, each a page.
- Apple HIG (Settings, Sheets, Popovers, Toggles, Segmented controls): show only what applies now; most used first;
  group related; one home per setting; good defaults; a switch for on/off, a segmented control for 2–5 choices;
  don't duplicate system controls (volume).

## Will build (canvas, phone and laptop)
- **Pace:** Wait mode · Interpret · Listen. Only Listen shows Speed, Count-in, Metronome (Wait mode waits, Interpret
  follows: none of them act). Loop's switch leaves Pace (the transport's Loop is its one home); while a loop is set,
  "LOOP BARS 5–8": Repeats · Between repeats · Speed up (Listen only).
- **Settings:** Song (Version · Transpose · Pedalling) first, then Keyboard (Keys Off · 3D · 2D, then only what that
  kind uses; Skin tone only while hands show), then Edit score · Export. The Volume row goes: the device's volume,
  and each hand's in Hands.

## The pedal (owner, 2026-11-07: "what is the purpose of this pedalling thing it is very weird")
- Today: Settings › Pedalling As marked · Off · Auto chose how *playback* uses the sustain pedal (`withPedal`):
  the score's Ped. marks, none, or `autoPedal`'s. A learner can't tell the three apart.
- Research: Synthesia, flowkey, Skoove, Simply Piano expose no pedal setting in their players; a connected MIDI
  keyboard's pedal simply sustains (Synthesia 0.7.1). Soundslice shows Ped. marks but its synth ignores them.
- Will build: one switch, **Sustain pedal** (on): playback pedals as the score marks it, and where the score has no
  marks, as `autoPedal` adds; off, every note stops when it ends. The learner's own pedal (MIDI CC64, or the bar's
  Sustain held or latched) always sounds and is never graded. Ped. marks show on the score as engraved.
