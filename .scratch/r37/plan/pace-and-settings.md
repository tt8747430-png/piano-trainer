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
  3D **Angle** Seat · Above, then for 3D and 2D alike **Keys** Song · 61 · 76 · 88 and **Note names**.
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
  88 A0–C8.
- Owner, 2026-11-07: "I dont need this greyed piano not used keys": every key is drawn alike; no shading.
- Owner, 2026-11-07: "I dont need this note showing": no tab for notes past the chosen piano.

## Note names and Keys on the 3D piano too (owner, 2026-11-07: "I want to be able to show the notes and change size
also on the 3d piano")
- Will build: under 3D, after Angle, the same **Keys** and **Note names** rows as 2D, one setting each for both kinds.
- Keys on 3D: the camera frames the chosen piano instead of the song, as `frame()` already does for a range, without
  its least key size (the learner chose the size). The band is as tall as the keys need: a wider piano, a shorter band,
  the score moving up into the room left (Song keeps today's height).
- Note names on 3D: each C named on its key's front (C2, C3…), the notes being played named in bold, as on 2D. A name a
  hand covers is not drawn over the hand; names on keys narrower than 14 px are left out.

## Modes named for what happens (owner, 2026-11-07: "make more understandable and useful modes. look at all the
examples and research more")
- Today: Pace lists Wait mode · Interpret · Listen in one group. "Interpret" says nothing of what it does, and "Listen"
  hides that the learner plays along.
- Research: flowkey groups its menu "Learn at your own pace" (Wait Mode) and "Listen and play along" (50 % · 75 % ·
  Original). Synthesia: Melody Practice (waits) · Song Recital (keeps going) · Watch and Listen. Skoove: Listen · Learn
  (waits) · Play (in time). Piano Marvel: Practice (waits) · Assess (in time, scored). Every one splits *the music waits
  for you* from *you keep up with the music*, and names each by what the learner does.
- Will build: Pace in two groups with headers, no other text:
  - **At your own pace:** **Wait for me** (`wait`: the music stops until the right notes), **Follow me** (`follow`: the
    music takes the learner's tempo).
  - **With the music:** **Play along** (`listen`: the music plays at the speed set).
  - The transport's Pace button names the mode the same way. Internal ids stay.

## Tempo for every mode that moves (owner, 2026-11-07: "make more understandable options, why only the play along has
these settings")
- Today: Speed · Count-in · Metronome showed only under Play along, though Follow me runs at a tempo too: it starts at
  the speed set and follows the learner within 40–200 % of it (`followTempo`).
- Will build: a **Tempo** group after the modes, for every mode: **Speed** (Follow me: **Starting speed**),
  **Count-in**, **Speed up each pass**, **Metronome** (in Follow me it ticks at the learner's tempo as it follows).

## Wait for me keeps its settings; the metronome is the learner's (owner, 2026-11-07: "why the wait for me doesn't have
the setting and why they disappear and also make the metronome customizable")
- Today (canvas v113): choosing Wait for me hid the whole Tempo group. The app's Wait mode does pace the other hand,
  the accompaniment and the rests at `tempo` (`features/practice`), so Speed matters there too.
- Ruling: a control that cannot act now is shown disabled, not hidden, so the panel keeps its shape between modes and
  the learner sees what another mode offers (Apple HIG: hidden controls make people wonder where they went; disable
  one that is temporarily unavailable).
- Will build:
  - **Wait for me:** Speed enabled; Count-in, Speed up each pass and Metronome dimmed (nothing keeps time while the
    music waits).
  - **Follow me:** Starting speed, Count-in and Metronome enabled; Speed up each pass dimmed (the learner sets the
    pace).
  - **Play along:** all enabled.
  - Metronome on shows a **Metronome** group: **Sound** Click · Beep · Drum; **Accents**, one dot a beat, a tap
    cycling Downbeat · Accent · Normal · Silent (default the first beat accented); **Clicks per beat** 1 · 2 · 3 · 4;
    **Volume**, a slider (70 %). These are the Metronome tool's own settings (`shared/lib` metronome sounds, beat
    levels, subdivisions), one implementation.

## The Sheet's own settings (found while checking)
- Today (canvas): tapping the Sheet pill while it showed turned pages ↔ line; it had no settings panel, though every
  other view's pill opens one.
- Will build: the showing Sheet's pill opens **Sheet**: **Layout** Page · Line; **Cursor** Off · By note · Smooth
  (default By note); **Follow the music** (on); **Your marks** (on).

## Player settings still to port into the canvas homes
| Setting (app today)                 | Home in the canvas                                   |
| ----------------------------------- | ---------------------------------------------------- |
| Staves and recording volumes        | Hands menu, beside each hand's volume                |
| Accompaniment pattern and swing     | Pace, a group shown for accompaniment pieces only    |
| Show on open (first view)           | the view's settings: "Open with this view"           |
| Piano skin                          | app Settings, Sound and piano                        |
| Pedalling marks                     | dropped: the score's own pedal marks show            |
