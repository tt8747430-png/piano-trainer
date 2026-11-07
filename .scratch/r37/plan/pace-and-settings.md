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
- Will build (owner, "remove it"): no pedal setting at all. Playback always pedals as the score marks it, and where
  the score has no marks, as `autoPedal` adds (`withPedal` loses its choice). The learner's own pedal (MIDI CC64, or the bar's
  Sustain held or latched) always sounds and is never graded. Ped. marks show on the score as engraved.

## The song's versions (owner, 2026-11-07: "make the song versions more understandable … why is it so important")
- Today: Version Original · Simple · Easy (`arrangePiece`): Original the chords as written; Simple each chord its
  plain triad (`simplifyChart`); Easy the tune over each chord's root (`easyChart`). "Simple" and "Easy" read alike,
  and the order runs hardest first.
- Why it matters: the same song at the learner's level (flowkey's Beginner · Intermediate · Pro arrangements,
  Chordify's Simplify).
- Will build: **Difficulty**: Easy · Medium · Original, easiest first, no explanation line (owner: "remove this
  weird explanation").

## The keyboard's own button (owner, 2026-11-07: "make the keyboard settings more accessible like in the toolbar at
the bottom as the most right button with proper icon")
- Will build: the transport's last button, **Keyboard** (Lucide Piano, the app's keyboard icon; on a phone the icon
  alone, on a laptop icon and word). It opens the Keyboard panel: Keys Off · 3D · 2D, then only what that kind uses
  (3D: Camera, Show hands, Skin tone while hands show; 2D: Note names, Finger numbers, Keys shown). The keyboard's
  rows leave Settings, which keeps the song (Difficulty · Transpose) and Edit score · Export.

## The Keyboard panel, by what matters (owner, 2026-11-07: "refactor them properly and how they should look and what
is most relevant")
- Will build: the choice of keyboard as three picture tiles, **Off · 3D · 2D** (Chordify's "Pick your view"), the
  chosen one outlined in orange; the panel's title names it, so no "Keys" label. Then only what changes that one:
  3D **Angle** Seat · Above; 2D **Keys** Song · 61 · 76 · 88, **Note names**.
- Goes: **Finger numbers** (the standing ruling: no finger numbers on or under the keys); **Skin tone** to the app's
  Settings (set once, app-wide appearance).

## One home for a hand (owner, 2026-11-07: "I can disable the hand in the keyboard settings and also in the hands
settings right or left")
- Today: Keyboard › **Show hands** hid both 3D hands; Hands › a hand's switch takes that hand off the score, the keys,
  the sound and the 3D hand. Two controls over the same hands.
- Will build: **Show hands** goes. The 3D hands follow the Hands panel alone: an enabled hand is drawn, a dimmed hand
  fades, a switched-off hand is gone (Flowkey and Synthesia set hands in one place). Keys without hands is 2D.

## Keys: the learner's own piano (owner, 2026-11-07: "the piano range is not very understandable", then "I want the
range. but refactor more")
- Today: 2D had **Range** Song · All 88, a choice with no reason given.
- Will build: the row **Keys** Song · 61 · 76 · 88, the sizes pianos are sold in (Synthesia sets the keyboard to the
  learner's): Song (default) fits the song's notes with a key's margin; a number draws that piano, 61 C2–C7, 76 E1–G7,
  88 A0–C8. Keys the song never plays are shaded, so the learner sees where the song sits on their piano. When the song
  goes past the chosen piano, an orange tab at that edge names its furthest note (‹ G1), and the keys' description says
  so.
